"use client"
import { useSocket } from '@/hooks/useSocket'
import { FromWebSocketMessages, RoomMetadata } from '@repo/common/type'
import React, { useEffect, useState } from 'react'




export default function RoomNav({socket, metadata}: {socket: WebSocket, metadata: RoomMetadata}) {
    const [roomMetaData, setRoomMetadata] = useState<RoomMetadata>(metadata)

    useEffect(() => {
        if(socket){
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data) as unknown as FromWebSocketMessages;
                if(data.type === "metadata"){
                    if(data.metadata) setRoomMetadata(data.metadata);
                }
            }
        }
    },[socket])

  return (
    <div className='flex justify-between items-center px-32 h-16 border-neutral-800 border-b'>
        <div>
            Meta
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
