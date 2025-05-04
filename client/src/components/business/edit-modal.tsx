import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ComboboxDemo from "@/components/business/combo-box";
import EditIcon from "@/assets/edit.svg";
import axios from "axios";
import { toast } from "react-hot-toast"; 

interface MenuData {
  title: string;
  price: number;
  image: File | null;
  imagePreview: string;
  category_id: number;
}
interface MenuPayload {
  title: string;
  price: number;
  category_id: number;
  imageBase64?: string;
}

interface EditMenuModalProps {
  food: {
    _id: string;
    title: string;
    price: number;
    image: string;
    category_id: number;
  };
  onItemUpdated: () => void;
}

export default function EditMenuModal({
  food,
  onItemUpdated,
}: EditMenuModalProps) {
  const [menuData, setMenuData] = useState<MenuData>({
    title: food.title,
    price: food.price,
    image: null,
    imagePreview: food.image,
    category_id: food.category_id,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuData({ ...menuData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMenuData({
        ...menuData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1]; 
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!menuData.title || menuData.price <= 0) {
      toast.error("Please fill out all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const payload: MenuPayload = {
        title: menuData.title,
        price: menuData.price,
        category_id: menuData.category_id,
      };

      if (menuData.image) {
        const base64String = await fileToBase64(menuData.image);
        payload.imageBase64 = base64String;
      }

      await axios.patch(`http://localhost:5001/api/menu/${food._id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Menu item updated successfully!");
      onItemUpdated();
      setOpen(false);
    } catch (err) {
      console.error("Failed to update menu item", err);
      toast.error("Error updating menu item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setMenuData((prev) => ({
      ...prev,
      category_id: categoryId,
    }));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        <button>
          <img src={EditIcon} alt="edit" className="w-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="p-6 max-w-md bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Edit Menu Item
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            name="title"
            placeholder="Food Name"
            value={menuData.title}
            onChange={handleChange}
            className="border-gray-300 focus:ring-primary"
          />
          <Input
            name="price"
            type="number"
            placeholder="Price"
            value={menuData.price}
            onChange={handleChange}
            className="border-gray-300 focus:ring-primary"
          />

          <div className="flex flex-col items-center gap-2">
            {menuData.imagePreview && (
              <img
                src={menuData.imagePreview}
                alt="Preview"
                className="w-36 h-36 object-cover rounded-md"
              />
            )}
            <Input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer border-gray-300"
            />
          </div>

          <ComboboxDemo onCategorySelect={handleCategoryChange} />
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="outline"
            className="hover:bg-gray-200 transition"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-activeBackgroundDark text-white hover:bg-opacity-90 transition"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
