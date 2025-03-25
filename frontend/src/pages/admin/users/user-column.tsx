import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useModalStore } from "@/state/modalStore";
import { ArrowUpDown } from "lucide-react";
import { z } from "zod";
import { MoreHorizontal } from "lucide-react";
import ActionsMenu from "@/components/admin/actions-menu";

const Users = z.object({
  id: z.string(),
  name: z.string(),
  contact_number: z.string(),
  email: z.string().email(),
  address: z.string(),
});

type User = z.infer<typeof Users>;

export const userColumns: ColumnDef<User>[] = [
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
    id: "actions",
    cell: ({ row }) => <ActionsMenu rowData={row.original} type="user" />,
  },
];
