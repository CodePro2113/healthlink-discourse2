
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0"

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Together AI API client
async function generateSummaryWithAI(articleTitle: string, articleContent: string): Promise<string> {
  const togetherApiKey = Deno.env.get("TOGETHER_API_KEY")
  
  if (!togetherApiKey) {
    throw new Error("TOGETHER_API_KEY is not set in environment variables")
  }
  
  const response = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${togetherApiKey}`
    },
    body: JSON.stringify({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "system",
          content: "You are a medical assistant specialized in summarizing research papers and medical news. Provide a clear, concise summary of the medical content provided. Focus on the key findings, methodologies, and clinical implications."
        },
        {
          role: "user",
          content: `Please summarize this medical article:\n\nTitle: ${articleTitle}\n\nContent: ${articleContent}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("Error from Together AI API:", errorText)
    throw new Error(`Together AI API error: ${response.status} - ${errorText}`)
  }
  
  const data = await response.json()
  return data.choices[0].message.content
}

// Main serve function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const { articleId } = await req.json()
    
    if (!articleId) {
      return new Response(
        JSON.stringify({ error: "articleId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Fetch the article from the database
    const { data: article, error: fetchError } = await supabase
      .from("news_articles")
      .select("*")
      .eq("id", articleId)
      .single()
    
    if (fetchError || !article) {
      console.error("Error fetching article from database:", fetchError)
      return new Response(
        JSON.stringify({ error: "Article not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Check if the article already has a summary
    if (article.ai_summary) {
      return new Response(
        JSON.stringify({ summary: article.ai_summary }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Generate a summary using Together AI
    const summary = await generateSummaryWithAI(article.title, article.summary)
    
    // Update the article with the summary
    const { error: updateError } = await supabase
      .from("news_articles")
      .update({ ai_summary: summary })
      .eq("id", articleId)
    
    if (updateError) {
      console.error("Error updating article with summary:", updateError)
      // Return the summary even if we couldn't save it
      return new Response(
        JSON.stringify({ summary, warning: "Could not save summary to database" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    return new Response(
      JSON.stringify({ summary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error processing summarize request:", error)
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
