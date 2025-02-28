import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useOwnerStore,
  useEateryStore,
  useModalStore,
} from "@/state/modalStore";

export function Modal() {
  const { open, closeModal } = useModalStore();
  const { ownerId, ownerName } = useOwnerStore();
  const { eateryId, eateryName } = useEateryStore();

  if (!ownerId && !eateryId) return null; // Prevent rendering if neither is set

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="border-b py-4">
            {ownerId ? "Owner Details" : "Eatery Details"}
          </DialogTitle>

          {ownerId && (
            <div className="border-b py-4">
              <DialogDescription className="font-medium text-black">
                Owner Details
              </DialogDescription>
              <DialogDescription>Owner ID: {ownerId}</DialogDescription>
              <DialogDescription>Owner Name: {ownerName}</DialogDescription>
            </div>
          )}

          {eateryId && (
            <div className="border-b py-4">
              <DialogDescription className="font-medium text-black">
                Eatery Details
              </DialogDescription>
              <DialogDescription>Eatery ID: {eateryId}</DialogDescription>
              <DialogDescription>Eatery Name: {eateryName}</DialogDescription>
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
