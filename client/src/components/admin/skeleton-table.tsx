import React from "react";

export function SkeletonTable({ rows = 10 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 animate-pulse p-2 border-b border-gray-200"
        >
          <div className="h-4 bg-gray-300 rounded w-1/6" />
          <div className="h-4 bg-gray-300 rounded w-1/4" />
          <div className="h-4 bg-gray-300 rounded w-1/6" />
          <div className="h-4 bg-gray-300 rounded w-1/6" />
          <div className="h-4 bg-gray-300 rounded w-1/5" />
        </div>
      ))}
    </div>
  );
}
