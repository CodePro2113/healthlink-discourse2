
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0"
import { parse as parseXML } from "https://deno.land/x/xml@2.1.1/mod.ts"

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-schedule',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// RSS feed sources - limited to improve performance
const RSS_FEEDS = {
  pubmed: {
    general: "https://pubmed.ncbi.nlm.nih.gov/rss/search/1kmShBgLWreAvxyD_vCIhcGoIZB76XScxOxl4uNM/?limit=10&utm_campaign=pubmed-2&fc=20230925092230",
  },
  news: {
    general: "https://news.google.com/rss/search?q=medical+news+when:3d&hl=en-US&gl=US&ceid=US:en",
    cardiology: "https://news.google.com/rss/search?q=cardiology+news+when:3d&hl=en-US&gl=US&ceid=US:en",
  }
}

// Helper function to safely parse dates
function safeParseDateISO(dateStr: string): string {
  try {
    // Check for empty or undefined date strings
    if (!dateStr || dateStr.trim() === '') {
      return new Date().toISOString();
    }
    
    // Handle multiple date formats
    let date: Date;
    dateStr = dateStr.trim();
    
    // Test if it's already ISO format
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateStr)) {
      return dateStr;
    }
    
    // Try standard Date parsing
    date = new Date(dateStr);
    
    // Check if valid date
    if (isNaN(date.getTime())) {
      // Last resort: try to extract date parts manually for common formats
      const parts = dateStr.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i);
      if (parts) {
        const monthMap: {[key: string]: number} = {
          jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, 
          jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
        };
        const day = parseInt(parts[1]);
        const month = monthMap[parts[2].toLowerCase()];
        const year = parseInt(parts[3]);
        
        date = new Date(year, month, day);
      } else {
        date = new Date();
      }
    }
    
    return date.toISOString();
  } catch (error) {
    return new Date().toISOString(); // Return current date as fallback
  }
}

// Function to fetch and parse RSS feeds
async function fetchRssFeed(url: string): Promise<any[]> {
  try {
    console.log(`Fetching RSS feed: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      signal: AbortSignal.timeout(5000) // Timeout after 5 seconds
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`)
    }
    
    const xmlText = await response.text()
    console.log(`Received RSS feed content with size: ${xmlText.length} bytes`);
    
    try {
      // Parse XML using the xml module
      const parsed = parseXML(xmlText)
      const channel = parsed.rss?.channel
      
      if (!channel) {
        throw new Error("Invalid RSS format: No channel found")
      }
      
      const sourceName = channel.title?.[0]?.["#text"] || "Medical Source"
      
      // Extract items
      const items = channel.item || []
      const processedItems = items.slice(0, 5).map((item: any) => { // Limit to 5 items per feed
        // Extract fields, handling potential XML structure differences
        const title = item.title?.[0]?.["#text"] || ""
        const link = item.link?.[0]?.["#text"] || ""
        const pubDate = item.pubDate?.[0]?.["#text"] || ""
        const description = item.description?.[0]?.["#text"] || ""
        const source = item.source?.[0]?.["#text"] || sourceName
        
        return {
          title,
          link,
          source: source.trim(),
          published_date: safeParseDateISO(pubDate),
          description: cleanHtml(description),
        }
      })
      
      console.log(`Successfully parsed ${processedItems.length} items from feed`);
      return processedItems
    } catch (parseError) {
      console.error(`Error parsing XML: ${parseError.message}`);
      
      // Fallback to simple regex-based parsing for Google News feeds
      if (url.includes('news.google.com')) {
        return fallbackParseGoogleNewsFeed(xmlText, url)
      }
      
      throw parseError
    }
  } catch (error) {
    console.error(`Error fetching RSS feed: ${error.message}`);
    return []
  }
}

// Fallback parser for Google News RSS feeds using regex
function fallbackParseGoogleNewsFeed(xmlText: string, url: string): any[] {
  try {
    console.log(`Using fallback parser for Google News feed`);
    
    const items: any[] = []
    const source = url.includes('cardiology') ? 'Cardiology News' : 'Medical News'
    
    // Simple regex to extract items
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    const titleRegex = /<title>([\s\S]*?)<\/title>/
    const linkRegex = /<link>([\s\S]*?)<\/link>/
    const pubDateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/
    const descriptionRegex = /<description>([\s\S]*?)<\/description>/
    
    let match
    let count = 0
    while ((match = itemRegex.exec(xmlText)) !== null && count < 5) { // Limit to 5 items
      const itemXml = match[1]
      
      // Extract fields
      const title = (itemXml.match(titleRegex)?.[1] || "").trim()
      const link = (itemXml.match(linkRegex)?.[1] || "").trim()
      const pubDate = (itemXml.match(pubDateRegex)?.[1] || "").trim()
      const description = (itemXml.match(descriptionRegex)?.[1] || "").trim()
      
      if (title && link) {
        items.push({
          title,
          link,
          source,
          published_date: safeParseDateISO(pubDate),
          description: cleanHtml(description),
        })
        count++
      }
    }
    
    console.log(`Fallback parser extracted ${items.length} items`);
    return items
  } catch (error) {
    console.error(`Error in fallback parser: ${error.message}`);
    return []
  }
}

