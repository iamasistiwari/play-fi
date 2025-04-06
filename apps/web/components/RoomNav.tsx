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
    <div>
      <div className="flex h-[72px] items-center justify-between border-b border-neutral-800 px-32 py-2">
        <span className="inline-block bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text text-2xl font-semibold text-transparent">
          Play-Fi
        </span>
        <div className="rounded-3xl bg-neutral-900">
          <SongSearchBar socket={socket!}/>
        </div>
        <div>
          <div className="flex space-x-2 text-lg">
            <span>{currentMetadata?.room_title || "Ajaoo Mache"}</span>
          </div>
          <div className="flex space-x-2 text-sm">
            <span>{currentMetadata?.owner_name || "Ashish"}</span>
            <div className="flex justify-center items-center space-x-0.5">
              <Eye className="size-4"/>
              <span>{member}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 z-[-1] max-h-[72px] w-screen overflow-hidden">
        <BallPit ballsCount={member}/>
      </div>
    </div>
  );
}
