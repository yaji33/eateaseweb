import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Delete from "@/assets/delete.svg";
import Filter from "@/assets/filter.svg";
import Search from "@/assets/search.svg";
import { Checkbox } from "@/components/ui/checkbox";
import FoodCard from "@/components/business/FoodCard";
import Modals from "@/components/business/modals";
import EditMenu from "@/components/business/edit-modal";
import Screen from "@/assets/screen_warning.svg";

interface FoodCardProps {
  _id: string;
  image: string;
  title: string;
  price: number;
  category_id: number;
}

export default function Page() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [foods, setFoods] = useState<FoodCardProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5001/api/menu", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formatted = res.data.map((item: any) => ({
        _id: item._id,
        title: item.name,
        price: item.price,
        image: item.image_url,
        category_id: item.category_id,
      }));

      setFoods(formatted);
    } catch (err) {
      console.error("Failed to fetch menu items", err);
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5001/api/menu/delete-multiple",
        { ids: selectedItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedItems([]);
      fetchMenuItems(); // refresh the list
      alert("Selected items deleted!");
    } catch (err) {
      console.error("Failed to delete items", err);
      alert("Error deleting menu items.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredFoods = (category: string) => {
    const categoryMap: Record<string, number> = {
      "rice meals": 1,
      "pasta": 2,
      "snacks": 3,
      "drinks": 4,
      "coffee": 5,
      "other": 6,
    };    

    return foods.filter((food) => {
      const matchesSearch = food.title.toLowerCase().includes(searchTerm);
      const matchesCategory = category === "all" || food.category_id === categoryMap[category];
      return matchesSearch && matchesCategory;
    });
  };
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (screenWidth < 700) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="card bg-base-100 shadow-xl text-center p-8 ">
          <figure>
            <img
              src={Screen}
              alt="Small screen warning"
              className="w-96 mx-auto"
            />
          </figure>
          <div className="card-body mt-5">
            <h2 className="text-xl font-bold text-red-500">Screen Too Small</h2>
            <p className="text-gray-600">
              This page is best viewed on a larger screen. Try using a desktop
              or rotating your device.
            </p>
            <div className="card-actions justify-center">
              <button className="btn btn-primary">Go Back</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen font-poppins px-4 pt-20 gap-4">
      <h1 className="font-semibold text-xl">Menu</h1>
      <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
        <div className="flex items-center max-w-xl w-full">
          <div className="relative w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl block">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-md pl-12 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            />
            <img
              src={Search}
              alt="search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 opacity-60"
            />
          </div>
        </div>

        <div className="flex sm:gap-2 gap-1">
          <button className="border rounded-md p-2 bg-white flex items-center justify-center w-10 h-10">
            <img src={Filter} alt="filter" className="w-4" />
          </button>
          <button
            className="border rounded-md p-2 bg-white hover:bg-gray-200 flex items-center justify-center w-10 h-10"
            onClick={deleteSelectedItems}
          >
            <img src={Delete} alt="delete" className="w-4" />
          </button>

          <Modals onItemAdded={fetchMenuItems} />
        </div>
      </div>

      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="w-full flex flex-col flex-grow"
      >
        <TabsList className="flex w-full justify-start gap-3">
          {[
            "all",
            "rice meals",
            "pasta",
            "snacks",
            "drinks",
            "coffee",
            "other",
          ].map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="flex-1 text-center capitalize"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent
          value={selectedCategory}
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 data-[state=inactive]:hidden my-6"
        >
          {foods
            .filter((food) => {
              const categoryMap: Record<string, number> = {
                "rice meals": 1,
                "pasta": 2,
                "snacks": 3,
                "drinks": 4,
                "coffee": 5,
                "other": 6,
              };
              

              const matchesCategory =
                selectedCategory === "all" ||
                food.category_id === categoryMap[selectedCategory];

              const matchesSearch = food.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

              return matchesCategory && matchesSearch;
            })
            .map((food, index) => (
              <div
                key={index}
                className="flex flex-col border rounded-lg p-2 bg-white shadow-md"
              >
                <div className="flex justify-between p-2">
                <Checkbox
                  checked={selectedItems.includes(food._id)}
                  onCheckedChange={() => toggleSelectItem(food._id)}
                />

                <EditMenu food={food} onItemUpdated={fetchMenuItems} />
                </div>
                <FoodCard {...food} />
              </div>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
