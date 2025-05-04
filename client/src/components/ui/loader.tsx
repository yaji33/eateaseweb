import { Loader2 } from "lucide-react"; 
import React from "react";

export function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}
