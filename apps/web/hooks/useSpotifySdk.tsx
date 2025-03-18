// "use client"
// import React, { useEffect, useState } from "react";


// interface SpotifyContextType {
//     deviceId: string,
//   loading: boolean;
//   getDeviceId: (token: string) => void;
// }

// export default function useSpotifySdk() {
//     const [deviceId, setDeviceId] = useState("")
//     const SDKJoined = 

//   useEffect(() => {
//     window.onSpotifyWebPlaybackSDKReady = () => {
//       const player = new window.Spotify.Player({
//         name: "Play-Fi Web Player",
//         getOAuthToken: (cb) => cb(session.user.accessToken!),
//         volume: 0.5,
//       });

//       player.addListener("ready", ({ device_id }) => {
//         console.log("Web Player Ready! Device ID:", device_id);
//         setDeviceId(device_id);
//       });
//       player.connect();
//       setPlayer(player);
//     };
//     const script = document.createElement("script");
//     script.src = "https://sdk.scdn.co/spotify-player.js";
//     script.async = true;
//     document.body.appendChild(script);

//     return () => {
//       if (player) {
//         player.disconnect();
//       }
//     };
//   }, [session]);
//   return <div>useSpotifySdk</div>;
// }
