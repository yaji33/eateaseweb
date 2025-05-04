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
import Add from "@/assets/add.svg";
import Selection from "@/components/business/combo-box";
import axios from "axios";
import { toast } from "react-hot-toast"; // Import toast

interface ModalsProps {
  onItemAdded: () => void;
}

export default function AddMenuModal({ onItemAdded }: ModalsProps) {
  const [menuData, setMenuData] = useState<{
    title: string;
    price: string;
    image: File | null;
    imagePreview: string | null;
  }>({
    title: "",
    price: "",
    image: null,
    imagePreview: null,
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false); // Controls modal visibility

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1]; // Strip prefix
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

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

  const resetForm = () => {
    setMenuData({
      title: "",
      price: "",
      image: null,
      imagePreview: null,
    });
    setSelectedCategoryId(null);
  };

  const handleSubmit = async () => {
    if (
      !menuData.title ||
      !menuData.price ||
      !menuData.image ||
      !selectedCategoryId
    ) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const imageBase64 = await fileToBase64(menuData.image);

      await axios.post(
        "http://localhost:5001/api/menu",
        {
          title: menuData.title,
          price: menuData.price,
          category_id: selectedCategoryId,
          imageBase64: imageBase64,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Menu item added successfully!");
      onItemAdded();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.error("Failed to add menu item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <button className="border rounded-md p-2 bg-white shadow-sm hover:bg-gray-100 transition">
          <img src={Add} alt="Add" className="w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="p-6 max-w-md bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add New Menu Item
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
                className="w-24 h-24 object-cover rounded-md border"
              />
            )}
            <Input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border-gray-300 cursor-pointer"
            />
          </div>

          {/* Dropdown for Menu Category */}
          <Selection onCategorySelect={setSelectedCategoryId} />
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
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
