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
import {
  useOwnerStore,
  useEateryStore,
  useModalStore,
} from "@/state/modalStore";

const ActionsMenu = ({ rowData, type }) => {
  const { openModal } = useModalStore();
  const { setEatery } = useEateryStore();
  const { setOwner } = useOwnerStore();

  const handleAction = () => {
    console.log(`Opening modal for ${type}:`, rowData.id, rowData.name);

    setEatery(null, null);
    setOwner(null, null);

    openModal();

    if (type === "eateries") {
      setEatery(rowData.id, rowData.name);
    } else {
      setOwner(rowData.id, rowData.name);
    }
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
        <DropdownMenuItem onClick={handleAction}>
          {type === "eateries" ? "View Eateries" : "View Business"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsMenu;
