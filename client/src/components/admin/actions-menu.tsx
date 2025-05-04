"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useEateryStore, useModalStore } from "@/state/modalStore";

const ActionsMenu = ({ rowData }) => {
  const { openModal } = useModalStore();
  const { setEatery } = useEateryStore();

  // If the status is active, don't render the ActionsMenu
  if (rowData.status === "active") return null;

  const handleAction = () => {
    console.log(
      "Opening modal for eatery:",
      rowData.id,
      rowData.name,
      rowData.owner,
      rowData.status
    );
    setEatery(rowData.id, rowData.name, rowData.owner);
    openModal(rowData);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {rowData.status === "pending" && (
          <DropdownMenuItem onClick={handleAction}>
            View Application
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsMenu;
