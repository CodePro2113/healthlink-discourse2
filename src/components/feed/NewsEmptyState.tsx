
import { Card } from '@/components/ui/card';

const NewsEmptyState = () => {
  return (
    <Card className="p-8 text-center">
      <h3 className="text-lg font-medium mb-2">No results found</h3>
      <p className="text-muted-foreground">
        Try changing your search criteria or check back later for updates
      </p>
    </Card>
  );
};

export default NewsEmptyState;
