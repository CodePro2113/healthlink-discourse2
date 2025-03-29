
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface PostContentProps {
  content: string;
  image?: string;
  tags?: string[];
  expanded?: boolean;
}

export const PostContent = ({ content, image, tags, expanded = false }: PostContentProps) => {
  const [imageExpanded, setImageExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Reset image error when image prop changes
  useEffect(() => {
    if (image) {
      setImageError(false);
      // Preload image to test if it loads correctly
      const img = new Image();
      img.src = image;
      img.onerror = () => {
        console.error("Error preloading image:", image);
        setImageError(true);
      };
    }
  }, [image]);
  
  // Truncate text if it's longer than 300 characters and not expanded
  const shouldTruncate = content.length > 300 && !expanded;
  const displayContent = shouldTruncate ? content.substring(0, 300) + '...' : content;

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    setImageExpanded(!imageExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap">
          {displayContent}
        </p>
        {shouldTruncate && (
          <p className="text-xs text-muted-foreground mt-2">(Click to read more)</p>
        )}
      </div>
      
      {image && (
        <div 
          className={`mt-4 rounded-md overflow-hidden transition-all duration-300 cursor-pointer image-container ${
            imageExpanded ? 'max-h-[800px]' : 'max-h-[400px]'
          }`}
          onClick={handleImageClick}
        >
          <AspectRatio 
            ratio={imageExpanded ? 16 / 9 : 16 / 10} 
            className="bg-muted/20"
          >
            {imageError ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30">
                <ImageOff className="h-12 w-12 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Image not available</span>
              </div>
            ) : (
              <img 
                src={image} 
                alt="Post attachment" 
                className={`w-full h-full ${
                  imageExpanded ? 'object-contain' : 'object-cover'
                }`}
                onError={() => {
                  console.error("Image failed to load:", image);
                  setImageError(true);
                }}
              />
            )}
          </AspectRatio>
          <div className="text-xs text-center text-muted-foreground mt-1">
            {imageExpanded ? 'Click to collapse' : 'Click to expand'}
          </div>
        </div>
      )}
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
