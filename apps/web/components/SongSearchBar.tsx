"use client";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Input from "./ui/Input";
import {
  FromWebSocketMessages,
  ToWebSocketMessages,
  YoutubeSearchDetails,
} from "@repo/common/type";
import { Plus, Search } from "lucide-react";
import debounce from "debounce";
import { useSocket } from "@/hooks/useSocket";
import Image from "next/image";
import CustomButton from "./ui/CustomButton";

function SongSearchBar({ socket }: { socket: WebSocket }) {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [songs, setSongs] = useState<YoutubeSearchDetails>();
  const [isInputFocus, setIsInputFocus] = useState<boolean>(false);
  const { loading, roomMetadata } = useSocket();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setIsInputFocus(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as FromWebSocketMessages;
      if (data.type === "songs") {
        if (data.message) {
          const parsedSongs = JSON.parse(data.message) as YoutubeSearchDetails;
          setSongs(parsedSongs);
        }
      }
    };
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const handleSearch = useCallback(
    debounce((search: string) => {
      if (search.length < 2 || !socket || loading) return;
      const sendMsg: ToWebSocketMessages = {
        type: "searchSongs",
        roomId: roomMetadata?.room_id!,
        song: search,
      };
      socket.send(JSON.stringify(sendMsg));
    }, 600),
    [],
  );

  const handleAdd = (index: number) => {
    try {
      setIsAdding(true);
      const songToAdd = songs?.items[index];
      if (songToAdd && socket) {
        const sendMsg: ToWebSocketMessages = {
          type: "addSong",
          roomId: roomMetadata?.room_id!,
          songToAdd,
        };
        socket.send(JSON.stringify(sendMsg));
      }
    } catch (error) {
      console.log("error");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative flex w-full flex-col">
      <div className="relative flex w-full">
        <Input
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          onFocus={() => setIsInputFocus(true)}
          placeholder="What do you want to play?"
          className="w-full rounded-3xl bg-neutral-900 py-2 pl-12 text-sm text-neutral-300 transition-colors duration-200 focus:outline-neutral-300"
        />
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-300" />
      </div>

      {isInputFocus && songs && (
        <div
          ref={dropDownRef}
          className="absolute top-full z-30 mt-2 flex max-h-[60vh] w-full flex-col space-y-2 overflow-y-auto rounded-md bg-neutral-900/95 px-3 py-2 shadow-lg backdrop-blur-sm"
        >
          {songs.items?.length > 0 ? (
            songs?.items.slice(0, 5).map((value, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-neutral-800 py-2 last:border-0"
              >
                <div className="flex items-center">
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <Image
                      alt="thumbnail"
                      className="rounded-md object-cover"
                      src={
                        value.thumbnail?.thumbnails[0]?.url?.startsWith("//")
                          ? `https:${value.thumbnail?.thumbnails[0]?.url}`
                          : value.thumbnail?.thumbnails[0]?.url ||
                            (value.thumbnail?.thumbnails[1]?.url?.startsWith(
                              "//",
                            )
                              ? `https:${value.thumbnail?.thumbnails[1]?.url}`
                              : value.thumbnail?.thumbnails[1]?.url) ||
                            "/music.png"
                      }
                      fill
                    />
                  </div>
                  <div className="ml-2 flex max-w-[40vw] flex-col xl:max-w-[200px]">
                    <span className="truncate text-sm">{value.title}</span>
                    <span className="truncate text-xs text-neutral-300">
                      {value.channelTitle}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="hidden text-xs text-neutral-300 sm:inline">
                    {value?.length?.simpleText}
                  </span>

                  <CustomButton
                    Icon={Plus}
                    className="h-8 w-16 rounded-lg px-2 text-xs sm:w-auto sm:px-3"
                    isLoading={isAdding}
                    onClick={() => {
                      handleAdd(index);
                    }}
                    iconStyle="mr-1 sm:mr-2 h-4 w-4"
                    loaderStyle="mr-1 sm:mr-2"
                  >
                    Add
                  </CustomButton>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-neutral-400">
              No songs found. Try a different search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(SongSearchBar, (prev, next) => prev.socket === next.socket);
