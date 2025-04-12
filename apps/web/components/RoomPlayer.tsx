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
    console.log("RE RENDER",songProgresMeta)
  })

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
    <div className="flex justify-between py-10">
      <div className="border-custom flex max-h-[78vh] min-h-[20vh] min-w-[40vw] max-w-[45vw] flex-col items-center gap-y-5 rounded-2xl border px-4 py-4">
        <div className="">Currently playing :</div>
        {songQueue.length !== 0 ? (
          <div className="scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2 grid h-full w-full grid-flow-row gap-y-5 overflow-y-auto scroll-smooth">
            {songQueue.map((song, index) => (
              <div key={song.id} className="flex h-20 justify-between">
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
      </div>
      <div className="w-[30vw] space-y-5">
        <div className="flex h-[35vh] w-full justify-end">
          <div className="hidden">
            <ReactPlayerV
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

          <div className="relative flex justify-end">
            {/* Circle Progress Bar */}
            <div className="relative h-80 w-80">
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
                className="h-full w-full"
              />

              {/* Image inside Circle */}
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-full">
                <Image
                  src={`${currentlyPlayingSong?.thumbnail.thumbnails[1]?.url || currentlyPlayingSong?.thumbnail.thumbnails[0]?.url || "/music.png"}`}
                  height={280}
                  width={280}
                  alt="img"
                  className={`h-full w-full select-none rounded-full border-purple-300 object-cover ${playingSong ? "animate-spin [animation-duration:30s]" : ""}`}
                />
              </div>

              <div className="my-4 flex select-none flex-col px-4 pl-6 text-sm">
                <span className="text-neutral-200">
                  {currentlyPlayingSong?.title}
                </span>
                <div className="mt-4 flex items-center justify-center space-x-4 rounded-xl border border-neutral-500">
                  <span className="font-semibold">
                    <CurrentDuration
                      playerRef={playerRef}
                      role={roomMetadata?.role}
                      songMetaData={songProgresMeta}
                    />
                  </span>
                  <div className="flex items-center justify-center">
                    <div className="select-none">{currentVolume * 100}</div>
                    {renderVolumeIcon()}
                  </div>
                </div>
              </div>

              <div
                className={`${roomMetadata?.role === "admin" ? "flex items-center justify-center space-x-5" : "hidden"}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CustomButton
                    isLoading={false}
                    Icon={IoPlaySkipBack}
                    className="h-12 w-12 rounded-full border border-neutral-700 bg-transparent px-0 active:scale-100"
                    onClick={() => {
                      handleSeek("seek0");
                    }}
                    iconStyle="w-full h-full mr-0"
                    loaderStyle="mr-0"
                  />

                  <CustomButton
                    isLoading={false}
                    Icon={ChevronLeft}
                    className="h-10 w-10 rounded-full border border-neutral-700 bg-transparent p-2 px-0 hover:bg-neutral-800 active:scale-100"
                    onClick={() => {
                      handleSeek("desc");
                    }}
                    iconStyle="w-full h-full"
                    loaderStyle="mr-0"
                  />

                  {playingSong === true ? (
                    <CustomButton
                      isLoading={false}
                      Icon={IoPause}
                      className="h-12 w-12 rounded-full bg-green-700 px-0"
                      onClick={() => {
                        setPlayingSong(false);
                      }}
                      iconStyle="w-full h-full mr-0"
                      loaderStyle="mr-0"
                    />
                  ) : (
                    <CustomButton
                      isLoading={!isPlayerReady}
                      Icon={IoPlay}
                      className="h-12 w-12 rounded-full bg-red-800 px-0"
                      onClick={() => {
                        setPlayingSong(true);
                      }}
                      iconStyle="mr-0 w-full h-full "
                      loaderStyle="mr-0"
                    />
                  )}
                  <CustomButton
                    isLoading={false}
                    Icon={ChevronRight}
                    className="h-10 w-10 rounded-full border border-neutral-700 bg-transparent p-2 px-0 hover:bg-neutral-800 active:scale-100"
                    onClick={() => {
                      handleSeek("inc");
                    }}
                    iconStyle="w-full h-full"
                    loaderStyle="mr-0"
                  />
                  <CustomButton
                    isLoading={isChangingSong}
                    Icon={IoPlaySkipForward}
                    className="h-12 w-12 rounded-full border border-neutral-700 bg-transparent px-0"
                    onClick={handlePlayNext}
                    iconStyle="mr-0 w-full h-full"
                    loaderStyle=" mr-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
