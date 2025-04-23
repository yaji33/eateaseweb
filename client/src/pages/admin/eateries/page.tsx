import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { EateriesCol, columns } from "./columns";
import { DataTable } from "@/components/admin/data-table";
import { useEateryStore } from "../../../state/modalStore";
import { Modal } from "@/components/admin/modals";

const ITEMS_PER_PAGE = 15;

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
      owner: "John Dave Bañas",
      status: "active",
    },
  ];
}

export default function Eateries() {
  const [eateriesData, setEateries] = useState<EateriesCol[]>([]);
  const [filteredData, setFilteredData] = useState<EateriesCol[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { open, closeModal, eateryId } = useEateryStore();

  useEffect(() => {
    async function fetchData() {
      const data = await getEateriesData();
      setEateries(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...eateriesData];

    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter);
    }

    if (search.trim() !== "") {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(lowerSearch) ||
          e.owner.toLowerCase().includes(lowerSearch) ||
          e.location.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [search, statusFilter, eateriesData]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="text-black flex flex-col min-h-screen p-5 space-y-5 font-poppins">
      <Modal open={open} onClose={closeModal} ownerId={eateryId} />

      <Tabs defaultValue="all" onValueChange={(val) => setStatusFilter(val)}>
        <TabsList className="flex w-full justify-start gap-3">
          {["all", "pending", "active", "banned"].map((status) => (
            <TabsTrigger key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={statusFilter}>
          <div className="py-5">
            <DataTable columns={columns} data={paginatedData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
