"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import RoomNav from "@/components/RoomNav";

export default function page() {
  const { socket, isJoined, metadata } = useSocket();
  const params = useParams();
  const id = params.roomdId as unknown as string;
  const roomId = id.split("--")[1];
  console.log("metadata is ", metadata)

  if(!socket || !metadata) return <div>No data</div>
  
  // if (!isJoined) {
  //   return (
  //     <div className="flex h-screen items-center justify-center text-2xl">
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="24"
  //         height="24"
  //         viewBox="0 0 24 24"
  //       >
  //         <path
  //           fill="#e34646"
  //           d="m12.866 3l9.526 16.5a1 1 0 0 1-.866 1.5H2.474a1 1 0 0 1-.866-1.5L11.134 3a1 1 0 0 1 1.732 0M11 16v2h2v-2zm0-7v5h2V9z"
  //         />
  //       </svg>
  //       <span className="ml-1 mr-3 text-neutral-400">404</span>
  //       <span className="font-medium">Invalid Room</span>
  //     </div>
  //   );
  // }

  return (
    <div>
      <RoomNav socket={socket} metadata={metadata} />
      <span>Metadata{JSON.stringify(metadata)}</span>
    </div>
  );
}
