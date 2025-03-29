"use client";
import {
  FromWebSocketMessages,
  StoreSongs,
  YoutubeVideoDetails,
} from "@repo/common/type";
import { Music2, ThumbsUp } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player"

export default function RoomPlayer({ socket }: { socket: WebSocket }) {
  const [songQueue, setSongQueue] = useState<StoreSongs[]>([]);
  const playerRef = useRef<ReactPlayer | null>(null)

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as unknown as FromWebSocketMessages;
      if (data.type === "queue") {
        if (data.queue) {
          setSongQueue(data.queue);
        }
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  // const exampleData: StoreSongs[] = [
  //   {
  //     votes: 10,
  //     addedBy: "Ashish Tiwari",
  //     id: "XTp5jaRU3Ws",
  //     thumbnail: {
  //       thumbnails: [
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
  //           width: 360,
  //           height: 202,
  //         },
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
  //           width: 720,
  //           height: 404,
  //         },
  //       ],
  //     },
  //     title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
  //     channelTitle: "Karan Aujla",
  //     length: {
  //       simpleText: "2:41",
  //     },
  //   },
  //   {
  //     votes: 10,
  //     addedBy: "Ashish Tiwari",
  //     id: "XTp5jaRU3Ws",
  //     thumbnail: {
  //       thumbnails: [
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
  //           width: 360,
  //           height: 202,
  //         },
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
  //           width: 720,
  //           height: 404,
  //         },
  //       ],
  //     },
  //     title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
  //     channelTitle: "Karan Aujla",
  //     length: {
  //       simpleText: "2:41",
  //     },
  //   },
  //   {
  //     votes: 10,
  //     addedBy: "Ashish Tiwari",
  //     id: "XTp5jaRU3Ws",
  //     thumbnail: {
  //       thumbnails: [
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
  //           width: 360,
  //           height: 202,
  //         },
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
  //           width: 720,
  //           height: 404,
  //         },
  //       ],
  //     },
  //     title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
  //     channelTitle: "Karan Aujla",
  //     length: {
  //       simpleText: "2:41",
  //     },
  //   },
  //   {
  //     votes: 10,
  //     addedBy: "Ashish Tiwari",
  //     id: "XTp5jaRU3Ws",
  //     thumbnail: {
  //       thumbnails: [
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
  //           width: 360,
  //           height: 202,
  //         },
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
  //           width: 720,
  //           height: 404,
  //         },
  //       ],
  //     },
  //     title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
  //     channelTitle: "Karan Aujla",
  //     length: {
  //       simpleText: "2:41",
  //     },
  //   },
  //   {
  //     votes: 10,
  //     addedBy: "Ashish Tiwari",
  //     id: "XTp5jaRU3Ws",
  //     thumbnail: {
  //       thumbnails: [
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
  //           width: 360,
  //           height: 202,
  //         },
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
  //           width: 720,
  //           height: 404,
  //         },
  //       ],
  //     },
  //     title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
  //     channelTitle: "Karan Aujla",
  //     length: {
  //       simpleText: "2:41",
  //     },
  //   },
  //   {
  //     votes: 10,
  //     addedBy: "Ashish Tiwari",
  //     id: "XTp5jaRU3Ws",
  //     thumbnail: {
  //       thumbnails: [
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
  //           width: 360,
  //           height: 202,
  //         },
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
  //           width: 720,
  //           height: 404,
  //         },
  //       ],
  //     },
  //     title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
  //     channelTitle: "Karan Aujla",
  //     length: {
  //       simpleText: "2:41",
  //     },
  //   },
  //   {
  //     votes: 10,
  //     addedBy: "Ashish Tiwari",
  //     id: "XTp5jaRU3Ws",
  //     thumbnail: {
  //       thumbnails: [
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
  //           width: 360,
  //           height: 202,
  //         },
  //         {
  //           url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
  //           width: 720,
  //           height: 404,
  //         },
  //       ],
  //     },
  //     title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
  //     channelTitle: "Karan Aujla",
  //     length: {
  //       simpleText: "2:41",
  //     },
  //   },
  // ];

  const exampleData: StoreSongs[] = []
  return (
    <div className="flex justify-between py-10">
      <div className="border-custom flex max-h-[78vh] min-h-[20vh] min-w-[40vw] max-w-[45vw] flex-col items-center gap-y-5 rounded-2xl border px-4 py-4">
        <div className="">Currently playing :</div>
        {songQueue.length !== 0 ? (
          <div className="scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2 grid h-full w-full grid-flow-row gap-y-5 overflow-y-auto scroll-smooth">
            {songQueue.map((song, index) => (
              <div key={index} className="flex h-20 justify-between">
                <div className="flex space-x-1">
                  <Image
                    src={
                      song.thumbnail.thumbnails[1]?.url ||
                      song.thumbnail.thumbnails[0]?.url ||
                      "/music.png"
                    }
                    alt="image"
                    height={100}
                    width={120}
                    className="rounded-lg"
                  />
                  {/* video title */}
                  <div className="flex flex-col">
                    <div>{song.title.split(" ").slice(0, 5).join(" ")}</div>
                    <div className="flex items-center space-x-2 text-sm text-neutral-400">
                      <span>{song.channelTitle}</span>
                      <span className="text-xs">{song.length.simpleText}</span>
                    </div>
                    <div className="text-xs text-neutral-400">
                      Added by : {song.addedBy}
                    </div>
                  </div>
                </div>

                {/* like */}
                <div className="mr-5 flex rounded-full hover:cursor-pointer">
                  <div className="flex h-12 w-12 flex-row items-center justify-center rounded-full border border-neutral-700 p-1">
                    <span className="pt-1 text-sm">{song.votes}</span>
                    <ThumbsUp className="pb-0.5 pl-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center space-x-2 text-xl font-semibold">
            <Music2 />
            <span>Currently empty</span>
          </div>
        )}
        {/* song grid */}
      </div>
      <div className=" ">
        <span>Player</span>
        <div className="">
          <ReactPlayer
            ref={playerRef}
            url={
              songQueue.length > 0 && songQueue !== undefined
                ? `https://www.youtube.com/watch?v=${songQueue[0]?.id}`
                : ""
            }
            playing={true}
            controls={true}
            width={400}
            height={250}
          />
        </div>
      </div>
    </div>
  );
}
