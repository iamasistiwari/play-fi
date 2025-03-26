"use client";
import React, { useCallback, useEffect, useState } from "react";
import Input from "./ui/Input";
import {
  FromWebSocketMessages,
  ToWebSocketMessages,
  YoutubeSearchDetails,
} from "@repo/common/type";
import { Plus, Search } from "lucide-react";
import debounce from "debounce";
import { useSocket } from "@/hooks/useSocket";
import Image from "next/image";
import CustomButton from "./ui/CustomButton";

export default function SongSearchBar({
  roomId,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const [songs, setSongs] = useState<YoutubeSearchDetails>();
  const [isInputFocus, setIsInputFocus] = useState<boolean>(false);
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as FromWebSocketMessages;

      if (data.type === "songs") {
        if (data.message) {
          const parsedSongs = JSON.parse(data.message) as YoutubeSearchDetails;
          console.log("SONGS", parsedSongs);
          setSongs(parsedSongs);
        }
      }
    };
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const handleSearch = useCallback(
    debounce((search: string) => {
      console.log("CAME HERE");

      if (search.length < 2 || !socket || loading) return;
      const sendMsg: ToWebSocketMessages = {
        type: "searchSongs",
        roomId,
        song: search,
      };
      console.log("CAME BELOW");
      socket.send(JSON.stringify(sendMsg));
    }, 600),
    [],
  );

  return (
    <div className="flex flex-col">
      <div className="relative flex">
        <Input
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          onFocus={() => setIsInputFocus(true)}
          onBlur={() => setIsInputFocus(false)}
          placeholder="What do you want to play?"
          className="w-[420px] rounded-3xl pl-16 text-sm text-neutral-300 transition-colors duration-200 focus:outline-neutral-300"
        />
        <Search className="absolute left-3 top-2 flex h-8 w-8 text-neutral-300" />
      </div>
      {isInputFocus && (
        <div className="absolute top-16 w-[420px] flex-1 flex-col space-y-2 rounded-md bg-neutral-900 px-4 py-2 backdrop-blur-sm">
          {songs?.items.slice(0, 5).map((value, index) => (
            <div key={index} className="flex justify-between">
              <div className="flex items-center text-lg">
                <div className="relative h-10 w-10">
                  <Image
                    alt="pic"
                    className="rounded-full object-cover"
                    src={`${value.thumbnail.thumbnails[0].url}`}
                    fill
                  />
                </div>
                <div className="ml-2 flex flex-col">
                  <span>{value.title.slice(0, 15)}</span>
                  <span className="text-xs text-neutral-300">
                    {value.channelTitle}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-neutral-300">
                  {value.length.simpleText}
                </span>
                <CustomButton
                  Icon={Plus}
                  className="h-8 max-w-32 px-3 text-xs"
                  isLoading={false}
                >
                  Add
                </CustomButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
