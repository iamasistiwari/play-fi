"use client";
import { useSocket } from "@/hooks/useSocket";
import { FromWebSocketMessages, RoomMetadata } from "@repo/common/type";
import React, { useEffect, useState } from "react";
import SongSearchBar from "./SongSearchBar";
import { Eye } from "lucide-react";
import BallPit from "./BallPit";

export default function RoomNav() {
  const { socket, loading, roomMetadata } = useSocket();
  const [currentMetadata, setCurrentMetadata] =
    useState<RoomMetadata>(roomMetadata!);
  const [member, setMembers] = useState<number>(roomMetadata?.joined_persons!)

  useEffect(() => {
    if (!socket || loading) return;
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as unknown as FromWebSocketMessages;
      if (data.type === "metadata") {
        if (data.metadata){
          setMembers(data.metadata.joined_persons)
          setCurrentMetadata(data.metadata);
        } 
      }
    };
    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  return (
    <div className="flex w-full flex-col">
      {/* Navigation Bar - Fixed on both mobile and desktop */}
      <div className="flex h-[72px] items-center justify-between border-b border-neutral-800 px-4 py-2 xl:px-32">
        {/* Logo */}
        <span className="inline-block bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text text-2xl font-semibold text-transparent">
          Play-Fi
        </span>

        {/* Room Info */}
        <div>
          <div className="flex space-x-2">
            <span className="max-w-[40vw] truncate whitespace-nowrap text-sm xl:max-w-[60vw] xl:text-lg">
              {currentMetadata?.room_title || "Ajaoo Mache"}
            </span>
          </div>
          <div className="flex space-x-2 text-sm text-neutral-400">
            <span className="max-w-[20vw] truncate">
              {currentMetadata?.owner_name || "Ashish"}
            </span>
            <div className="flex items-center justify-center space-x-0.5">
              <Eye className="size-4" />
              <span>{member}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar - Below nav on mobile, Hidden on desktop (assuming it appears elsewhere on desktop) */}
      <div className="w-full px-4 py-3 md:hidden">
        <SongSearchBar socket={socket!} />
      </div>

      {/* Desktop Search Bar - Hidden on mobile (presumably this is positioned elsewhere in your desktop layout) */}
      <div className="hidden xl:absolute xl:left-1/2 xl:top-3 xl:z-10 xl:flex min-w-[30vw] xl:-translate-x-1/2 xl:transform">
        <SongSearchBar socket={socket!} />
      </div>

      {/* Background Effect */}
      <div className="absolute top-0 z-[-1] max-h-[72px] w-screen overflow-hidden">
        <BallPit ballsCount={member} />
      </div>
    </div>
  );
}
