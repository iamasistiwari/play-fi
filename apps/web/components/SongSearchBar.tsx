"use client";
import React, { useCallback, useEffect, useState } from "react";
import Input from "./ui/Input";
import {
  FromWebSocketMessages,
  SpotifyTrackType,
  ToWebSocketMessages,
} from "@repo/common/type";
import { Music2, Search } from "lucide-react";
import debounce from "debounce";
import { useSocket } from "@/hooks/useSocket";

export default function SongSearchBar({
  socket,
  roomId,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const [songs, setSongs] = useState<SpotifyTrackType>();

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as FromWebSocketMessages;

      if (data.type === "songs") {
        if (data.message) {
          const parsedSongs = JSON.parse(data.message) as SpotifyTrackType;
          setSongs(parsedSongs);
          console.log("SONGS", parsedSongs);
        }
      }
    };
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const exampleArray = [
    {
      name: "Risk",
      artist: "Gracie Abrams",
      time: "220000",
    },
    {
      name: "Wavy",
      artist: "Karan Aujla",
      time: "220000",
    },
    {
      name: "Winning speech",
      artist: "Gracie Abrams",
      time: "220000",
    },
    {
      name: "Brown Rang",
      artist: "Honey Singh",
      time: "220000",
    },
    {
      name: "Beliver",
      artist: "Imagine Drangonse",
      time: "220000",
    },
  ];

  const handleSearch = useCallback(
    debounce((search: string) => {
      if (search.length < 2) return;
      const sendMsg: ToWebSocketMessages = {
        type: "searchSongs",
        roomId,
        song: search,
      };
      if (socket) {
        socket.send(JSON.stringify(sendMsg));
      }
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
          placeholder="What do you want to play?"
          className="w-96 rounded-3xl pl-16 text-sm text-neutral-300 transition-colors duration-200 focus:outline-neutral-300"
        />
        <Search className="absolute left-3 top-2 flex h-8 w-8 text-neutral-300" />
      </div>
      <div className="px-4 space-y-2 py-2 absolute top-16 max-h-96 min-h-20 min-w-96 flex-1 bg-neutral-900 rounded-md backdrop-blur-sm flex-col">
        {/* {songs?.tracks.items.slice(0, 5).map((value, key) => (
          <span key={key}>{value.name}</span>
        ))} */}
        {exampleArray.map((val, index) => (
          <div key={index} className="flex items-center text-lg">
            <Music2 className="w-3 h-3 mr-1" />
            <div className="flex flex-col">
              <span>{val.name}</span>
              <span className="text-xs text-neutral-300">{val.artist}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
