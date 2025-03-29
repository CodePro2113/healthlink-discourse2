
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import PostCardWrapper from '@/components/feed/PostCardWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Post } from '@/components/feed/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import { Bookmark } from 'lucide-react';

const POSTS_PER_PAGE = 10;

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedPosts();
    } else {
      setIsLoading(false);
      setSavedPosts([]);
    }
  }, [user, currentPage]);

  
  const fetchSavedPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .in(
          "id",
          (await supabase
            .from("saved_posts")
            .select("post_id")
            .eq("user_id", user?.id)
          ).data?.map((item) => item.post_id) || []
        );

      let posts = data || [];

      if (posts.length === 0) {
        const allKeys = Object.keys(localStorage);
        const savedKeys = allKeys.filter((key) => key.startsWith("saved-post-"));
        const localPosts: Post[] = [];

        savedKeys.forEach((key) => {
          const saved = localStorage.getItem(key);
          if (saved === "true") {
            const dummyPost = {
              id: key.split("-")[2],
              content: "[Local Saved Post]",
              author_name: "Anonymous",
              created_at: new Date().toISOString(),
            };
            localPosts.push(dummyPost as Post);
          }
        });

        posts = localPosts;
      }

      setSavedPosts(posts);
    } catch (err: any) {
      console.error("Failed to fetch saved posts:", err);
      toast({
        title: "Error loading saved posts",
        description: "Please try again later.",
        variant: "destructive",
      });
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

        });
      
      console.log('Formatted posts:', formattedPosts);
      setSavedPosts(formattedPosts);
    } catch (err) {
      console.error('Error fetching saved posts:', err);
      setError('Failed to load saved posts. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to load saved posts. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(currentPage - 1)} 
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PaginationItem key={page}>
              <PaginationLink 
                isActive={page === currentPage}
                onClick={() => handlePageChange(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(currentPage + 1)} 
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="p-4 rounded-full bg-muted mb-4">
        <Bookmark size={40} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No saved posts yet</h3>
      <p className="text-muted-foreground max-w-sm">
        When you save posts, they'll appear here so you can easily find them later.
      </p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="border rounded-md p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      ))}
    </div>
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Saved Posts</h1>
        
        {isLoading ? renderLoadingState() : (
          <>
            {error ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            ) : savedPosts.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="space-y-4">
                {savedPosts.map(post => (
                  <PostCardWrapper key={post.id} post={post} />
                ))}
                {renderPagination()}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default SavedPosts;
