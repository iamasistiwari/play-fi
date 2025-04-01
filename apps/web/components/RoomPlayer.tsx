"use client";
import { useSocket } from "@/hooks/useSocket";
import {
  FromWebSocketMessages,
  StoreSongs,
  ToWebSocketMessages,
  YoutubeVideoDetails,
} from "@repo/common/type";
import { Music2, SkipForward, ThumbsUp } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { PlayerState, useYoutube } from "react-youtube-music-player";
import CustomButton from "./ui/CustomButton";
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });
import { Circle } from "rc-progress";
import {
  IoPause,
  IoPlay,
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoStop,
  IoVolumeHigh,
  IoVolumeMedium,
  IoVolumeLow,
  IoVolumeMute,
} from "react-icons/io5";

export default function RoomPlayer({
  intialSongs,
}: {
  intialSongs: StoreSongs[];
}) {
  const { socket, roomMetadata } = useSocket();
  const [songQueue, setSongQueue] = useState<StoreSongs[]>(intialSongs);
  const playerRef = useRef<typeof ReactPlayer | null>(null);
  const [currentlyPlayingSong, setCurrentlyPlayingSong] = useState<
    YoutubeVideoDetails | undefined
  >(roomMetadata?.track.currentTrack);
  const [isChangingSong, setIsChangingSong] = useState<boolean>(false);

  const { playerDetails, actions } = useYoutube({
    id: "XTp5jaRU3Ws",
    type: "video",
  });

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as unknown as FromWebSocketMessages;
      if (data.type === "queue") {
        if (data.queue) {
          setSongQueue(data.queue);
        }
      }
      if (data.type === "track") {
        if (data.track) {
          setCurrentlyPlayingSong(data.track.currentTrack);
          setIsChangingSong(false);
        }
      }
      if (data.type === "error") {
        if (
          data.message === "Admin can only change songs" ||
          data.message === "no song in the queue"
        ) {
          setIsChangingSong(false);
        }
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const renderVolumeIcon = () => {
    if (playerDetails.volume === 0) return <IoVolumeMute />;
    if (playerDetails.volume <= 30) return <IoVolumeLow />;
    if (playerDetails.volume <= 60) return <IoVolumeMedium />;
    return <IoVolumeHigh />;
  };

  const handleVote = (index: number) => {
    if (socket && roomMetadata && songQueue[index] !== undefined) {
      setIsChangingSong(true);
      const messageToSend: ToWebSocketMessages = {
        type: "voteSong",
        roomId: roomMetadata.room_id,
        songToVoteId: songQueue[index].id,
      };
      socket.send(JSON.stringify(messageToSend));
    }
  };


  const handlePlayNext = () => {
    if (socket && roomMetadata) {
      const messageToSend: ToWebSocketMessages = {
        type: "playNext",
        roomId: roomMetadata.room_id,
      };
      socket.send(JSON.stringify(messageToSend));
    }
  };

  const exampleData: StoreSongs[] = [
    {
      votes: 10,
      voted: true,
      addedBy: "Ashish Tiwari",
      type: "video",
      id: "XTp5jaRU3Ws",
      thumbnail: {
        thumbnails: [
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
            width: 360,
            height: 202,
          },
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
            width: 720,
            height: 404,
          },
        ],
      },
      title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
      channelTitle: "Karan Aujla",
      length: {
        simpleText: "2:41",
      },
    },
    {
      votes: 10,
      voted: true,
      addedBy: "Ashish Tiwari",
      type: "video",
      id: "XTp5jaRU3Ws",
      thumbnail: {
        thumbnails: [
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
            width: 360,
            height: 202,
          },
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
            width: 720,
            height: 404,
          },
        ],
      },
      title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
      channelTitle: "Karan Aujla",
      length: {
        simpleText: "2:41",
      },
    },
    {
      votes: 10,
      voted: true,
      addedBy: "Ashish Tiwari",
      type: "video",
      id: "XTp5jaRU3Ws",
      thumbnail: {
        thumbnails: [
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
            width: 360,
            height: 202,
          },
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
            width: 720,
            height: 404,
          },
        ],
      },
      title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
      channelTitle: "Karan Aujla",
      length: {
        simpleText: "2:41",
      },
    },
    {
      votes: 10,
      voted: false,
      addedBy: "Ashish Tiwari",
      type: "video",
      id: "XTp5jaRU3Ws",
      thumbnail: {
        thumbnails: [
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
            width: 360,
            height: 202,
          },
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
            width: 720,
            height: 404,
          },
        ],
      },
      title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
      channelTitle: "Karan Aujla",
      length: {
        simpleText: "2:41",
      },
    },
    {
      votes: 10,
      voted: true,
      addedBy: "Ashish Tiwari",
      type: "video",
      id: "XTp5jaRU3Ws",
      thumbnail: {
        thumbnails: [
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
            width: 360,
            height: 202,
          },
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
            width: 720,
            height: 404,
          },
        ],
      },
      title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
      channelTitle: "Karan Aujla",
      length: {
        simpleText: "2:41",
      },
    },
    {
      votes: 10,
      voted: true,
      addedBy: "Ashish Tiwari",
      type: "video",
      id: "XTp5jaRU3Ws",
      thumbnail: {
        thumbnails: [
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
            width: 360,
            height: 202,
          },
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
            width: 720,
            height: 404,
          },
        ],
      },
      title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
      channelTitle: "Karan Aujla",
      length: {
        simpleText: "2:41",
      },
    },
    {
      votes: 10,
      voted: false,
      addedBy: "Ashish Tiwari",
      type: "video",
      id: "XTp5jaRU3Ws",
      thumbnail: {
        thumbnails: [
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEjCOgCEMoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCKpiiaYt5mtnvnHcFEhqu-DyvtSQ",
            width: 360,
            height: 202,
          },
          {
            url: "https://i.ytimg.com/vi/XTp5jaRU3Ws/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCZ8dL9zdBliipvrxmEAXIIsCB3UA",
            width: 720,
            height: 404,
          },
        ],
      },
      title: "WAVY (OFFICIAL VIDEO) KARAN AUJLA | LATEST PUNJABI SONGS 2024",
      channelTitle: "Karan Aujla",
      length: {
        simpleText: "2:41",
      },
    },
  ];

  return (
    <div className="flex justify-between py-10">
      <div className="border-custom flex max-h-[78vh] min-h-[20vh] min-w-[40vw] max-w-[45vw] flex-col items-center gap-y-5 rounded-2xl border px-4 py-4">
        <div className="">Currently playing :</div>
        {exampleData.length !== 0 ? (
          <div className="scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2 grid h-full w-full grid-flow-row gap-y-5 overflow-y-auto scroll-smooth">
            {exampleData.map((song, index) => (
              <div key={index} className="flex h-20 justify-between">
                <div className="flex space-x-1">
                  <Image
                    src={
                      song.thumbnail.thumbnails[1]?.url ||
                      song.thumbnail.thumbnails[0]?.url ||
                      "/music.png"
                    }
                    alt="image"
                    height={100}
                    width={120}
                    className="rounded-lg"
                  />
                  {/* video title */}
                  <div className="flex flex-col">
                    <div>{song.title.split(" ").slice(0, 5).join(" ")}</div>
                    <div className="flex items-center space-x-2 text-sm text-neutral-400">
                      <span>{song.channelTitle}</span>
                      <span className="text-xs">{song.length.simpleText}</span>
                    </div>
                    <div className="text-xs text-neutral-400">
                      Added by : {song.addedBy}
                    </div>
                  </div>
                </div>

                {/* like */}
                <div
                  className="mr-5 flex rounded-full hover:cursor-pointer"
                  onClick={() => {
                    handleVote(index);
                  }}
                >
                  <div className="flex h-12 w-16 flex-row items-center justify-center rounded-md border border-neutral-700 p-1">
                    <span className="pt-1 text-sm">{song.votes}</span>
                    <ThumbsUp
                      className={`ml-1 pb-0.5 transition-colors duration-150 ${song.voted ? `fill-neutral-300 text-neutral-900` : `text-neutral-100`}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center space-x-2 text-xl font-semibold">
            <Music2 />
            <span>Currently empty</span>
          </div>
        )}
        {/* song grid */}
      </div>
      <div className="w-[30vw] space-y-5">
        <div className="h-[35vh] w-full">
          {/* <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${currentlyPlayingSong?.id}`}
            playing={true}
            controls={true}
            width="100%"
            height="100%"
            onEnded={handlePlayNext}
          /> */}

          {/* now new changes */}

          <div className="relative flex justify-end">
            {/* Circle Progress Bar */}
            <div className="relative h-80 w-80">
              <Circle
                percent={20}
                strokeWidth={2}
                strokeColor={{
                  "25%": "#0369a1",
                  "50%": "#3730a3",
                  "75%": "#701a75",
                  "100%": "#831843",
                }}
                strokeLinecap="round"
                trailColor="#a8a29e"
                className="h-full w-full"
              />

              {/* Image inside Circle */}
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-full">
                <Image
                  src={`${exampleData[0]?.thumbnail.thumbnails[1]?.url}`}
                  height={280}
                  width={280}
                  alt="img"
                  className="h-full w-full animate-spin rounded-full border-purple-300 object-cover [animation-duration:30s]"
                />
              </div>

              {/* audio player */}
              <div>
                <button onClick={actions.previousVideo}>
                  <IoPlaySkipBack />
                </button>
                {playerDetails.state === PlayerState.PLAYING ? (
                  <button className="emphasised" onClick={actions.pauseVideo}>
                    <IoPause />
                  </button>
                ) : (
                  <button className="emphasised" onClick={actions.playVideo}>
                    <IoPlay />
                  </button>
                )}
                <button onClick={actions.nextVideo}>
                  <IoPlaySkipForward />
                </button>

                <div className="">
                  <div>{renderVolumeIcon()}</div>
                  <div className="flex h-32 items-center">
                    <input
                      type="range"
                      value={playerDetails.volume ?? 0}
                      min={0}
                      max={100}
                      onChange={(event) =>
                        actions.setVolume(event.target.valueAsNumber)
                      }
                      className="w-20 cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-600 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-400 [&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:border-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <CustomButton
          className="w-full"
          onClick={handlePlayNext}
          isLoading={isChangingSong}
          Icon={SkipForward}
        >
          Play Next
        </CustomButton> */}
      </div>
    </div>
  );
}
