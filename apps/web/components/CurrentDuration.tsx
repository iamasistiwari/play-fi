"use client";
import { StoreSongs } from "@repo/common/type";
import React, { memo, RefObject, useEffect, useState } from "react";
import ReactPlayer from "react-player";

export interface SONG_METADATA {
  currentTrack: StoreSongs | undefined;
  isPlaying: boolean;
  currentSongProgress: number | undefined;
  currentSongDuration: number | undefined;
  currentSongProgressINsecond: number | undefined;
}

export default function CurrentDuration({
  playerRef,
  role,
  songMetaData,
}: {
  playerRef: RefObject<ReactPlayer | null>;
  role: "user" | "admin" | undefined;
  songMetaData: SONG_METADATA | undefined; 
}) {
  const [songDuration, setSongDuration] = useState<number | undefined>(songMetaData?.currentSongDuration);
  const [durationPlayed, setDurationPlayed] = useState<number | undefined>(songMetaData?.currentSongProgress);

  useEffect(() => {
    
    if (playerRef.current && role === "admin") {
      setSongDuration(playerRef.current.getDuration());
      setDurationPlayed(playerRef.current.getCurrentTime());
    }
    if (
      role === "user" &&
      songMetaData &&
      songMetaData.currentSongDuration &&
      songMetaData.currentSongProgressINsecond
    ) {
      setSongDuration(songMetaData.currentSongDuration);
      setDurationPlayed(songMetaData.currentSongProgressINsecond);
    }
  }, [playerRef.current?.getCurrentTime(), songMetaData]);

  const getFull = () => {
    if(songDuration && durationPlayed){
      const totalSM = new Intl.NumberFormat("en-US", {
        minimumIntegerDigits: 1,
      }).format(Math.floor(songDuration / 60));
      const totalSS = new Intl.NumberFormat("en-US", {
        minimumIntegerDigits: 2,
      }).format(Math.floor(songDuration % 60));
  
      const minutes = new Intl.NumberFormat("en-US", {
        minimumIntegerDigits: 1,
      }).format(Math.floor(durationPlayed / 60));
  
      const seconds = new Intl.NumberFormat("en-US", {
        minimumIntegerDigits: 2,
      }).format(Math.floor(durationPlayed % 60));
      return `${minutes}:${seconds} / ${totalSM}:${totalSS}`;
    }
    return `0:00 / 0:00`;
  };
  return <>{getFull()}</>;
}
