import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEateryStore, useModalStore } from "@/state/modalStore";
import { Button } from "@/components/ui/button";

const tempData = [
  {
    location:
      "Moses Street, Zone - 12, Basud, Tabaco City, Albay, Philippines 4511",
    contact: "+639123456789",
    email: "test@gmail.com",
    business_hours: "8:00 AM - 10:00 PM",
    owner_email: "karel@gmail.com",
    timestamp: "April 20, 2025 — 10:35 PM",
  },
];

export function Modal() {
  const { open, closeModal, rowData } = useModalStore();
  const { eateryId, eateryName, eateryOwner } = useEateryStore();

  if (!eateryId) return null;

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="border-b py-4">
            Business Application Details
          </DialogTitle>

          <div className="flex flex-col">
            <div className="flex justify-center gap-12 border-b p-5">
              <DialogDescription>{eateryName}</DialogDescription>
              {rowData?.status && (
                <DialogDescription>Status: {rowData.status}</DialogDescription>
              )}
            </div>

            <div className="border-b p-5">
              <DialogDescription className="font-medium text-black">
                Contact Information
              </DialogDescription>
              <DialogDescription>
                Location: {tempData[0].location}
              </DialogDescription>
              <DialogDescription>
                Contact: {tempData[0].contact}
              </DialogDescription>
              <DialogDescription>Email: {tempData[0].email}</DialogDescription>
              <DialogDescription>
                Business Hours: {tempData[0].business_hours}
              </DialogDescription>
            </div>
            <div className="border-b p-5">
              <DialogDescription className="font-medium text-black">
                Owner Information
              </DialogDescription>
              <DialogDescription>Name: {eateryOwner}</DialogDescription>
              <DialogDescription>
                Email: {tempData[0].owner_email}
              </DialogDescription>
            </div>
            <div className="border-b p-5">
              <DialogDescription className="font-medium text-black">
                Submitted
              </DialogDescription>
              <DialogDescription>
                Date: {tempData[0].timestamp}
              </DialogDescription>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button
                variant="outline"
                className="hover:bg-gray-200 transition"
              >
                Cancel
              </Button>
              <Button className="bg-activeBackgroundDark text-white hover:bg-opacity-90 transition">
                Accept
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
