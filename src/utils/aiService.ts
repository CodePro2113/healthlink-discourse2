// AI Service for forum post classification and other AI functionalities
// This implementation connects to Together AI with option to switch to OpenAI later

import { supabase } from '@/integrations/supabase/client';

export interface AIServiceResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface TagSuggestion {
  name: string;
  confidence: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Main class for AI service operations
export class AIService {
  private static apiKey: string | null = null;
  private static provider: 'together' | 'openai' = 'together';
  private static baseUrl = 'https://api.together.xyz/v1';
  private static model = 'mistralai/Mixtral-8x7B-Instruct-v0.1';
  
  // Medical specialties and common tags for classification
  private static readonly medicalTags = [
    // Medical Specialties
    'Cardiology', 'Neurology', 'Pediatrics', 'Oncology', 'Surgery',
    'Psychiatry', 'Dermatology', 'Radiology', 'Emergency Medicine',
    'Infectious Disease', 'Obstetrics', 'Gynecology', 'Ophthalmology',
    'Orthopedics', 'Urology', 'Gastroenterology', 'Endocrinology',
    // Medical Conditions
    'Diabetes', 'Hypertension', 'COVID-19', 'Asthma',
    // Medical Practices/Topics
    'Research', 'Clinical', 'Ethics', 'Mental Health', 'Medication',
    'Patient Care', 'Education', 'Preventive Medicine', 'Discussion'
  ];
  
  // Initialize the AI service with provider and API key
  static initialize(provider: 'together' | 'openai', apiKey: string): void {
    this.provider = provider;
    this.apiKey = apiKey;
    console.log(`AI Service initialized with ${provider} provider`);
  }
  
  // Set model to use
  static setModel(model: string): void {
    this.model = model;
    console.log(`AI Service model set to ${model}`);
  }
  
  // Get current model
  static getModel(): string {
    return this.model;
  }
  
  // Check if AI service is initialized
  static isInitialized(): boolean {
    return !!this.apiKey;
  }
  
  // Classify forum post content and suggest relevant tags
  static async classifyForumPost(content: string, title?: string, existingTags: string[] = []): Promise<AIServiceResponse> {
    try {
      console.log('Classifying forum post with AI:', { 
        title: title || '(no title)',
        contentLength: content?.length || 0 
      });
      
      // For very short content, just return default tags without calling the API
      if (content.length < 20 && (!title || title.length < 10)) {
        console.log('Content too short for tag analysis, using default tags');
        return {
          success: true,
          data: {
            tags: [
              { name: 'Discussion', confidence: 0.8 }
            ]
          }
        };
      }
      
      // First try the edge function approach (works regardless of AI initialization)
      try {
        const { data, error } = await supabase.functions.invoke('generate-tags', {
          body: { content, title, existingTags }
        });
        
        if (error) {
          console.error('Error calling generate-tags function:', error);
          throw new Error(error.message);
        }
        
        console.log('Response from generate-tags:', data);
        
        if (data && data.success && data.tags) {
          return {
            success: true,
            data: {
              tags: data.tags
            }
          };
        }
      } catch (edgeFunctionError) {
        console.error('Edge function failed:', edgeFunctionError);
        console.warn('Edge function failed, falling back to client-side AI:', edgeFunctionError);
      }
      
      // If edge function fails or isn't available, try the regular AI approach
      if (this.apiKey) {
        if (this.provider === 'together') {
          return await this.togetherAITagging(content, title);
        } else {
          // Fallback to simulation if provider not supported yet
          return {
            success: true,
            data: {
              tags: this.simulateAITagging(content, title)
            }
          };
        }
      } else {
        // No API key and edge function failed, use pure simulation
        return {
          success: true,
          data: {
            tags: this.simulateAITagging(content, title)
          }
        };
      }
    } catch (error) {
      console.error('Error classifying forum post:', error);
      
      // Always return some tags even on error to avoid breaking the UI
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        data: {
          tags: this.simulateAITagging(content, title)
        }
      };
    }
  }
  
