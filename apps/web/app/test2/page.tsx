"use client";

import { useSocket } from "@/hooks/useSocket";
import { FromWebSocketMessages, SpotifyTrackType, ToWebSocketMessages } from "@repo/common/type";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
  const { socket, loading } = useSocket();
  const [searchResult, setSearchResult] = useState<SpotifyTrackType>();

  
  const sendMsg = () => {
    if (socket) {
      const sendMsg: ToWebSocketMessages = {
        type: "searchSongs",
        roomId: "TSB23X",
        song: "risk",
      };
      socket.send(JSON.stringify(sendMsg));
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data) as unknown as FromWebSocketMessages;
        if (data.type === "songs") {
          if (data.message) {
            const songs = JSON.parse(data.message) as unknown as SpotifyTrackType
            setSearchResult(songs)
            console.log("LOG TYPE=",songs)
          }
        }
      };
    }
  }, [socket]);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => {
          sendMsg();
        }}
        className="max-w-32 border text-white"
      >
        Click me
      </button>
      <div>
        {searchResult?.tracks.items.map((value, index) => (
          <Image
            key={index}
            src={
              value.album.images[1].url
            }
            width={200}
            height={200}
            alt="any"
          />
        ))}
      </div>
    </div>
  );
}
