"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ActionsCell } from "@/components/admin/action-cell";

export type EateriesCol = {
  id: string;
  name: string;
  location: string;
  owner: string;
  status: string;
  email?: string;
  contact?: string;
  operating_hours?: string;
  created_at?: string;
};

export const columns: ColumnDef<EateriesCol>[] = [
  {
    accessorKey: "name",
    header: "Restaurant Name",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className={`${
            status === "pending"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
              : status === "active"
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-red-100 text-red-800 border-red-200"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const eatery = row.original;
      return <ActionsCell eatery={eatery} />;
    },
  },
];
