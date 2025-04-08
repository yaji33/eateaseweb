import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Delete from "@/assets/delete.svg";
import Filter from "@/assets/filter.svg";
import Search from "@/assets/search.svg";
import FoodImg from "@/assets/Food.png";
import EditIcon from "@/assets/edit.svg";
import { Checkbox } from "@/components/ui/checkbox";
import FoodCard from "@/components/business/FoodCard";
import Modals from "@/components/business/modals";
import Screen from "@/assets/screen_warning.svg";

interface FoodCardProps {
  image: string;
  title: string;
  price: number;
}

const foods: FoodCardProps[] = [
  { image: FoodImg, title: "Chicksilog", price: 346 },
  { image: FoodImg, title: "Chicksilog", price: 346 },
  { image: FoodImg, title: "Chicksilog", price: 346 },
  { image: FoodImg, title: "Chicksilog", price: 346 },
  { image: FoodImg, title: "Chicksilog", price: 346 },
  { image: FoodImg, title: "Chicksilog", price: 346 },
];

export default function Page() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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
    <div className="flex w-full max-w-5xl mx-auto  flex-col min-h-screen font-poppins px-4 pt-20 gap-4"> 
      <h1 className="font-semibold text-xl">Menu</h1>
      <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
        <div className="flex items-center max-w-xl w-full">
          <div className="relative w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl block">
            <input
              type="text"
              placeholder="Search"
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
          <button className="border rounded-md p-2 bg-white flex items-center justify-center w-10 h-10">
            <img src={Delete} alt="delete" className="w-4" />
          </button>
          <Modals />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full flex flex-col flex-grow">
        <TabsList className="flex w-full bg-active_bg">
          <TabsTrigger
            value="all"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="rice meals"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            Rice Meals
          </TabsTrigger>
          <TabsTrigger
            value="pasta"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            Pasta
          </TabsTrigger>
          <TabsTrigger
            value="snacks"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            Snacks
          </TabsTrigger>
          <TabsTrigger
            value="drinks"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            Drinks
          </TabsTrigger>
          <TabsTrigger
            value="coffee"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            Coffee
          </TabsTrigger>
          <TabsTrigger
            value="other"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            Other
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="all"
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 data-[state=inactive]:hidden my-6"
        >
          {foods.map((food, index) => (
            <div
              key={index}
              className="flex flex-col border rounded-lg p-2 bg-white shadow-md"
            >
              <div className="flex justify-between p-2">
                <Checkbox className="" />
                <button className="">
                  <img src={EditIcon} alt="edit" className="w-4" />
                </button>
              </div>

              <FoodCard {...food} />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