// Clean HTML content
function cleanHtml(html: string): string {
  if (!html) return ""
  
  // First decode HTML entities
  let decodedHtml = html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
  
  // Handle the specific pattern from Google News feeds
  if (decodedHtml.includes('href=') && decodedHtml.includes('target="_blank"')) {
    // Extract the actual article title or description from Google News format
    const contentMatch = decodedHtml.match(/target="_blank">(.*?)<\/a>/);
    if (contentMatch && contentMatch[1]) {
      // Further clean formatting tags that might be in the extracted content
      let extractedContent = contentMatch[1]
        .replace(/<font[^>]*>/g, '')
        .replace(/<\/font>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ');
      
      return extractedContent.trim();
    }
  }
  
  // For other HTML content, remove tags but preserve line breaks
  return decodedHtml
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Process and store news articles
async function processAndStoreArticles(items: any[], category: string, specialty: string): Promise<number> {
  let insertedCount = 0;
  for (const item of items) {
    try {
      // Skip articles without title or URL
      if (!item.title || !item.link) {
        continue
      }
      
      // Check if the article already exists (by URL)
      const { data: existingArticle, error: queryError } = await supabase
        .from("news_articles")
        .select("id")
        .eq("url", item.link)
        .maybeSingle()
      
      if (queryError) {
        console.error(`Error checking for existing article: ${queryError.message}`);
        continue
      }
      
      if (!existingArticle) {
        // Create a unique ID
        const id = `${category}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        
        const { error: insertError } = await supabase.from("news_articles").insert({
          id,
          title: item.title,
          summary: item.description,
          source: item.source,
          url: item.link,
          published_date: item.published_date,
          category: category.toLowerCase(),
          specialty: [specialty],
          created_at: new Date().toISOString(),
          ai_summary: null,
        })
        
        if (insertError) {
          console.error(`Error inserting article: ${insertError.message}`);
        } else {
          insertedCount++;
          console.log(`Inserted new article: "${item.title.substring(0, 30)}..."`);
        }
      } else {
        console.log(`Article already exists: "${item.title.substring(0, 30)}..."`);
      }
    } catch (articleError) {
      console.error(`Error processing article: ${articleError.message}`);
      // Skip on error and continue with other articles
    }
  }
  return insertedCount;
}

// Main function to fetch all news
async function fetchAllNews(): Promise<{success: boolean; message: string; articles_count: number}> {
  try {
    console.log("Starting to fetch all news sources");
    let totalArticles = 0;
    let newArticlesCount = 0;
    
    // Fetch PubMed articles - only general category for performance
    const pubmedGeneral = await fetchRssFeed(RSS_FEEDS.pubmed.general as string)
    const pubmedInserted = await processAndStoreArticles(pubmedGeneral, "journal", "general")
    totalArticles += pubmedGeneral.length
    newArticlesCount += pubmedInserted
    
    // Fetch News articles - limited categories
    const newsGeneral = await fetchRssFeed(RSS_FEEDS.news.general as string)
    const newsGeneralInserted = await processAndStoreArticles(newsGeneral, "news", "general")
    totalArticles += newsGeneral.length
    newArticlesCount += newsGeneralInserted
    
    const newsCardiology = await fetchRssFeed(RSS_FEEDS.news.cardiology as string)
    const newsCardiologyInserted = await processAndStoreArticles(newsCardiology, "news", "cardiology")
    totalArticles += newsCardiology.length
    newArticlesCount += newsCardiologyInserted
    
    console.log(`Processed ${totalArticles} articles, inserted ${newArticlesCount} new articles`);
    
    // Delete articles older than 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { error: deleteError, count } = await supabase
      .from("news_articles")
      .delete({ count: 'exact' })
      .lt("published_date", thirtyDaysAgo.toISOString())
    
    if (deleteError) {
      console.error(`Error deleting old articles: ${deleteError.message}`);
    } else if (count) {
      console.log(`Deleted ${count} articles older than 30 days`);
    }
    
    return { 
      success: true, 
      message: `News articles fetched and stored. Found ${totalArticles} articles, added ${newArticlesCount} new ones.`, 
      articles_count: totalArticles 
    }
  } catch (error) {
    console.error(`Error in fetchAllNews: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      message: `Error fetching news: ${error instanceof Error ? error.message : String(error)}`,
      articles_count: 0
    }
  }
}

// Main handler function
serve(async (req) => {
  console.log(`Received ${req.method} request to fetch-medical-news function`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }
  
  try {
    // Handle CRON scheduled invocations or direct invocations from the app
    console.log("Starting news fetch process");
    const result = await fetchAllNews()
    console.log(`News fetch completed: ${result.success ? 'success' : 'failed'}`);
    
    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    )
  } catch (error) {
    console.error(`Unhandled error in fetch-medical-news function: ${error instanceof Error ? error.message : String(error)}`);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error),
        success: false
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    )
  }
})
