import RoomInput from "@/components/RoomInput";
import React from "react";

export default function loading() {
  return (
    <div>
      <nav className="flex h-16 items-center justify-between border-b border-neutral-800 px-32">
        <span className="inline-block bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text text-2xl font-semibold text-transparent">
          Play-Fi
        </span>
        <div className="flex items-center justify-center space-x-2">
          <span className="relative flex h-8 w-8 animate-pulse items-center justify-center rounded-full border border-neutral-700 bg-neutral-700 p-1.5 text-neutral-400"></span>
          <span className="h-6 w-28 animate-pulse rounded-2xl bg-neutral-700"></span>
        </div>
      </nav>

      <div className="mt-10 flex justify-between px-32">
        <div>
          <RoomInput />
        </div>
      </div>
    </div>
  );
}