  // Method to get chat completions from Together AI
  static async getChatCompletion(
    messages: ChatMessage[], 
    model: string = ''
  ): Promise<AIServiceResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('AI Service not initialized with API key');
      }
      
      const modelToUse = model || this.model;
      console.log(`Using model: ${modelToUse}`);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: modelToUse,
          messages,
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Together AI API error: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error getting chat completion:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // Use Together AI for forum post tagging
  private static async togetherAITagging(content: string, title?: string): Promise<AIServiceResponse> {
    const combinedText = title ? `${title} ${content}` : content;
    
    const prompt: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a medical tagging assistant. Your task is to analyze medical text and assign the most relevant tags from this list: ${this.medicalTags.join(', ')}. Provide exactly 3-5 tags that best match the content, along with a confidence score from 0.0 to 1.0 for each tag. Format your response as a JSON array with "name" and "confidence" fields. Only return the JSON array, nothing else.`
      },
      {
        role: 'user',
        content: combinedText
      }
    ];
    
    const response = await this.getChatCompletion(prompt);
    
    if (!response.success) {
      return response;
    }
    
    try {
      // Parse the response to extract tags
      const assistantMessage = response.data.choices[0].message.content;
      
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = assistantMessage.match(/```json\s*([\s\S]*?)\s*```/) || 
                         assistantMessage.match(/\[([\s\S]*?)\]/);
      
      let tags: TagSuggestion[] = [];
      
      if (jsonMatch) {
        // Use the extracted JSON
        const jsonStr = jsonMatch[0];
        tags = JSON.parse(jsonStr);
      } else {
        // Try to parse the entire response as JSON
        tags = JSON.parse(assistantMessage);
      }
      
      // Validate the tags format and ensure they're medical tags
      tags = tags.filter(tag => 
        typeof tag === 'object' && 
        typeof tag.name === 'string' && 
        typeof tag.confidence === 'number' &&
        this.medicalTags.includes(tag.name)
      );
      
      // Fallback to simulation if we couldn't get proper tags
      if (tags.length === 0) {
        console.warn('Could not parse AI tags, falling back to simulation');
        tags = this.simulateAITagging(content, title);
      }
      
      return {
        success: true,
        data: {
          tags: tags.slice(0, 5) // Limit to 5 tags
        }
      };
    } catch (error) {
      console.error('Error parsing Together AI response:', error);
      // Fallback to simulation
      return {
        success: true,
        data: {
          tags: this.simulateAITagging(content, title)
        }
      };
    }
  }
  
  // This is a placeholder function to simulate AI tagging
  // Used as fallback if real API fails
  private static simulateAITagging(content: string, title?: string): TagSuggestion[] {
    const combinedText = `${title || ''} ${content || ''}`.toLowerCase();
    const suggestedTags: TagSuggestion[] = [];
    
    // Simple keyword matching algorithm - but only for medical tags
    const matchedTagsMap = new Map<string, number>();
    
    // Check for specialty keywords in content
    for (const tag of this.medicalTags) {
      const tagLower = tag.toLowerCase();
      const keywordsToCheck = [tagLower];
      
      // Add some related terms for common specialties
      switch(tag) {
        case 'Cardiology':
          keywordsToCheck.push('heart', 'cardiac', 'cardiovascular');
          break;
        case 'Neurology':
          keywordsToCheck.push('brain', 'neural', 'nervous system');
          break;
        case 'Pediatrics':
          keywordsToCheck.push('children', 'child', 'infant', 'kid');
          break;
        case 'Gastroenterology':
          keywordsToCheck.push('stomach', 'intestine', 'liver', 'digestive');
          break;
        case 'Oncology':
          keywordsToCheck.push('cancer', 'tumor', 'malignant');
          break;
        // Add more terms for other specialties as needed
      }
      
      // Check if any related keywords are present in the text
      let confidence = 0;
      for (const keyword of keywordsToCheck) {
        if (combinedText.includes(keyword)) {
          // Increase confidence based on exact match vs partial match
          if (combinedText.includes(` ${keyword} `)) {
            confidence += 0.3; // Exact word match
          } else {
            confidence += 0.15; // Partial match
          }
          
          // Higher weight for title matches
          if (title && title.toLowerCase().includes(keyword)) {
            confidence += 0.25;
          }
        }
      }
      
      // If we found matches, add the tag
      if (confidence > 0) {
        matchedTagsMap.set(tag, Math.min(0.95, confidence));
      }
    }
    
    // Convert map to array and sort by confidence
    for (const [tag, confidence] of matchedTagsMap.entries()) {
      suggestedTags.push({
        name: tag,
        confidence
      });
    }
    
    // If no tags found, use default medical tags based on content
    if (suggestedTags.length === 0) {
      if (combinedText.includes('question') || combinedText.includes('?')) {
        suggestedTags.push({
          name: 'Discussion',
          confidence: 0.8
        });
        suggestedTags.push({
          name: 'Clinical',
          confidence: 0.7
        });
      } else if (combinedText.includes('research') || combinedText.includes('study')) {
        suggestedTags.push({
          name: 'Research',
          confidence: 0.8
        });
        suggestedTags.push({
          name: 'Clinical',
          confidence: 0.7
        });
      } else if (combinedText.includes('patient') || combinedText.includes('treatment')) {
        suggestedTags.push({
          name: 'Patient Care',
          confidence: 0.8
        });
        suggestedTags.push({
          name: 'Clinical',
          confidence: 0.7
        });
      } else {
        suggestedTags.push({
          name: 'Clinical',
          confidence: 0.7
        });
        suggestedTags.push({
          name: 'Discussion',
          confidence: 0.6
        });
      }
    }
    
    // Sort by confidence and take top 5
    return suggestedTags
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }
  
  // Store tags in the database
  static async saveTagsForPost(postId: string, tags: string[]): Promise<AIServiceResponse> {
    try {
      console.log('Saving tags for post:', { postId, tags });
      
      // Filter out empty tags
      const validTags = tags.filter(tag => tag && tag.trim().length > 0);
      
      if (validTags.length === 0) {
        console.log('No valid tags to save');
        return { success: true };
      }
      
      // Check if post ID is a UUID format - if not, don't try to save to the database
      // This is to handle mock posts in the demo without throwing errors
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(postId)) {
        console.log(`Skipping DB check for non-UUID post ID: ${postId}`);
        return { success: true };
      }
      
      // Step 1: Create any tags that don't exist yet
      for (const tagName of validTags) {
        // Check if tag exists
        const { data: existingTag, error: checkError } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .maybeSingle();
        
        if (checkError) {
          console.error('Error checking if tag exists:', checkError);
          continue; // Continue with next tag
        }
        
        if (!existingTag) {
          // Create new tag with random color
          const colorIndex = Math.floor(Math.random() * 18);
          const { data: newTag, error: insertError } = await supabase
            .from('tags')
            .insert({
              name: tagName,
              color: ['#2563eb', '#db2777', '#ea580c', '#16a34a', '#7c3aed', '#0891b2', 
                      '#4d7c0f', '#b45309', '#be185d', '#1d4ed8', '#7e22ce', '#0f766e',
                      '#a16207', '#c2410c', '#0369a1', '#9f1239', '#115e59', '#4338ca'][colorIndex]
            })
            .select('id')
            .single();
          
          if (insertError) {
            console.error('Error creating new tag:', insertError);
          } else {
            console.log('Created new tag:', { name: tagName, id: newTag?.id });
          }
        } else {
          console.log('Tag already exists:', { name: tagName, id: existingTag.id });
        }
      }
      
      // Step 2: Get all tag IDs
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .select('id, name')
        .in('name', validTags);
      
      if (tagError) {
        console.error('Error fetching tag IDs:', tagError);
        throw new Error(`Error fetching tag IDs: ${tagError.message}`);
      }
      
      if (!tagData || tagData.length === 0) {
        console.warn('No tag data found for tags:', validTags);
        return { 
          success: false, 
          error: 'No matching tags found in the database'
        };
      }
      
      console.log('Found tag data for post tags:', tagData);
      
      // Step 3: Create post_tags relationships
      const postTagEntries = tagData.map(tag => ({
        post_id: postId,
        tag_id: tag.id
      }));
      
      console.log('Creating post_tags entries:', postTagEntries);
      
      const { data: insertData, error: insertError } = await supabase
        .from('post_tags')
        .insert(postTagEntries)
        .select();
      
      if (insertError) {
        console.error('Error linking tags to post:', insertError);
        throw new Error(`Error linking tags to post: ${insertError.message}`);
      }
      
      console.log('Successfully linked tags to post:', insertData);
      
      // Update tags array in the posts table (important for display)
      const { error: updateError } = await supabase
        .from('posts')
        .update({ tags: validTags })
        .eq('id', postId);
        
      if (updateError) {
        console.error('Error updating post tags array:', updateError);
        return {
          success: false,
          error: `Tags were linked but failed to update post record: ${updateError.message}`
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving tags for post:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // Get popular tags
  static async getPopularTags(daysAgo: number = 30): Promise<AIServiceResponse> {
    try {
      const { data, error } = await supabase
        .rpc('get_popular_tags', { days_ago: daysAgo });
      
      if (error) {
        throw new Error(`Error fetching popular tags: ${error.message}`);
      }
      
      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Error getting popular tags:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // Search posts by tag or term
  static async searchPostsByTagOrTerm(searchTerm: string): Promise<AIServiceResponse> {
    try {
      const { data, error } = await supabase
        .rpc('search_posts_by_tag_or_term', { search_term: searchTerm });
      
      if (error) {
        throw new Error(`Error searching posts: ${error.message}`);
      }
      
      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Error searching posts:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
