"use client";
import React, { useEffect, useState } from "react";
import CustomButton from "./ui/CustomButton";
import clsx from "clsx";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { FromWebSocketMessages } from "@repo/common/type";
import { cn } from "@/lib/utils";

interface Rooms {
  type: string;
  time: Date;
  data: {
    created_At: Date;
    roomId: string;
    ownerId: string;
    ownerName: string;
    roomName: string;
    roomPassword: string;
    maxJoinedUser: number;
  };
}

export default function RecentlyJoined() {
  const [rooms, setRoom] = useState<Rooms[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket, SetRoomMetadata } = useSocket();
  const [creating, setCreating] = useState<boolean[]>(new Array(rooms.length).fill(false));
  const router = useRouter();

  const handleJoin = (index: number) => {
    if (socket && rooms[index]) {
      setCreating((prev) => {
        const newCreating = [...prev]
        newCreating[index] = true
        return newCreating
      });
      const roomMsg = {
        type: "join_room",
        roomId: rooms[index].data.roomId,
        roomPassword: rooms[index].data.roomPassword,
      };
      return socket.send(JSON.stringify(roomMsg));
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleMessage = async (event: MessageEvent) => {
      const data = JSON.parse(event.data) as unknown as FromWebSocketMessages;
      if (data.type === "joined" && data.metadata) {
        SetRoomMetadata(data.metadata);
        const path = data.metadata.room_id.toLowerCase()
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCreating((prev) => prev.map(() => false));
        router.push(`/room/${path}`)
      }
      if (data.type === "error" && data.message) {
        setCreating((prev) => prev.map(() => false));

        return;
      }
    };
    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    const gets = async () => {
      try {
        const res = await fetch("/api/rooms", {
          method: "GET",
        });
        const parsedData = await res.json()
        if (!res.ok) {
          setLoading(false);
          setRoom([])
          setCreating(new Array(parsedData.length).fill(false)); 
          return
        }
        setLoading(false);
        setRoom(parsedData);
        setCreating(new Array(parsedData.length).fill(false)); 
      } catch (error) {
        console.log("ERROR WHILE FETCHING");
      }
    };
    gets();
  }, []);

  if (loading) {
    return (
      <div className="border-custom flex max-h-[90vh] min-h-[60vh] xl:w-[40vw] flex-col scroll-smooth rounded-xl border pt-2">
        <span className="flex justify-center pt-2 text-lg font-semibold">
          Recent joined rooms
        </span>

        <div className="scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded flex max-h-[70vh] flex-col justify-between space-y-3 overflow-y-auto px-3 py-4 pt-6 text-start">
          {new Array(5).fill(1).map((room, index) => (
            <div className="flex flex-col" key={index}>
              <span></span>
              <span className="h-14 w-full animate-pulse rounded-2xl bg-neutral-800 opacity-85"></span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-custom flex max-h-[90vh] min-h-[60vh] xl:w-[40vw] mt-4 xl:mt-0 flex-col scroll-smooth rounded-xl border pt-2">
      <span className="flex justify-center pt-2 text-lg font-semibold">
        Recent joined rooms
      </span>

      <div className="scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded flex max-h-[70vh] flex-col justify-between space-y-3 overflow-y-auto p-4 text-start">
        {rooms?.map((room, index) => (
          <div
            className={cn(
              "flex flex-row items-center justify-between border-b border-neutral-700 py-2 pb-4 pt-6",
              index === rooms.length-1 && "border-b-0"
            )}
            key={room.data.roomId}
          >
            <div className="flex flex-col">
              <span className="text-[15px] lg:text-base">{room.data.roomName}</span>
              <div className="flex flex-row space-x-4 pt-0.5 text-xs text-neutral-300">
                <span className="text-xs">
                  {room.type === "hosted" ? "you" : room.data.ownerName}
                </span>
                <span className="">id: {room.data.roomId}</span>
              </div>
            </div>
            <div>
              <CustomButton
                className={clsx("px-2 lg:px-8", room.type === "joined" && "bg-blue-700")}
                isLoading={creating[index] || false}
                Icon={null}
                onClick={() => {
                  handleJoin(index);
                }}
                loaderStyle="mr-2"
              >
                {room.type === "hosted" ? "Create again" : "Join again"}
              </CustomButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
