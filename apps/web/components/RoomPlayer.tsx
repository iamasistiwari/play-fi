"use client"
import React, { useEffect, useState } from 'react'

export default function RoomPlayer({socket}: {socket: WebSocket}) {
    const [songQueue, setsongQueue] = useState()
    
    useEffect(() => {
        if(!socket) return

        const handleMessage = () => {
          
        }

        socket.addEventListener("message", handleMessage)

        return () => {socket.removeEventListener("message", handleMessage)}
    }, [socket])
  

  return (
    <div className='flex justify-between py-10'>
      <div className='border h-[70vh] w-[35vw] justify-center flex'>
        <span>Currently playing :</span>

      </div>
      <div>
        <span>Player</span>
      </div>
    </div>
  )
}
