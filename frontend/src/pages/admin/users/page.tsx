import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { Payment, columns } from "./columns";
import { Owner, ownerColumns } from "./owner-column";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOwnerStore } from "../../../state/modalStore";
import { Modal } from "@/components/admin/modals";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "728ed52f",
      name: "John Doe",
      amount: 100,
      status: "Pending",
      email: "m@example.com",
    },
    {
      id: "428ac53g",
      name: "Jane Smith",
      amount: 130,
      status: "Success",
      email: "m@example.com",
    },
  ];
}

async function getOwnerData(): Promise<Owner[]> {
  return [
    {
      id: "728ed52f",
      name: "John Doe",
      contact_number: "1234567890",
      email: "johndoe@gmail.com",
      address: "123, Lorem Ipsum",
      status: "active",
    },
    {
      id: "a12bc34d",
      name: "Jane Smith",
      contact_number: "9876543210",
      email: "janesmith@gmail.com",
      address: "456, Dolor Sit Amet",
      status: "offline",
    },
    {
      id: "b23cd45e",
      name: "Robert Johnson",
      contact_number: "1122334455",
      email: "robertjohnson@gmail.com",
      address: "789, Consectetur Adipiscing",
      status: "active",
    },
    {
      id: "c34de56f",
      name: "Emily Davis",
      contact_number: "2233445566",
      email: "emilydavis@gmail.com",
      address: "321, Elit Sed Do",
      status: "active",
    },
    {
      id: "d45ef67a",
      name: "Michael Brown",
      contact_number: "3344556677",
      email: "michaelbrown@gmail.com",
      address: "654, Tempor Incididunt",
      status: "offline",
    },
    {
      id: "e56fg78b",
      name: "Jessica Wilson",
      contact_number: "4455667788",
      email: "jessicawilson@gmail.com",
      address: "987, Ut Labore Et",
      status: "active",
    },
    {
      id: "f67gh89c",
      name: "David Martinez",
      contact_number: "5566778899",
      email: "davidmartinez@gmail.com",
      address: "159, Magna Aliqua",
      status: "offline",
    },
    {
      id: "g78hi90d",
      name: "Sarah Anderson",
      contact_number: "6677889900",
      email: "sarahanderson@gmail.com",
      address: "753, Enim Ad Minim",
      status: "active",
    },
    {
      id: "h89ij01e",
      name: "Daniel Thomas",
      contact_number: "7788990011",
      email: "danielthomas@gmail.com",
      address: "852, Veniam Quis",
      status: "offline",
    },
    {
      id: "a30hg33f",
      name: "Karel Jhona Cestina",
      contact_number: "1122334455",
      email: "ganda@gmail.com",
      address: "321, Tagas",
      status: "active",
    },
  ];
}

export default function Users() {
  const [data, setData] = useState<Payment[]>([]);
  const [ownerData, setOwnerData] = useState<Owner[]>([]);
  const { open, closeModal, ownerId } = useOwnerStore();

  useEffect(() => {
    async function fetchData() {
      const [paymentResult, ownerResult] = await Promise.all([
        getData(),
        getOwnerData(),
      ]);

      setData(paymentResult);
      setOwnerData(ownerResult);
    }
    fetchData();
  }, []);

  return (
    <div className="text-black flex flex-col min-h-screen p-5 space-y-5 font-poppins">
      {/*<div className="flex gap-4 border-b py-5">
        <Button variant="destructive" className="rounded-md">
          Customers
        </Button>
        <Button variant="outline" className="rounded-md">
          Owners
        </Button>
      </div>
      <div className="flex items-center gap-2 max-w-sm border rounded-lg px-3 py-2 shadow-sm">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search for Customers"
          className="border-none outline-none focus:ring-0 focus:border-transparent shadow-none bg-transparent w-full"
        />
        
      </div>*/}
      <Modal open={open} onClose={closeModal} ownerId={ownerId} />
      <Tabs defaultValue="customers" className="">
        <TabsList className="gap-3 p-0">
          <TabsTrigger
            value="customers"
            className="bg-white py-2 border focus:ring-0 rounded-md data-[state=active]:bg-background_active data-[state=active]:text-white"
          >
            Customers
          </TabsTrigger>

          <TabsTrigger
            value="owners"
            className="bg-white py-2 border focus:ring-0 rounded-md data-[state=active]:bg-background_active data-[state=active]:text-white"
          >
            Owners
          </TabsTrigger>
        </TabsList>
        <TabsContent value="customers">
          <div className="container py-5">
            <DataTable columns={columns} data={data} />
          </div>
        </TabsContent>
        <TabsContent value="owners">
          <div className="container py-5">
            <DataTable columns={ownerColumns} data={ownerData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
