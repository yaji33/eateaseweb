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
import Selection from "@/components/business/combo-box"

export default function AddMenuModal() {
  const [menuData, setMenuData] = useState({ title: "", price: "", image: "" });

  const handleChange = (e) => {
    setMenuData({ ...menuData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("New Menu Item:", menuData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="border rounded-md p-2 bg-white">
          <img src={Add} alt="add" className="w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="p-6 max-w-md bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
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
          <Input
            name="image"
            type="file"
            onChange={(e) =>
              setMenuData({ ...menuData, image: e.target.files[0] })
            }
          />
          <Selection />
          
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-activeBackgroundDark">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
