import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { useEateryStore } from "@/state/modalStore";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  ownerId: string | null;
}

interface RestaurantDetails {
  name: string;
  owner_name: string;
  address: {
    street: string;
    city: string;
    province: string;
    zip: string;
  };
  contact: string;
  email: string;
  operating_hours: {
    open: string;
    close: string;
  };
  status: number;
  created_at: string;
}

export const Modal: React.FC<ModalProps> = ({
  open: propsOpen,
  onClose,
  ownerId,
}) => {
  const { eateryId, open, setOpen } = useEateryStore();
  const [restaurantDetails, setRestaurantDetails] =
    useState<RestaurantDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setOpen(false);
    onClose();
  };

  useEffect(() => {
    async function fetchDetails() {
      const id = eateryId || ownerId;
      if (!id) return;

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5001/api/admin/restaurants/${eateryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRestaurantDetails(response.data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      } finally {
        setLoading(false);
      }
    }

    if ((open || propsOpen) && (eateryId || ownerId)) {
      fetchDetails();
    }
  }, [open, propsOpen, eateryId, ownerId]);

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Active";
      case 3:
        return "Banned";
      default:
        return "Unknown";
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restaurant Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : restaurantDetails ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">
                {restaurantDetails.name}
              </h3>
              <div className="text-sm text-gray-500">
                Created on{" "}
                {new Date(restaurantDetails.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Owner</p>
                <p className="text-sm text-gray-600">
                  {restaurantDetails.owner_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-gray-600">
                  {getStatusText(restaurantDetails.status)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-600">
                  {restaurantDetails.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Contact</p>
                <p className="text-sm text-gray-600">
                  {restaurantDetails.contact}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Operating Hours</p>
                <p className="text-sm text-gray-600">
                  {restaurantDetails.operating_hours.open} -{" "}
                  {restaurantDetails.operating_hours.close}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-gray-600">
                {restaurantDetails.address.street},{" "}
                {restaurantDetails.address.city},{" "}
                {restaurantDetails.address.province},{" "}
                {restaurantDetails.address.zip}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">No restaurant details found</div>
        )}
      </DialogContent>
    </Dialog>
  );
};
