import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { EateriesCol, columns } from "./columns";
import { DataTable } from "@/components/admin/data-table";
import { useEateryStore } from "../../../state/modalStore";
import { Modal } from "@/components/admin/modals";

async function getEateriesData(): Promise<EateriesCol[]> {
  return [
    {
      id: "728ed52f",
      name: "Mac&Gab Food Hub",
      location: "123, Lorem Ipsum",
      owner: "Karel Jhona Cestina",
      status: "pending",
    },
    {
      id: "532fg53c",
      name: "Starbucks Tabaco",
      location: "343, Lorem Ipsum",
      owner: "Jucel Christopher Salazar Jr.",
      status: "banned",
    },
    {
      id: "122ty34c",
      name: "Jollibee",
      location: "123, Lorem Ipsum",
      owner: "John Dave Bañas.",
      status: "active",
    },
  ];
}

export default function Eateries() {
  const [eateriesData, setEateries] = React.useState<EateriesCol[]>([]);
  const { open, closeModal, eateryId } = useEateryStore();

  useEffect(() => {
    async function fetchData() {
      const [eateriesResult] = await Promise.all([getEateriesData()]);
      setEateries(eateriesResult);
    }
    fetchData();
  }, []);

  return (
    <div className="text-black flex flex-col min-h-screen p-5 space-y-5 font-poppins">
      <Modal open={open} onClose={closeModal} ownerId={eateryId} />
      <Tabs defaultValue="all" className="">
        <TabsList className="gap-3 p-0">
          <TabsTrigger
            value="all"
            className="px-6 py-2 border focus:ring-0 rounded-md data-[state=active]:bg-background_active data-[state=active]:text-white "
          >
            All
          </TabsTrigger>

          <TabsTrigger
            value="active"
            className="px-6 py-2 border focus:ring-0 rounded-md data-[state=active]:bg-background_active data-[state=active]:text-white"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="px-6 py-2 border focus:ring-0 rounded-md data-[state=active]:bg-background_active data-[state=active]:text-white"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="banned"
            className="px-6 py-2 border focus:ring-0 rounded-md data-[state=active]:bg-background_active data-[state=active]:text-white"
          >
            Banned
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="container py-5">
            <DataTable columns={columns} data={eateriesData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
