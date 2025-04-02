import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useUserStore,
  useEateryStore,
  useModalStore,
} from "@/state/modalStore";

const tempData = [
  {
    location: "Moses Street, Zone - 12, Basud, Tabaco City, Albay, Philippines",
    contact: "+639123456789",
    email: "test@gmail.com",
  },
];

export function Modal() {
  const { open, closeModal, rowData } = useModalStore();
  const { userId, userName } = useUserStore();
  const { eateryId, eateryName } = useEateryStore();

  // Prevent rendering if there is no user or eatery data
  if (!userId && !eateryId) return null;

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="border-b py-4">
            {userId ? "Owner Details" : "Business Application"}
          </DialogTitle>

          {/* Owner Details */}
          {userId && (
            <div className="border-b py-4">
              <DialogDescription className="font-medium text-black">
                Owner Details
              </DialogDescription>
              <DialogDescription>Owner ID: {userId}</DialogDescription>
              <DialogDescription>Owner Name: {userName}</DialogDescription>
            </div>
          )}

          {eateryId && (
            <div className="flex flex-col gap-6">
              {/* Eatery Name and Status */}
              <div className="flex justify-center gap-12 border-b p-5">
                <DialogDescription>{eateryName}</DialogDescription>
                {rowData?.status && (
                  <DialogDescription>
                    Status: {rowData.status}
                  </DialogDescription>
                )}
              </div>
              <div>
                <DialogDescription className="font-medium text-black">
                  Contact Information
                </DialogDescription>
                <DialogDescription>
                  Location: {tempData[0].location}
                </DialogDescription>
                <DialogDescription>
                  Contact: {tempData[0].contact}
                </DialogDescription>
                <DialogDescription>
                  Email: {tempData[0].email}
                </DialogDescription>
              </div>
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
