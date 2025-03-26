"use client";
import { useSocket } from "@/hooks/useSocket";
import { FromWebSocketMessages, RoomMetadata } from "@repo/common/type";
import React, { useEffect, useState } from "react";
import SongSearchBar from "./SongSearchBar";

export default function RoomNav({ metadata }: { metadata: RoomMetadata }) {
  const [roomMetaData, setRoomMetadata] = useState<RoomMetadata>(metadata);
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (!socket || loading) return;
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as unknown as FromWebSocketMessages;
      if (data.type === "metadata") {
        if (data.metadata) setRoomMetadata(data.metadata);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  return (
    <div className="flex h-[72px] items-center justify-between border-b border-neutral-800 px-32 py-2">
      <div>Meta</div>
      <div>
        <SongSearchBar socket={socket!} roomId={metadata?.room_id || "asdasd"} />
      </div>
      <div>
        <div className="flex space-x-2 text-lg">
          <span className="text-neutral-400">current user:</span>
          <span>{roomMetaData?.joined_persons || "10"}</span>
        </div>
        <div className="flex space-x-2 text-sm">
          <span className="text-neutral-400">owner:</span>
          <span>{roomMetaData?.owner_name || "user"}</span>
        </div>
      </div>
    </div>
  );
}
