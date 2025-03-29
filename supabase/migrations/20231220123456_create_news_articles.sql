
-- Create news_articles table
CREATE TABLE IF NOT EXISTS public.news_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  source TEXT,
  url TEXT UNIQUE NOT NULL,
  published_date TIMESTAMP WITH TIME ZONE,
  category TEXT NOT NULL,
  specialty TEXT[],
  image_url TEXT,
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads (everyone can read news)
CREATE POLICY "Allow anonymous read access" 
  ON public.news_articles 
  FOR SELECT 
  USING (true);

-- Only service role can insert/update/delete
CREATE POLICY "Only service role can insert" 
  ON public.news_articles 
  FOR INSERT 
  USING (auth.role() = 'service_role');

CREATE POLICY "Only service role can update" 
  ON public.news_articles 
  FOR UPDATE 
  USING (auth.role() = 'service_role');

CREATE POLICY "Only service role can delete" 
  ON public.news_articles 
  FOR DELETE 
  USING (auth.role() = 'service_role');

-- Create index on published_date for efficient queries
CREATE INDEX idx_news_articles_published_date ON public.news_articles (published_date DESC);

-- Create index on category for filtering
CREATE INDEX idx_news_articles_category ON public.news_articles (category);
