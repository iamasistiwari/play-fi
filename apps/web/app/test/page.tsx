"use client";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import axios from "axios"
import SongSearchBar from "@/components/SongSearchBar";



export default function page() {
  // const session = useSession();

  // useEffect(() => {
  //   async function getPlaylist() {
  //     if(!session.data?.user){
  //       return
  //     }
  //     const all = await axios.get(
  //       `https://api.spotify.com/v1/search?q=risk&type=track`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${session.data.user.accessToken}`,
  //         },
  //       },
  //     );
  //     console.log("RES", all.data)
  //   }
  //   getPlaylist()

  // }, [session]);

  return <div>
    <SongSearchBar />
  </div>;
}
