
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    if (req.headers.get("X-Supabase-Schedule") !== "true") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    // Call the fetch-medical-news function
    const fetchNewsResponse = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/fetch-medical-news`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          "X-Supabase-Schedule": "true",
          "Content-Type": "application/json"
        }
      }
    )
    
    const result = await fetchNewsResponse.json()
    
    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
