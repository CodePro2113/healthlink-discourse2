
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, title, existingTags = [] } = await req.json()
    
    console.log('Generate tags request received:', { 
      title: title || '(no title)', 
      contentLength: content?.length || 0,
      existingTagsCount: existingTags.length 
    });
    
    // Create a Supabase client with the Deno runtime
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get existing tags from database for reuse
    const { data: dbTags, error: dbTagsError } = await supabaseClient
      .from('tags')
      .select('id, name')
      .order('name')
    
    if (dbTagsError) {
      console.error('Error fetching tags:', dbTagsError)
      throw new Error('Failed to fetch existing tags')
    }

    console.log(`Found ${dbTags?.length || 0} existing tags in database`);

    // Extract medical tags from both title and content
    const tagSuggestions = generateMedicalTagsFromContent(
      content, 
      title, 
      dbTags?.map(tag => tag.name) || [],
      existingTags
    )

    // Log the results for debugging
    console.log('Generated medical tag suggestions:', tagSuggestions)

    return new Response(
      JSON.stringify({ 
        success: true, 
        tags: tagSuggestions 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-tags function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Medical specialties and common keywords for classification
const MEDICAL_KEYWORDS = [
  // Medical Specialties
  { weight: 10, term: 'Cardiology', related: ['heart', 'cardiac', 'cardiovascular', 'angina', 'arrhythmia', 'afib', 'myocardial', 'infarction', 'stent', 'atherosclerosis'] },
  { weight: 10, term: 'Neurology', related: ['brain', 'nerve', 'neurological', 'seizure', 'stroke', 'headache', 'migraine', 'epilepsy', 'alzheimer', 'parkinson'] },
  { weight: 10, term: 'Pediatrics', related: ['child', 'infant', 'adolescent', 'newborn', 'baby', 'pediatric', 'developmental', 'childhood', 'congenital'] },
  { weight: 10, term: 'Surgery', related: ['operation', 'surgical', 'incision', 'postoperative', 'preoperative', 'laparoscopic', 'minimally invasive', 'resection', 'transplant'] },
  { weight: 10, term: 'Psychiatry', related: ['mental', 'anxiety', 'depression', 'psychiatric', 'mood', 'schizophrenia', 'bipolar', 'therapy', 'psychological', 'stress'] },
  { weight: 10, term: 'Dermatology', related: ['skin', 'rash', 'dermal', 'acne', 'eczema', 'melanoma', 'dermatitis', 'psoriasis', 'cutaneous', 'lesion'] },
  { weight: 10, term: 'Radiology', related: ['imaging', 'xray', 'mri', 'ct scan', 'ultrasound', 'radiograph', 'contrast', 'nuclear', 'fluoroscopy', 'sonography'] },
  { weight: 10, term: 'Emergency Medicine', related: ['emergency', 'urgent', 'acute', 'trauma', 'critical', 'resuscitation', 'triage', 'stabilization', 'ambulance', 'life-threatening'] },
  { weight: 10, term: 'Infectious Disease', related: ['infection', 'viral', 'bacterial', 'antibiotic', 'pathogen', 'contagious', 'sepsis', 'pandemic', 'antimicrobial', 'immunization'] },
  { weight: 10, term: 'Obstetrics', related: ['pregnancy', 'prenatal', 'birth', 'delivery', 'cesarean', 'obstetric', 'fetal', 'maternal', 'gestation', 'labor'] },
  { weight: 10, term: 'Gynecology', related: ['uterus', 'ovarian', 'menstrual', 'gynecologic', 'cervical', 'pelvic', 'menopause', 'fertility', 'contraception'] },
  { weight: 10, term: 'Ophthalmology', related: ['eye', 'vision', 'retinal', 'cataract', 'glaucoma', 'ocular', 'optic', 'corneal', 'blindness', 'ophthalmologic'] },
  { weight: 10, term: 'Orthopedics', related: ['bone', 'joint', 'fracture', 'orthopedic', 'spinal', 'arthroplasty', 'arthritis', 'musculoskeletal', 'osteoporosis'] },
  { weight: 10, term: 'Urology', related: ['kidney', 'bladder', 'urinary', 'prostate', 'urologic', 'incontinence', 'renal', 'ureter', 'urethral'] },
  { weight: 10, term: 'Gastroenterology', related: ['stomach', 'intestinal', 'liver', 'gastric', 'bowel', 'digestive', 'hepatic', 'endoscopy', 'colitis', 'cirrhosis'] },
  { weight: 10, term: 'Endocrinology', related: ['hormone', 'thyroid', 'diabetes', 'endocrine', 'pituitary', 'insulin', 'adrenal', 'metabolic', 'glycemic'] },
  // Additional clinical terms with high weight
  { weight: 10, term: 'Discussion', related: ['question', 'opinion', 'experience', 'advice', 'thoughts', 'recommendation', 'insight', 'consultation', 'feedback', 'suggestion'] },
  { weight: 10, term: 'Experience', related: ['practice', 'clinical experience', 'background', 'expertise', 'familiarity', 'exposure', 'skill', 'knowledge', 'training'] },
  
  // Medical Conditions
  { weight: 8, term: 'Diabetes', related: ['glucose', 'insulin', 'hyperglycemia', 'diabetic', 'type 2', 'type 1', 'blood sugar', 'a1c', 'glycemic'] },
  { weight: 8, term: 'Hypertension', related: ['high blood pressure', 'blood pressure', 'antihypertensive', 'systolic', 'diastolic', 'vascular', 'cardiovascular risk'] },
  { weight: 8, term: 'COVID-19', related: ['coronavirus', 'pandemic', 'sars-cov-2', 'vaccination', 'covid', 'PCR test', 'quarantine', 'social distancing'] },
  
  // Medical Practices/Topics
  { weight: 8, term: 'Research', related: ['study', 'trial', 'data', 'evidence', 'findings', 'peer-reviewed', 'clinical trial', 'double-blind', 'methodology'] },
  { weight: 8, term: 'Clinical', related: ['patient', 'symptom', 'diagnosis', 'treatment', 'prognosis', 'assessment', 'therapeutic', 'management', 'intervention'] },
  { weight: 8, term: 'Ethics', related: ['ethical', 'consent', 'moral', 'right', 'autonomy', 'bioethics', 'confidentiality', 'decision-making', 'disclosure'] },
  { weight: 8, term: 'Mental Health', related: ['psychological', 'therapy', 'counseling', 'behavioral', 'mental illness', 'coping', 'emotional', 'psychiatric', 'psychotherapy'] },
  { weight: 8, term: 'Medication', related: ['drug', 'pharmaceutical', 'dose', 'prescription', 'side effect', 'regimen', 'contraindication', 'indication', 'pharmacology'] },
  { weight: 8, term: 'Patient Care', related: ['care', 'management', 'nursing', 'monitoring', 'standard of care', 'palliative', 'caregiver', 'healthcare delivery'] },
  { weight: 8, term: 'Education', related: ['teaching', 'learning', 'training', 'student', 'medical school', 'curriculum', 'educational', 'academic', 'learning objective'] },
  { weight: 8, term: 'Preventive Medicine', related: ['prevention', 'screening', 'prophylaxis', 'risk factor', 'wellness', 'lifestyle', 'preventative', 'public health'] }
]

// Blacklisted tags that should never be suggested
const BLACKLISTED_TAGS = ['Asthma', 'Cancer', 'Oncology'];

// Tag colors for categories
const TAG_COLORS = [
  '#2563eb', '#db2777', '#ea580c', '#16a34a', '#7c3aed', '#0891b2', 
  '#4d7c0f', '#b45309', '#be185d', '#1d4ed8', '#7e22ce', '#0f766e',
  '#a16207', '#c2410c', '#0369a1', '#9f1239', '#115e59', '#4338ca'
]

interface TagSuggestion {
  name: string;
  confidence: number;
}

function generateMedicalTagsFromContent(
  content: string,
  title: string = '',
  existingDbTags: string[] = [],
  userSelectedTags: string[] = []
): TagSuggestion[] {
  // Check for valid input
  if (!content && !title) {
    console.log('No content or title provided for tag generation');
    return [{ name: 'Discussion', confidence: 0.7 }];
  }
  
  // Normalize content and title to lowercase for better matching
  const combinedText = `${title} ${content}`.toLowerCase();
  
  console.log('Generating medical tags for combined text:', combinedText.substring(0, 100) + (combinedText.length > 100 ? '...' : ''));
  
  const suggestions: Map<string, number> = new Map();

  // CRITICAL FIX: Short content should get default generic tags only
  // If content is very short, don't try to be specific with medical tags at all
  if (combinedText.length < 100) {
    console.log('Content is very short (less than 100 chars), using only general tags');
    
    // For very short content like "test", just add Discussion tag
    suggestions.set('Discussion', 0.8);
    
    // Only add Clinical if there's a clear hint of medical content
    if (combinedText.includes('patient') || combinedText.includes('doctor') || 
        combinedText.includes('medical') || combinedText.includes('treatment') || 
        combinedText.includes('hospital') || combinedText.includes('clinic')) {
      suggestions.set('Clinical', 0.7);
    }
    
    // Return early with just these general tags for very short content
    return Array.from(suggestions.entries())
      .map(([name, confidence]) => ({
        name,
        confidence
      }));
  }
  
  // First, prioritize any user-selected tags
  for (const tag of userSelectedTags) {
    // Skip any blacklisted tags even if user selected them
    if (!BLACKLISTED_TAGS.includes(tag)) {
      suggestions.set(tag, 1.0); // Max confidence for user selections
      console.log('Added user-selected tag:', tag);
    } else {
      console.log('Skipping blacklisted user-selected tag:', tag);
    }
  }
  
  // Scan for keywords and their related terms
  let matchFound = false;
  
  for (const keyword of MEDICAL_KEYWORDS) {
    // Skip blacklisted terms
    if (BLACKLISTED_TAGS.includes(keyword.term)) {
      console.log(`Skipping blacklisted keyword: ${keyword.term}`);
      continue;
    }
    
    // Check for exact match of the main term
    const termRegex = new RegExp(`\\b${keyword.term.toLowerCase()}\\b`, 'gi');
    const matches = combinedText.match(termRegex);
    
    if (matches) {
      // Main term found, add with weight-based confidence
      const occurrences = matches.length;
      
      // More stringent confidence calculation
      // Much higher threshold to avoid false positives
      const confidence = Math.min(0.85, 0.7 + (occurrences * 0.03 * (keyword.weight / 10)));
      
      // Only add if confidence is high enough (increased threshold)
      if (confidence > 0.8) {
        suggestions.set(keyword.term, confidence);
        console.log(`Found exact match for "${keyword.term}" with confidence ${confidence}`);
        matchFound = true;
      } else {
        console.log(`Ignoring low confidence match for "${keyword.term}" with confidence ${confidence}`);
      }
    } else {
      // Check related terms
      let relatedMatches = 0;
      const relatedMatchTerms = [];
      
      for (const related of keyword.related) {
        const relatedRegex = new RegExp(`\\b${related.toLowerCase()}\\b`, 'gi');
        const relatedMatchArray = combinedText.match(relatedRegex);
        if (relatedMatchArray) {
          relatedMatches += relatedMatchArray.length;
          relatedMatchTerms.push(related);
          console.log(`Found related term "${related}" for category "${keyword.term}"`);
        }
      }
      
      // Much more stringent criteria for all tags
      // Require at least 3 related matches for all tags (up from 2)
      const minRelatedMatches = 3;
      
      if (relatedMatches >= minRelatedMatches) {
        // Adjusted confidence calculation with higher threshold
        const confidence = Math.min(0.8, 0.65 + (relatedMatches * 0.02 * (keyword.weight / 10)));
        
        // Higher threshold for ALL tags (up from 0.75)
        const confidenceThreshold = 0.8;
        
        if (confidence > confidenceThreshold) {
          suggestions.set(keyword.term, confidence);
          console.log(`Added "${keyword.term}" from related terms (${relatedMatchTerms.join(', ')}) with confidence ${confidence}`);
          matchFound = true;
        } else {
          console.log(`Ignoring low confidence for "${keyword.term}" with confidence ${confidence} < ${confidenceThreshold}`);
        }
      }
    }
  }
  
  // If no tags were found, add at least one default medical tag
  if (suggestions.size === 0) {
    if (combinedText.includes('question') || combinedText.includes('?')) {
      console.log('No tags found but question detected. Adding "Discussion" tag.');
      suggestions.set('Discussion', 0.8);
    } else if (combinedText.includes('research') || combinedText.includes('study')) {
      console.log('No tags found but research terms detected. Adding "Research" tag.');
      suggestions.set('Research', 0.8);
    } else if (combinedText.includes('patient') || combinedText.includes('treatment')) {
      console.log('No tags found but patient care terms detected. Adding "Clinical" tag.');
      suggestions.set('Clinical', 0.7);
    } else {
      console.log('No tags found. Adding default "Discussion" tag.');
      suggestions.set('Discussion', 0.6);
    }
  }
  
  // Sort by confidence and format results
  return Array.from(suggestions.entries())
    .sort((a, b) => b[1] - a[1]) // Sort by confidence descending
    .slice(0, 5) // Limit to top 5
    .filter(([name]) => !BLACKLISTED_TAGS.includes(name)) // One final filter for blacklisted tags
    .map(([name, confidence]) => ({
      name,
      confidence
    }));
}
