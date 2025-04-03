"use client";

import CustomButton from "@/components/ui/CustomButton";
import { SkipForwardIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { PlayerState, useYoutube } from "react-youtube-music-player";

export default function RoomPlayer() {
  const [count, setCount] = useState(false);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div>
        <CustomButton
          Icon={SkipForwardIcon}
          onClick={() => setCount((c) => !c)}
          isLoading={count}
          className="h-12 w-12 rounded-full px-0"
          iconStyle=""
        ></CustomButton>
      </div>
    </div>
  );
}
