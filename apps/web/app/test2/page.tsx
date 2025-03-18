"use client";

import { useSocket } from "@/hooks/useSocket";
import { FromWebSocketMessages, SpotifyTrackType, ToWebSocketMessages } from "@repo/common/type";
import { useEffect, useState } from "react";

export default function Page() {
  const { socket, loading } = useSocket();
  const [searchResult, setSearchResult] = useState("");

  
  const sendMsg = () => {
    if (socket) {
      const sendMsg: ToWebSocketMessages = {
        type: "searchSongs",
        roomId: "N6XYOT",
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
            setSearchResult(data.message);

            const songs = JSON.parse(data.message) as unknown as SpotifyTrackType
            console.log("LOG TYPE=",songs)
          }
        }
      };
    }
  }, [socket]);

  return (
    <div>
      <button onClick={() => {
        sendMsg()
      }} className="border text-white">Click me</button>
    </div>
  );
}
