"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomButton from "./ui/CustomButton";
import clsx from "clsx";
import { getRooms } from "@/actions/getRooms";

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

  useEffect(() => {
    const gets = async () => {
      try {
        const res = await getRooms();
        if (res) {
          setLoading(false);
          setRoom(res);
        }
      } catch (error) {
        console.log("ERROR WHILE FETCHING");
      }
    };
    gets();
  }, []);

  if (loading) {
    return (
      <div className="border-custom flex max-h-[90vh] min-h-[60vh] w-[40vw] flex-col scroll-smooth rounded-xl border pt-2">
        <span className="flex justify-center text-lg font-semibold">
          Recent joined rooms
        </span>

        <div className="scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded flex max-h-[70vh] flex-col justify-between space-y-3 overflow-y-auto px-3 py-4 text-start">
          {new Array(5).fill(1).map((room, index) => (
            <div className="flex flex-col" key={index}>
              <span></span>
              <span className="h-2 w-2 bg-neutral-700"></span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-custom flex max-h-[90vh] min-h-[60vh] w-[40vw] flex-col scroll-smooth rounded-xl border pt-2">
      <span className="flex justify-center text-lg font-semibold">
        Recent joined rooms
      </span>

      <div className="scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded flex max-h-[70vh] flex-col justify-between space-y-3 overflow-y-auto px-3 py-4 text-start">
        {rooms?.map((room) => (
          <div
            className="flex flex-row items-center justify-between border-b border-neutral-500 py-2"
            key={room.data.roomId}
          >
            <div className="flex flex-col">
              <span>{room.data.roomName}</span>
              <div className="flex flex-row space-x-4 pt-0.5 text-xs text-neutral-300">
                <span>
                  owner: {room.type === "hosted" ? "you" : room.data.ownerName}
                </span>
                <span className="">id: {room.data.roomId}</span>
              </div>
            </div>
            <div>
              <CustomButton
                className={clsx("", room.type === "joined" && "bg-blue-700")}
                isLoading={false}
                Icon={null}
              >
                {room.type === "hosted" ? "Re create" : "Join"}
              </CustomButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
