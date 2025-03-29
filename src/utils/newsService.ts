import { supabase } from '@/integrations/supabase/client';
import { AIService } from './aiService';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  published_date: string;
  category: 'journal' | 'news' | 'research';
  specialty?: string[];
  image_url?: string;
  ai_summary?: string;
  isSummarizing?: boolean;
}

export class NewsService {
  // Fetch news articles from Supabase
  static async fetchMedicalNews(specialty: string = 'general', forceRefresh: boolean = false): Promise<NewsItem[]> {
    try {
      console.log('Fetching medical news for specialty:', specialty, 'Force refresh:', forceRefresh);
      
      let query = supabase
        .from('news_articles')
        .select('*')
        .order('published_date', { ascending: false });
      
      // Add specialty filter if not 'general' or 'all'
      if (specialty !== 'general' && specialty !== 'all') {
        // Using containedBy for arrays: article.specialty array must contain the specified specialty
        query = query.contains('specialty', [specialty]);
      }
      
      // Limit to reasonable number of articles
      query = query.limit(50);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching news from Supabase:', error);
        return this.getFallbackMockData(specialty);
      }
      
      if (!data || data.length === 0) {
        console.log('No articles found in Supabase, returning mock data');
        return this.getFallbackMockData(specialty);
      }
      
      // Map database results to NewsItem interface
      const newsItems: NewsItem[] = data.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary || '',
        source: item.source || 'Medical Source',
        url: item.url,
        published_date: item.published_date, 
        category: item.category as 'journal' | 'news' | 'research',
        specialty: item.specialty || [specialty !== 'general' ? specialty : 'Medicine'],
        image_url: item.image_url,
        ai_summary: item.ai_summary,
      }));
      
      return newsItems;
    } catch (error) {
      console.error('Error in fetchMedicalNews:', error);
      return this.getFallbackMockData(specialty);
    }
  }

  // Generate AI summary for an article
  static async generateSummary(article: NewsItem): Promise<string | null> {
    try {
      if (!AIService.isInitialized()) {
        throw new Error('AI service not initialized');
      }
      
      // If we have a Supabase connection, use the Edge Function
      try {
        const { data, error } = await supabase.functions.invoke('summarize-article', {
          body: { articleId: article.id }
        });
        
        if (error) throw error;
        return data.summary;
      } catch (supabaseError) {
        console.error('Error using Supabase function for summary:', supabaseError);
        // Fall back to client-side summarization if Edge Function fails
      }
      
      // Client-side fallback using Together AI directly
      const content = `Title: ${article.title}\n\nContent: ${article.summary}`;
      
      const response = await AIService.getChatCompletion([
        {
          role: 'system',
          content: 'You are a medical assistant that summarizes medical research and news. Provide a concise, bullet-point summary of the following medical content. Focus on key findings, implications, and actionable insights. Use simple language understandable by medical professionals.'
        },
        {
          role: 'user',
          content
        }
      ]);
      
      if (response.success && response.data) {
        return response.data.choices[0].message.content;
      } else {
        throw new Error(response.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Error generating AI summary:', error);
      return null;
    }
  }

  // Generate fallback mock data for when Supabase fails or returns no results
  private static getFallbackMockData(specialty: string = 'general'): NewsItem[] {
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(currentDate);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    // Create specialty-specific titles and content
    const specialtyTopics: Record<string, {titles: string[], content: string[]}> = {
      cardiology: {
        titles: [
          "New Study Shows Promise in Heart Failure Treatment",
          "Advances in Catheter Ablation Techniques for Atrial Fibrillation",
          "The Role of SGLT2 Inhibitors in Cardiovascular Disease Management"
        ],
        content: [
          "Researchers have identified a novel pathway that could lead to improved therapies for heart failure patients. The study, published in the Journal of Cardiovascular Medicine, demonstrates that targeting the RAAS system with a combination approach yields better outcomes than monotherapy.",
          "A recent multicenter trial has shown that the latest catheter ablation techniques result in higher success rates and fewer complications for patients with persistent atrial fibrillation. The study included over 500 patients and followed them for 3 years.",
          "New data reveals that SGLT2 inhibitors provide cardiovascular benefits beyond their glucose-lowering effects. The medication class has shown reductions in heart failure hospitalizations even in non-diabetic patients with established heart disease."
        ]
      },
      neurology: {
        titles: [
          "Breakthrough in Alzheimer's Disease Biomarker Detection",
          "Novel Treatment Approach for Refractory Epilepsy",
          "Machine Learning Algorithm Predicts Stroke Outcomes with High Accuracy"
        ],
        content: [
          "A new blood test can detect Alzheimer's disease with over 90% sensitivity and specificity, potentially enabling earlier intervention and better disease management. The test measures a panel of proteins associated with neurodegeneration.",
          "A phase III clinical trial has demonstrated significant seizure reduction in patients with drug-resistant epilepsy using a targeted neuromodulation approach. The non-invasive device showed a 65% responder rate in the treatment group.",
          "Researchers have developed an AI algorithm that can predict post-stroke outcomes with 85% accuracy using initial imaging and clinical parameters. This tool could help optimize acute stroke care and rehabilitation protocols."
        ]
      },
      oncology: {
        titles: [
          "Immunotherapy Combination Shows Promise in Advanced Lung Cancer",
          "Liquid Biopsy Advances for Early Cancer Detection",
          "Targeted Therapy Demonstrates Improved Survival in Rare Cancers"
        ],
        content: [
          "A combination of immune checkpoint inhibitors with targeted therapy has shown remarkable response rates in previously treated non-small cell lung cancer. The phase II trial reported an objective response rate of 58% and median progression-free survival of 10.2 months.",
          "A newly developed liquid biopsy technique can detect multiple cancer types at early stages with improved sensitivity. The blood test analyzes circulating tumor DNA and a panel of protein biomarkers to identify cancer signals before clinical symptoms appear.",
          "A novel targeted therapy for patients with NTRK fusion-positive tumors has demonstrated durable responses across multiple rare cancer types. The precision medicine approach resulted in a median overall survival of 24 months in heavily pretreated patients."
        ]
      },
      general: {
        titles: [
          "WHO Updates Guidelines for Antimicrobial Resistance",
          "Advances in mRNA Technology Beyond COVID-19 Vaccines",
          "Digital Health Interventions Improve Chronic Disease Management"
        ],
        content: [
          "The World Health Organization has released updated guidelines for combating antimicrobial resistance, emphasizing stewardship programs and surveillance. The recommendations include specific antibiotic prescribing protocols for common infections.",
          "Following the success of COVID-19 vaccines, mRNA technology is being applied to develop vaccines for other infectious diseases and cancer treatments. Clinical trials are underway for mRNA-based influenza, HIV, and personalized cancer vaccines.",
          "A large meta-analysis has found that digital health interventions significantly improve outcomes in diabetes, hypertension, and other chronic conditions. Mobile applications paired with remote monitoring showed the greatest benefit in medication adherence and clinical outcomes."
        ]
      }
    };
    
    // Use specific specialty content or fall back to general
    const topics = specialtyTopics[specialty] || specialtyTopics.general || specialtyTopics.cardiology;
    
    // Create mock news items with the current format needed by the UI
    const newsItems: NewsItem[] = topics.titles.map((title, index) => ({
      id: `mock-news-${index}`,
      title: title,
      summary: topics.content[index],
      source: ['Medical News Today', 'HealthDay News', 'Reuters Health'][index % 3],
      url: 'https://example.com/article',
      published_date: [currentDate, yesterday, twoDaysAgo][index % 3].toISOString(),
      category: 'news',
      specialty: [specialty !== 'general' ? specialty : 'Medicine'],
    }));
    
    // Create mock journal items
    const journalItems: NewsItem[] = [
      {
        id: `mock-journal-1`,
        title: `Recent Advances in ${specialty !== 'general' ? specialty : 'Medicine'}: A Systematic Review`,
        summary: `This comprehensive review examines the latest evidence for diagnostic and therapeutic approaches in ${specialty !== 'general' ? specialty : 'various medical'} conditions, highlighting gaps in current knowledge and directions for future research.`,
        source: 'Journal of Medical Science',
        url: 'https://example.com/journal/1',
        published_date: yesterday.toISOString(),
        category: 'journal',
        specialty: [specialty !== 'general' ? specialty : 'Medicine'],
      },
      {
        id: `mock-journal-2`,
        title: `Clinical Practice Guidelines for ${specialty !== 'general' ? specialty : 'Primary Care'}: 2023 Update`,
        summary: `Updated guidelines provide evidence-based recommendations for the diagnosis and management of common ${specialty !== 'general' ? specialty : 'medical'} conditions, incorporating the latest research findings and expert consensus.`,
        source: 'PubMed',
        url: 'https://example.com/journal/2',
        published_date: twoDaysAgo.toISOString(),
        category: 'journal',
        specialty: [specialty !== 'general' ? specialty : 'Medicine'],
      },
    ];
    
    return [...newsItems, ...journalItems];
  }
}
