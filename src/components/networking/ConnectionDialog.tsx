
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConnectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  connectionMessage: string;
  setConnectionMessage: (message: string) => void;
  onSendRequest: () => void;
  isSubmitting: boolean;
}

const ConnectionDialog = ({
  isOpen,
  onOpenChange,
  connectionMessage,
  setConnectionMessage,
  onSendRequest,
  isSubmitting
}: ConnectionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Connection Request</DialogTitle>
          <DialogDescription>
            Add a personalized message to your connection request
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="message">Message (optional)</Label>
          <Input
            id="message"
            placeholder="Hi, I'd like to connect with you..."
            className="mt-2"
            value={connectionMessage}
            onChange={(e) => setConnectionMessage(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSendRequest} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionDialog;
