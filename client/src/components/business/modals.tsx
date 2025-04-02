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

export default function AddMenuModal() {
  const [menuData, setMenuData] = useState({
    title: "",
    price: "",
    image: null,
    imagePreview: null,
  });

  const handleChange = (e) => {
    setMenuData({ ...menuData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMenuData({
        ...menuData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = () => {
    console.log("New Menu Item:", menuData);
  };

  return (
    <Dialog>
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

          {/* Image Upload with Preview */}
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
          <Selection />
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" className="hover:bg-gray-200 transition">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-activeBackgroundDark text-white hover:bg-opacity-90 transition"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
