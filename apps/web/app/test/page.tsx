"use client";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Line, Circle } from "rc-progress";
import { useYoutube } from "react-youtube-music-player";

export default function page() {
  const [currentPlayedSongs, setCurrentState] = useState<number | undefined>();
  const playerRef = useRef<ReactPlayer | null>(null)
  

  useEffect(() => {
    const time = playerRef.current?.getCurrentTime()
    console.log("current time", time)

  }, [playerRef.current?.getCurrentTime()])


  return (
    <div>
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=C3abvkg-qrY`}
        ref={playerRef}
        controls
        width={200}
        height={200}
        
        onProgress={(playedSongs) => {
          console.log(playedSongs);
          setCurrentState(playedSongs.played * 100);
        }}
      />
    </div>
  );
}

// import { useState } from "react";
// import { PlayerState, useYoutube } from "react-youtube-music-player";
// import {
//   IoPause,
//   IoPlay,
//   IoPlaySkipBack,
//   IoPlaySkipForward,
//   IoStop,
//   IoVolumeHigh,
//   IoVolumeMedium,
//   IoVolumeLow,
//   IoVolumeMute,
// } from "react-icons/io5";

// export default function App() {
//   // 🎵 Store the song ID in state
//   const [videoId, setVideoId] = useState("XTp5jaRU3Ws"); // Default Song ID

//   const { playerDetails, actions } = useYoutube({
//     id: videoId, // Use the state as video ID
//     type: "video",
//   });

//   // 🎵 List of song IDs (Replace with your own)
//   const songList = [
//     "LbqzhXWl33U", // Song 1
//     "3JZ_D3ELwOQ", // Song 2
//     "dQw4w9WgXcQ", // Song 3
//   ];

//   let currentSongIndex = songList.indexOf(videoId);

//   // 🔥 Function to change the song
//   const changeSong = () => {
//     const nextIndex = (currentSongIndex + 1) % songList.length; // Cycle through songs
//     setVideoId(songList[nextIndex]!); // Update state
//   };

//   const renderVolumeIcon = () => {
//     if (playerDetails.volume === 0) return <IoVolumeMute />;
//     if (playerDetails.volume <= 30) return <IoVolumeLow />;
//     if (playerDetails.volume <= 60) return <IoVolumeMedium />;
//     return <IoVolumeHigh />;
//   };

//   return (
//     <div className="App">
//       <h1>react-youtube-music-player</h1>
//       <div className="video-title">{playerDetails.title}</div>
//       <div className="player-controls">
//         <button onClick={actions.previousVideo}>
//           <IoPlaySkipBack />
//         </button>
//         {playerDetails.state === PlayerState.PLAYING ? (
//           <button className="emphasised" onClick={actions.pauseVideo}>
//             <IoPause />
//           </button>
//         ) : (
//           <button className="emphasised" onClick={actions.playVideo}>
//             <IoPlay />
//           </button>
//         )}
//         <button onClick={actions.stopVideo}>
//           <IoStop />
//         </button>
//         <button onClick={actions.nextVideo}>
//           <IoPlaySkipForward />
//         </button>

//         {/* 🔥 Button to Change Song */}
//         <button onClick={changeSong}>Change Song</button>

//         <div className="">
//           {renderVolumeIcon()}
//           <input
//             type="range"
//             value={playerDetails.volume ?? 0}
//             min={0}
//             max={100}
//             onChange={(event) => actions.setVolume(event.target.valueAsNumber)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
