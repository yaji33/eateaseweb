import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { EateriesCol, columns } from "./columns";
import { DataTable } from "@/components/admin/data-table";
import { useEateryStore } from "../../../state/modalStore";
import { Modal } from "@/components/admin/modals";
//import { SkeletonTable } from "@/components/admin/skeleton-table";
import { Loader } from "@/components/ui/loader";

import axios from "axios";
import socket from "@/lib/socket";

const API_URL = import.meta.env.VITE_API_URL;

const ITEMS_PER_PAGE = 15;

const statusMap = {
  0: "pending",
  1: "active",
  2: "launched",
  3: "banned",
};

async function getEateriesData(): Promise<EateriesCol[]> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/api/admin/restaurants`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.map((restaurant: any) => ({
      id: restaurant._id,
      name: restaurant.name,
      location: `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.province}`,
      owner: restaurant.owner_name,
      status:
        statusMap[restaurant.status as keyof typeof statusMap] || "pending",
      email: restaurant.email,
      contact: restaurant.contact,
      operating_hours: `${restaurant.operating_hours.open} - ${restaurant.operating_hours.close}`,
      created_at: new Date(restaurant.created_at).toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
}

export default function Eateries() {
  const [eateriesData, setEateries] = useState<EateriesCol[]>([]);
  const [filteredData, setFilteredData] = useState<EateriesCol[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { open, closeModal, eateryId } = useEateryStore();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getEateriesData();
      setEateries(data);
      setLoading(false);
    }
    fetchData();

    socket.on("restaurantStatusUpdated", async (updatedRestaurant) => {
      console.log("Received real-time update:", updatedRestaurant);
      fetchData();
    });

    return () => {
      socket.off("restaurantStatusUpdated");
    };
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
          e.location.toLowerCase().includes(lowerSearch) ||
          (e.email && e.email.toLowerCase().includes(lowerSearch)) ||
          (e.contact && e.contact.toLowerCase().includes(lowerSearch))
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
        <div className="flex justify-between items-center mb-4">
          <TabsList className="flex justify-start gap-3">
            {["all", "pending", "active", "banned"].map((status) => (
              <TabsTrigger key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative">
            <Input
              placeholder="Search restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-64"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <TabsContent value={statusFilter} className="mt-0">
          <div className="py-5">
            {loading ? (
              <Loader text="Fetching the latest eateries..." />
            ) : (
              <DataTable columns={columns} data={paginatedData} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
