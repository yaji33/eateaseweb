"use client";

interface ComboBoxProps {
  onCategorySelect: (id: number) => void;
}


import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
  { value: "ricemeals", label: "Rice Meals", category_id: 1 },
  { value: "pasta", label: "Pasta", category_id: 2 },
  { value: "snacks", label: "Snacks", category_id: 3 },
  { value: "drinks", label: "Drinks", category_id: 4 },
  { value: "coffee", label: "Coffee", category_id: 5 },
  { value: "others", label: "Others", category_id: 6 },
];

export default function ComboboxDemo({ onCategorySelect }: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Menu Category"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search for Category" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    const selected = frameworks.find(f => f.value === currentValue);
                    if (selected) {
                      setValue(currentValue === value ? "" : currentValue);
                      onCategorySelect(selected.category_id); // 💡 pass ID up
                    }
                    setOpen(false);
                  }}                  
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
