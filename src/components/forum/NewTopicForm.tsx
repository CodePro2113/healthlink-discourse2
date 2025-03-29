import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { AlertCircle, Tag, Loader2, X, Upload, File, FileText, Image } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Post, Author } from '@/components/feed/PostCard';
import { AIService, TagSuggestion } from '@/utils/aiService';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NewTopicFormProps {
  onCreateTopic: (post: Post) => void;
  onCancel: () => void;
}

interface NewTopicFormValues {
  title: string;
  content: string;
  tags: string;
  isAnonymous: boolean;
}

const NewTopicForm = ({ onCreateTopic, onCancel }: NewTopicFormProps) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<TagSuggestion[]>([]);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastTagsAttempt, setLastTagsAttempt] = useState<number>(0);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const BLACKLISTED_TAGS = ['Asthma', 'Cancer', 'Oncology'];
  
  const form = useForm<NewTopicFormValues>({
    defaultValues: {
      title: '',
      content: '',
      tags: '',
      isAnonymous: false
    }
  });

  const watchContent = form.watch('content');
  const watchTitle = form.watch('title');
  
  useEffect(() => {
    if ((watchContent && watchContent.length > 100) || (watchTitle && watchTitle.length > 30)) {
      const now = Date.now();
      const debouncedGenerateTags = setTimeout(async () => {
        await generateAITags();
        setLastTagsAttempt(now);
      }, 800);
      
      return () => clearTimeout(debouncedGenerateTags);
    }
  }, [watchContent, watchTitle]);
  
  useEffect(() => {
    const tagsString = selectedTags.join(', ');
    form.setValue('tags', tagsString);
  }, [selectedTags, form]);
  
  useEffect(() => {
    if (!attachment) {
      setAttachmentPreview(null);
      return;
    }
    
    if (attachment.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentPreview(reader.result as string);
      };
      reader.readAsDataURL(attachment);
    } else {
      setAttachmentPreview(null);
    }
  }, [attachment]);
  
  const generateAITags = async () => {
    if ((!watchContent || watchContent.length < 50) && (!watchTitle || watchTitle.length < 20)) {
      console.log('Not enough content to generate tags yet - need longer content');
      return;
    }
    
    setIsGeneratingTags(true);
    
    try {
      const { data: existingTags } = await supabase
        .from('tags')
        .select('name')
        .order('name');
      
      const existingTagNames = existingTags?.map(tag => tag.name) || [];
      
      console.log('Generating medical tags for post:', { 
        title: watchTitle,
        contentLength: watchContent?.length || 0,
        existingTags: existingTagNames.length
      });
      
      const response = await AIService.classifyForumPost(
        watchContent || '', 
        watchTitle || '',
        existingTagNames
      );
      
      if (response.success && response.data?.tags) {
        const filteredTags = response.data.tags.filter(
          tag => !BLACKLISTED_TAGS.includes(tag.name)
        );
        
        console.log('Medical tag generation successful:', filteredTags);
        setSuggestedTags(filteredTags);
        
        if (selectedTags.length === 0 && filteredTags.length > 0 && 
            (watchContent.length > 200 || watchTitle.length > 40)) {
          const highConfidenceTags = filteredTags
            .filter(tag => tag.confidence > 0.95)
            .map(tag => tag.name)
            .slice(0, 1);
          
          if (highConfidenceTags.length > 0) {
            setSelectedTags(highConfidenceTags);
            console.log('Auto-selected medical tags based on very high confidence:', highConfidenceTags);
          }
        }
      } else {
        console.error('Failed to generate medical tags:', response.error);
      }
    } catch (error) {
      console.error('Error generating medical tags:', error);
    } finally {
      setIsGeneratingTags(false);
    }
  };
  
  const addTag = (tag: string) => {
    if (BLACKLISTED_TAGS.includes(tag)) {
      console.log('Prevented adding blacklisted tag:', tag);
      return;
    }
    
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  
  const addSuggestedTag = (tag: string) => {
    addTag(tag);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setAttachment(file);
    }
  };
  
  const clearAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const uploadAttachment = async (): Promise<string | null> => {
    if (!attachment) return null;
    
    try {
      setIsUploading(true);
      
      const fileExt = attachment.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `forum_attachments/${fileName}`;
      
      const { error } = await supabase.storage
        .from('public')
        .upload(filePath, attachment, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
      
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (data: NewTopicFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (suggestedTags.length === 0 && data.content.length > 0) {
        await generateAITags();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      let imageUrl = null;
      if (attachment) {
        imageUrl = await uploadAttachment();
      }
      
      const postId = crypto.randomUUID();
      
      const authorId = isAnonymous ? 'anonymous-user' : 'current-user';
      
      let authorData: Author;
      
      if (isAnonymous) {
        authorData = { 
          id: 'anonymous', 
          name: 'Anonymous'
        };
      } else {
        authorData = {
          id: 'user-current',
          name: 'Dr. Current User',
          avatar: 'https://i.pravatar.cc/150?img=8',
          specialty: 'General Practitioner',
        };
      }
      
      let tagsToSave = selectedTags.filter(tag => !BLACKLISTED_TAGS.includes(tag));
      
      if (tagsToSave.length === 0 && suggestedTags.length > 0) {
        const highConfidenceTags = suggestedTags
          .filter(t => t.confidence > 0.8 && !BLACKLISTED_TAGS.includes(t.name))
          .map(t => t.name);
        
        if (highConfidenceTags.length > 0) {
          tagsToSave = highConfidenceTags.slice(0, Math.min(2, highConfidenceTags.length));
        } else {
          tagsToSave = suggestedTags
            .filter(t => !BLACKLISTED_TAGS.includes(t.name))
            .slice(0, 1)
            .map(t => t.name);
        }
        
        console.log('No tags selected, using suggestions:', tagsToSave.join(', '));
      }
      
      if (tagsToSave.length === 0) {
        const lowerContent = data.content.toLowerCase();
        const lowerTitle = data.title.toLowerCase();
        
        if (lowerTitle.includes('question') || lowerContent.includes('?')) {
          tagsToSave = ['Discussion', 'Clinical'];
        } else if (lowerContent.includes('research') || lowerContent.includes('study')) {
          tagsToSave = ['Research', 'Clinical'];
        } else if (lowerContent.includes('patient') || lowerContent.includes('treatment')) {
          tagsToSave = ['Patient Care', 'Clinical'];
        } else {
          tagsToSave = ['Clinical', 'Discussion'];
        }
        console.log('Using fallback medical tags:', tagsToSave.join(', '));
      }
      
      const newPost: Post = {
        id: postId,
        author: authorData,
        content: data.content,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        isAnonymous: isAnonymous,
        tags: tagsToSave,
        title: data.title,
        image: imageUrl || undefined
      };
      
      console.log('Created new post with tags:', { post: newPost.id, tags: tagsToSave });
      
      try {
        onCreateTopic(newPost);
        toast({
          title: "Topic created",
          description: "Your new topic has been published to the forum.",
          variant: "success"
        });
      } catch (error) {
        console.error('Error in onCreateTopic:', error);
      }
      
      form.reset();
      setSelectedTags([]);
      setSuggestedTags([]);
      clearAttachment();
      
    } catch (error) {
      console.error('Error creating topic:', error);
      toast({
        title: "Error creating topic",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4 py-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter a clear, concise title for your topic" 
                    {...field} 
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide details, context, or questions related to your topic..." 
                    className="min-h-32"
                    {...field}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              Attachment
              {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
            </FormLabel>
            
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
                disabled={isUploading}
              >
                <Upload size={16} />
                {attachment ? 'Change File' : 'Add File'}
              </Button>
              
              {attachment && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={clearAttachment}
                  className="text-destructive hover:text-destructive"
                  disabled={isUploading}
                >
                  <X size={16} className="mr-1" />
                  Remove
                </Button>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>
            
            {attachment && (
              <div className="mt-2">
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  {attachment.type.startsWith('image/') ? (
                    <Image size={16} />
                  ) : attachment.type.includes('pdf') ? (
                    <FileText size={16} />
                  ) : (
                    <File size={16} />
                  )}
                  <span className="text-sm truncate max-w-[250px]">{attachment.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(attachment.size / 1024)} KB)
                  </span>
                </div>
                
                {attachmentPreview && (
                  <div className="mt-2 max-w-xs">
                    <img 
                      src={attachmentPreview} 
                      alt="Preview" 
                      className="rounded-md border max-h-32 object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Tags
                  {isGeneratingTags && (
                    <span className="inline-flex items-center text-xs text-muted-foreground">
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Generating suggestions...
                    </span>
                  )}
                </FormLabel>
                
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedTags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="flex items-center gap-1 py-1"
                      >
                        {tag}
                        <X 
                          size={14} 
                          className="cursor-pointer hover:text-destructive" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  
                  <Input 
                    placeholder={selectedTags.length > 0 
                      ? "Tags are added above (max 5)" 
                      : "Enter tags separated by commas or use suggestions below"}
                    {...field}
                    disabled={selectedTags.length >= 5}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && field.value.trim()) {
                        e.preventDefault();
                        const newTag = field.value.trim();
                        if (!BLACKLISTED_TAGS.includes(newTag)) {
                          addTag(newTag);
                          field.onChange('');
                        } else {
                          console.log('Prevented adding blacklisted tag:', newTag);
                          toast({
                            title: "Tag not allowed",
                            description: `The tag "${newTag}" is not allowed in the system.`,
                            variant: "destructive"
                          });
                          field.onChange('');
                        }
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedTags.length}/5 tags added
                  </p>
                </div>
                
                {suggestedTags.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center">
                      <Tag size={12} className="mr-1" />
                      AI suggested tags (click to add):
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {suggestedTags
                        .filter(tag => !BLACKLISTED_TAGS.includes(tag.name))
                        .map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className={`cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                              selectedTags.includes(tag.name) ? 'bg-primary/10' : ''
                            }`}
                            onClick={() => addSuggestedTag(tag.name)}
                          >
                            {tag.name}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />
          
          <div className="flex items-center gap-2">
            <Button 
              type="button"
              variant={isAnonymous ? "secondary" : "outline"} 
              size="sm" 
              onClick={() => setIsAnonymous(!isAnonymous)}
              className="flex items-center gap-1"
            >
              {isAnonymous && <AlertCircle size={14} />}
              Post Anonymously
            </Button>
            <span className="text-xs text-muted-foreground">
              {isAnonymous ? "Your identity will be hidden" : "Posting as yourself"}
            </span>
          </div>
        </div>
        
        <DialogFooter className="pt-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Topic'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default NewTopicForm;
