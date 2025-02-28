import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useModalStore } from "@/state/modalStore";
import { ArrowUpDown } from "lucide-react";
import { z } from "zod";
import { MoreHorizontal } from "lucide-react";
import ActionsMenu from "@/components/admin/actions-menu";

const Owners = z.object({
  id: z.string(),
  name: z.string(),
  contact_number: z.string(),
  email: z.string().email(),
  address: z.string(),
  status: z.enum(["offline", "active"]),
});

type Owner = z.infer<typeof Owners>;

export const ownerColumns: ColumnDef<Owner>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name");

      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "contact_number",
    header: "Contact Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <span className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              status === "active" ? "bg-green-500" : "bg-gray-400"
            }`}
          ></span>
          <span
            className={`text-sm font-medium ${
              status === "active" ? "text-green-500" : "text-gray-400"
            }`}
          >
            {status}
          </span>
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsMenu rowData={row.original} type="owner" />,
  },
];
