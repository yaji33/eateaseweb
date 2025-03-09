import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function page() {
  return (
    <div className="flex w-full max-w-6xl mx-auto  flex-col min-h-screen bg-background font-poppins px-4 pt-20 gap-4">
      <h1 className="font-semibold text-xl">Dashboard</h1>
      <Tabs
        defaultValue="overview"
        className="bg-active_bg max-w-xs items-center p-1 rounded-[15px]"
      >
        <TabsList className="justify-between flex bg-active_bg">
          <TabsTrigger
            value="overview"
            className="focus:ring-0 text-text_active data-[state=active]:bg-background_active data-[state=active]:text-white py-2 rounded-[15px]"
          >
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="reviews"
            className="focus:ring-0 text-text_active data-[state=active]:bg-background_active data-[state=active]:text-white py-2 rounded-[15px]"
          >
            Reviews
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="focus:ring-0 text-text_active data-[state=active]:bg-background_active data-[state=active]:text-white py-2 rounded-[15px]"
          >
            About Us
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

export default page;
