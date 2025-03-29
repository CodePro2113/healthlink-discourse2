
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import PostCardWrapper from '@/components/feed/PostCardWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Post } from '@/components/feed/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import { Heart } from 'lucide-react';

const POSTS_PER_PAGE = 10;

const LikedPosts = () => {
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLikedPosts();
    } else {
      setIsLoading(false);
      setLikedPosts([]);
    }
  }, [user, currentPage]);

  
  const fetchLikedPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .in(
          "id",
          (await supabase
            .from("liked_posts")
            .select("post_id")
            .eq("user_id", user?.id)
          ).data?.map((item) => item.post_id) || []
        );

      let posts = data || [];

      if (posts.length === 0) {
        const allKeys = Object.keys(localStorage);
        const likedKeys = allKeys.filter((key) => key.startsWith("post-reaction-") && key.endsWith(`${user?.id}`));
        const localPosts: Post[] = [];

        likedKeys.forEach((key) => {
          const reaction = localStorage.getItem(key);
          if (reaction === "like") {
            const postId = key.split("-")[2];
            const dummyPost = {
              id: postId,
              content: "[Local Liked Post]",
              author_name: "Anonymous",
              created_at: new Date().toISOString(),
            };
            localPosts.push(dummyPost as Post);
          }
        });

        posts = localPosts;
      }

      setLikedPosts(posts);
    } catch (err: any) {
      console.error("Failed to fetch liked posts:", err);
      toast({
        title: "Error loading liked posts",
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
      setLikedPosts(formattedPosts);
    } catch (err) {
      console.error('Error fetching liked posts:', err);
      setError('Failed to load liked posts. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to load liked posts. Please try again later.',
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
        <Heart size={40} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No liked posts yet</h3>
      <p className="text-muted-foreground max-w-sm">
        When you like posts, they'll appear here so you can easily find them later.
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
        <h1 className="text-2xl font-bold mb-6">Liked Posts</h1>
        
        {isLoading ? renderLoadingState() : (
          <>
            {error ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            ) : likedPosts.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="space-y-4">
                {likedPosts.map(post => (
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

export default LikedPosts;
