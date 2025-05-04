"use client";

import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEateryStore } from "@/state/modalStore";
import { EateriesCol } from "@/pages/admin/eateries/columns";
import axios from "axios";

export const ActionsCell = ({ eatery }: { eatery: EateriesCol }) => {
  const { setOpen, setEateryId } = useEateryStore();

  const handleStatusChange = async (id: string, newStatus: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5001/api/admin/restaurants/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating restaurant status:", error);
      alert("Failed to update restaurant status");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setEateryId(eatery.id);
            setOpen(true);
          }}
        >
          View Details
        </DropdownMenuItem>
        {eatery.status === "pending" && (
          <DropdownMenuItem
            onClick={() => handleStatusChange(eatery.id, 1)}
            className="text-green-600"
          >
            Approve
          </DropdownMenuItem>
        )}
        {eatery.status !== "banned" && (
          <DropdownMenuItem
            onClick={() => handleStatusChange(eatery.id, 3)}
            className="text-red-600"
          >
            Ban
          </DropdownMenuItem>
        )}
        {eatery.status === "banned" && (
          <DropdownMenuItem
            onClick={() => handleStatusChange(eatery.id, 2)}
            className="text-green-600"
          >
            Unban
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
