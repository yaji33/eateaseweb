import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "./modalStore";

export function Modal({ onClose }: { onClose: () => void }) {
  const { open, ownerId, ownerName } = useModalStore();

  if (!ownerId) return null; // Prevent rendering if no ownerId is set

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="border-b py-4">Business Details</DialogTitle>
          <div className="border-b py-4">
            <DialogDescription className="font-medium text-black">Owner Details</DialogDescription>
            <DialogDescription>Owner ID: {ownerId}</DialogDescription>
            <DialogDescription>Owner Name: {ownerName}</DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
