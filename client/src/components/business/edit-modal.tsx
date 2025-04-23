import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Selection from "@/components/business/combo-box";
import EditIcon from "@/assets/edit.svg";

interface EditMenuModalProps {
  food: {
    title: string;
    price: number;
    image: string;
    category?: string;
  };
}

export default function EditMenuModal({ food }: EditMenuModalProps) {
  const [menuData, setMenuData] = useState({
    title: food.title,
    price: food.price,
    image: null,
    imagePreview: food.image,
  });

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

  const handleSubmit = () => {
    console.log("Updated Menu Item:", menuData);
  };

  return (
    <Dialog>
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
          />
          <Input
            name="price"
            type="number"
            placeholder="Price"
            value={menuData.price}
            onChange={handleChange}
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
              className="cursor-pointer"
            />
          </div>
          <Selection />
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" className="hover:bg-gray-200">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-activeBackgroundDark text-white hover:bg-opacity-90"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
