"use client";
import { useSocket } from "@/hooks/useSocket";
import {
  FromWebSocketMessages,
  StoreSongs,
  ToWebSocketMessages,
  YoutubeVideoDetails,
} from "@repo/common/type";
import { ChevronLeft, ChevronRight, Music2, ThumbsUp } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Circle } from "rc-progress";
import { useEffect, useRef, useState } from "react";
import {
  IoPause,
  IoPlay,
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoVolumeHigh,
  IoVolumeLow,
  IoVolumeMedium,
  IoVolumeMute,
} from "react-icons/io5";
import CustomButton from "./ui/CustomButton";
import ReactPlayer from "react-player";
import CurrentDuration, { SONG_METADATA } from "./CurrentDuration";
import toast from "react-hot-toast";
const ReactPlayerV = dynamic(() => import("react-player/lazy"), { ssr: false });

export default function RoomPlayer({
  intialSongs,
}: {
  intialSongs: StoreSongs[];
}) {
  const { socket, roomMetadata } = useSocket();
  const playerRef = useRef<ReactPlayer | null>(null);
  const [songQueue, setSongQueue] = useState<StoreSongs[]>(intialSongs);
  const [isChangingSong, setIsChangingSong] = useState<boolean>(false);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [playingSong, setPlayingSong] = useState<boolean>(false);
  const [currentVolume, setCurrentVolume] = useState<number>(0.6);
  const [songProgresMeta, setSongProgressMeta] = useState<
    SONG_METADATA | undefined
  >(roomMetadata?.track);
  const [songProgress, setSongProgress] = useState(
    roomMetadata?.track.currentSongProgress || 0,
  );
  const [currentlyPlayingSong, setCurrentlyPlayingSong] = useState<
    YoutubeVideoDetails | undefined
  >(roomMetadata?.track.currentTrack);

  useEffect(() => {
    console.log("RE RENDER", songProgresMeta);
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
          if (data.track.currentSongProgress && roomMetadata?.role === "user") {
            setSongProgress(data.track.currentSongProgress);
            setPlayingSong(data.track.isPlaying);
            setSongProgressMeta(data.track);
          }
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
    if (currentVolume === 0)
      return (
        <IoVolumeMute
          className="h-7 w-7 hover:cursor-pointer active:scale-95"
          onClick={() => setCurrentVolume(0.3)}
        />
      );
    if (currentVolume <= 0.3)
      return (
        <IoVolumeLow
          className="h-7 w-7 hover:cursor-pointer active:scale-95"
          onClick={() => setCurrentVolume(0.6)}
        />
      );
    if (currentVolume <= 0.6)
      return (
        <IoVolumeMedium
          className="h-7 w-7 hover:cursor-pointer active:scale-95"
          onClick={() => setCurrentVolume(1)}
        />
      );
    return (
      <IoVolumeHigh
        className="h-7 w-7 hover:cursor-pointer active:scale-95"
        onClick={() => setCurrentVolume(0)}
      />
    );
  };

  const handleVote = (index: number) => {
    if (socket && roomMetadata && songQueue[index] !== undefined) {
      const messageToSend: ToWebSocketMessages = {
        type: "voteSong",
        roomId: roomMetadata.room_id,
        songToVoteId: songQueue[index].id,
      };
      socket.send(JSON.stringify(messageToSend));
    }
  };

  useEffect(() => {
    if (roomMetadata && roomMetadata.role === "admin" && socket) {
      const messageToSend: ToWebSocketMessages = {
        type: "songProgress",
        roomId: roomMetadata.room_id,
        track: {
          isPlaying: playingSong,
          currentSongProgress: songProgress,
          currentSongDuration: playerRef.current?.getDuration(),
          currentSongProgressINsecond: playerRef.current?.getCurrentTime(),
        },
      };
      socket.send(JSON.stringify(messageToSend));
    }
  }, [songProgress, playingSong]);

  const handlePlayNext = () => {
    setIsChangingSong(true);
    if (socket && roomMetadata && roomMetadata.role === "admin") {
      const messageToSend: ToWebSocketMessages = {
        type: "playNext",
        roomId: roomMetadata.room_id,
      };
      socket.send(JSON.stringify(messageToSend));
    }
  };

  const handleSeek = (data: string) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      if (data === "inc") {
        const timetoSet = currentTime + 5;
        playerRef.current.seekTo(timetoSet, "seconds");
      }
      if (data === "desc") {
        const timetoSet = currentTime - 5;
        playerRef.current.seekTo(timetoSet, "seconds");
      }
      if (data === "seek0") {
        playerRef.current.seekTo(0, "seconds");
      }
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
    <div className="w-full py-6">
      <div className="flex flex-col w-full  lg:flex-row lg:items-start  lg:justify-between lg:space-x-6">
        <div className="w-full lg:w-1/2 xl:w-3/5">

          {/* Mobile Song Queue */}
          <div className="mb-6 w-full lg:hidden">
            <div className="px-4 pb-2 text-center font-medium">
              Currently playing:
            </div>
            {songQueue.length !== 0 ? (
              <div className="max-h-48 overflow-y-auto px-2">
                {songQueue.map((song, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-neutral-800 py-2"
                  >
                    <div className="flex space-x-2">
                      <Image
                        src={
                          song.thumbnail.thumbnails[1]?.url ||
                          song.thumbnail.thumbnails[0]?.url ||
                          "/music.png"
                        }
                        alt="image"
                        height={50}
                        width={50}
                        className="rounded-md"
                      />
                      <div className="flex max-w-[150px] flex-col">
                        <div className="truncate text-sm">{song.title}</div>
                        <div className="text-xs text-neutral-400">
                          {song.channelTitle}
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex rounded-full hover:cursor-pointer"
                      onClick={() => handleVote(index)}
                    >
                      <div className="flex h-8 w-12 items-center justify-center rounded-md border border-neutral-700">
                        <span className="text-xs">{song.votes}</span>
                        <ThumbsUp
                          size={14}
                          className={`ml-1 transition-colors duration-150 ${song.voted ? "fill-neutral-300 text-neutral-900" : "text-neutral-100"}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-4 text-sm">
                <Music2 size={16} className="mr-2" />
                <span>Queue empty</span>
              </div>
            )}
          </div>

          {/* Desktop Queue */}
          <div className="border-custom hidden max-h-[78vh] min-h-[50vh] max-w-[45vw] overflow-hidden rounded-2xl border px-4 py-4 lg:block">
            <div className="mb-4 font-medium">Queue:</div>
            {songQueue.length !== 0 ? (
              <div className="scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2 grid h-full max-h-[70vh] w-full grid-flow-row gap-y-4 overflow-y-auto scroll-smooth">
                {songQueue.map((song, index) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex space-x-3">
                      <Image
                        src={
                          song.thumbnail.thumbnails[1]?.url ||
                          song.thumbnail.thumbnails[0]?.url ||
                          "/music.png"
                        }
                        alt="image"
                        height={120}
                        width={120}
                        className="rounded-lg"
                      />
                      <div className="flex flex-col">
                        <div className="font-medium">
                          {song.title.split(" ").slice(0, 5).join(" ")}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-neutral-400">
                          <span>{song.channelTitle}</span>
                          <span className="text-xs">
                            {song.length.simpleText}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400">
                          Added by: {song.addedBy}
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex rounded-full hover:cursor-pointer"
                      onClick={() => handleVote(index)}
                    >
                      <div className="flex h-10 w-14 items-center justify-center rounded-md border border-neutral-700">
                        <span className="text-sm">{song.votes}</span>
                        <ThumbsUp
                          className={`ml-1 transition-colors duration-150 ${song.voted ? "fill-neutral-300 text-neutral-900" : "text-neutral-100"}`}
                          size={16}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full w-full  items-center justify-center space-x-2 text-lg font-medium">
                <Music2 />
                <span>Currently empty</span>
              </div>
            )}
          </div>
        </div>
        <div className="mb-8  flex w-full flex-col items-center lg:mb-0 lg:w-1/2  xl:w-2/5">
          <div className="hidden">
            <ReactPlayer
              ref={playerRef}
              url={`https://www.youtube.com/watch?v=${currentlyPlayingSong?.id}`}
              playing={roomMetadata?.role === "user" ? false : playingSong}
              controls={true}
              width="100%"
              height="100%"
              onEnded={handlePlayNext}
              volume={currentVolume}
              onProgress={(details) => {
                if (roomMetadata?.role === "admin") {
                  setSongProgress(details.played * 100);
                }
              }}
              onReady={() => setIsPlayerReady(true)}
            />
          </div>

          <div className="flex w-full flex-col items-center lg:items-center">
            <div className="relative mb-4">
              <Circle
                percent={songProgress}
                strokeWidth={2}
                strokeColor={{
                  "25%": "#0369a1",
                  "50%": "#3730a3",
                  "75%": "#701a75",
                  "100%": "#831843",
                }}
                strokeLinecap="round"
                trailColor="#a8a29e"
                className="h-64 w-64 md:h-72 md:w-72"
              />

              <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-full md:h-64 md:w-64">
                <Image
                  src={`${currentlyPlayingSong?.thumbnail.thumbnails[1]?.url || currentlyPlayingSong?.thumbnail.thumbnails[0]?.url || "/music.png"}`}
                  height={280}
                  width={280}
                  alt="album art"
                  className={`h-full w-full select-none rounded-full object-cover ${playingSong ? "animate-spin [animation-duration:30s]" : ""}`}
                />
              </div>
            </div>

            <div className="mb-4 w-full px-4 text-center lg:px-0 lg:text-center">
              <h3 className="truncate text-sm font-medium md:text-base">
                {currentlyPlayingSong?.title || "No song playing"}
              </h3>
              <p className="truncate text-xs text-neutral-400">
                {currentlyPlayingSong?.channelTitle || ""}
              </p>
            </div>
            {/* sound bar length bar */}
            <div className="mb-4 flex w-full max-w-xs items-center justify-between rounded-lg bg-neutral-900 p-3 lg:max-w-sm">
              <span className="text-sm font-medium">
                <CurrentDuration
                  playerRef={playerRef}
                  role={roomMetadata?.role}
                  songMetaData={songProgresMeta}
                />
              </span>
              <div className="flex items-center">
                <div className="mr-1 text-sm select-none">
                  {Math.round(currentVolume * 100)}
                </div>
                {renderVolumeIcon()}
              </div>
            </div>

            {roomMetadata?.role === "admin" && (
              <div className="flex w-full items-center  justify-center space-x-3 ">

                <CustomButton
                  isLoading={false}
                  Icon={IoPlaySkipBack}
                  className="h-10 w-10 rounded-full border border-neutral-700 bg-transparent p-0"
                  onClick={() => handleSeek("seek0")}
                  iconStyle="w-5 h-5"
                  loaderStyle="mr-0"
                />

                <CustomButton
                  isLoading={false}
                  Icon={ChevronLeft}
                  className="h-8 w-8 rounded-full border border-neutral-700 bg-transparent p-0"
                  onClick={() => handleSeek("desc")}
                  iconStyle="w-4 h-4"
                  loaderStyle="mr-0"
                />

                {playingSong ? (
                  <CustomButton
                    isLoading={false}
                    Icon={IoPause}
                    className="h-12 w-12 rounded-full bg-green-700 p-0"
                    onClick={() => setPlayingSong(false)}
                    iconStyle="w-6 h-6"
                    loaderStyle="mr-0"
                  />
                ) : (
                  <CustomButton
                    isLoading={!isPlayerReady}
                    Icon={IoPlay}
                    className="h-12 w-12 rounded-full bg-red-800 p-0"
                    onClick={() => setPlayingSong(true)}
                    iconStyle="w-6 h-6"
                    loaderStyle="mr-0"
                  />
                )}

                <CustomButton
                  isLoading={false}
                  Icon={ChevronRight}
                  className="h-8 w-8 rounded-full border border-neutral-700 bg-transparent p-0"
                  onClick={() => handleSeek("inc")}
                  iconStyle="w-4 h-4"
                  loaderStyle="mr-0"
                />

                <CustomButton
                  isLoading={isChangingSong}
                  Icon={IoPlaySkipForward}
                  className="h-10 w-10 rounded-full border border-neutral-700 bg-transparent p-0"
                  onClick={handlePlayNext}
                  iconStyle="w-5 h-5"
                  loaderStyle="mr-0"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
