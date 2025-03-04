/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios"
import { refreshSpotifyToken } from "@/actions/refreshToken";



export default function SpotifyPlayer() {
  const { data: session } = useSession();
  const [deviceId, setDeviceId] = useState();
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);

  // useEffect(() => {
  //   if (!session?.user) return;
  //   window.onSpotifyWebPlaybackSDKReady = () => {
  //     const player = new window.Spotify.Player({
  //       name: "Play-Fi Web Player",
  //       getOAuthToken: (cb) => cb(session.user.accessToken!),
  //       volume: 0.5,
  //     });

  //     player.addListener("ready", ({ device_id }) => {
  //       console.log("Web Player Ready! Device ID:", device_id);
  //       setDeviceId(device_id);
  //     });
  //     player.connect();
  //     setPlayer(player);
  //   };
  //   const script = document.createElement("script");
  //   script.src = "https://sdk.scdn.co/spotify-player.js";
  //   script.async = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     if (player) {
  //       player.disconnect();
  //     }
  //   };
  // },[session]);

  // useEffect(() => {
  //   async function getPlaylist() {
  //     // const all = await axios.get(
  //     //   `https://api.spotify.com/v1/me/player/devices`,
  //     //   {
  //     //     headers: {
  //     //       Authorization: `Bearer BQB4KVTWy-7qj2q9ne_I3zHCYQ-0c59kiJdSPeYGbRh4E9EMLG6ifRcs0YaSKOVDxq-zyiTeBqEkGATHR-O8MqKSUzladMuS4s5BXbUCVO4X8CfeI3v3oTZIFBzMgrtAb4tTm3nDw7kcBicdq7EjVi3GTQXgayKLP8qGFtpE8IAjK73glTe34bdlPlWyBaVQXKsc_FlBQb9PX7QgDOKVX96xyNMZr90tgh-uhxmGTmz15cfKoeBrXiPAirvDSraM2Ju_nuJmxN3AnNdbYaO-KPTfbEL2AISDmz3TVWbfZV91DJwgeUyEYvbK9lk5_xFBcYQR98kdDqzvkyYYR9-uDFQGWs0jTdJZyllLWI9oeYZG6wUTH9MIpdcmG1neAw`,
  //     //     },
  //     //   },
  //     // );
  //     // console.log("Avaialable ids", all.data)
  //     // const response = await fetch(
  //     //   "https://api.spotify.com/v1/me/player/play",
  //     //   {
  //     //     method: "PUT",
  //     //     headers: {
  //     //       Authorization: `Bearer BQB4KVTWy-7qj2q9ne_I3zHCYQ-0c59kiJdSPeYGbRh4E9EMLG6ifRcs0YaSKOVDxq-zyiTeBqEkGATHR-O8MqKSUzladMuS4s5BXbUCVO4X8CfeI3v3oTZIFBzMgrtAb4tTm3nDw7kcBicdq7EjVi3GTQXgayKLP8qGFtpE8IAjK73glTe34bdlPlWyBaVQXKsc_FlBQb9PX7QgDOKVX96xyNMZr90tgh-uhxmGTmz15cfKoeBrXiPAirvDSraM2Ju_nuJmxN3AnNdbYaO-KPTfbEL2AISDmz3TVWbfZV91DJwgeUyEYvbK9lk5_xFBcYQR98kdDqzvkyYYR9-uDFQGWs0jTdJZyllLWI9oeYZG6wUTH9MIpdcmG1neAw`,
  //     //     },
  //     //     body: JSON.stringify({
  //     //       // device_id: "b22b2c9e29797ed8538811021da055a5aa9f93da",
  //     //       uris: ["spotify:track:1301WleyT98MSxVHPZCA6M"],
  //     //     }),
  //     //   },
  //     // );

  //     // console.log("THE DATA", data);
  //   }
  //   getPlaylist();
  // }, [session]);

  const playSong = async () => {
    // if (!deviceId) {
    //   console.error("Device ID is missing!");
    //   return;
    // }
    await refreshSpotifyToken(
      "BQB4KVTWy-7qj2q9ne_I3zHCYQ-0c59kiJdSPeYGbRh4E9EMLG6ifRcs0YaSKOVDxq-zyiTeBqEkGATHR-O8MqKSUzladMuS4s5BXbUCVO4X8CfeI3v3oTZIFBzMgrtAb4tTm3nDw7kcBicdq7EjVi3GTQXgayKLP8qGFtpE8IAjK73glTe34bdlPlWyBaVQXKsc_FlBQb9PX7QgDOKVX96xyNMZr90tgh-uhxmGTmz15cfKoeBrXiPAirvDSraM2Ju_nuJmxN3AnNdbYaO-KPTfbEL2AISDmz3TVWbfZV91DJwgeUyEYvbK9lk5_xFBcYQR98kdDqzvkyYYR9-uDFQGWs0jTdJZyllLWI9oeYZG6wUTH9MIpdcmG1neAw",
    );

    // await fetch(
    //   `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    //   {
    //     method: "PUT",
    //     headers: {
    //       Authorization: `Bearer ${session?.user?.accessToken}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       uris: ["spotify:track:1301WleyT98MSxVHPZCA6M"],
    //     }),
    //   },
    // );
  };

  return (
    <div className="flex flex-col items-center text-2xl font-semibold">
      <span className="text-xs">{session?.user.accessToken}</span>
      <button
        onClick={playSong}
        className="rounded-md bg-blue-500 px-4 py-2 text-white"
      >
        Play Song
      </button>
    </div>
  );
}
