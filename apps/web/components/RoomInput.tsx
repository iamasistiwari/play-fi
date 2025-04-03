"use client";
import React, { useEffect, useRef, useState } from "react";
import Input from "./ui/Input";
import { Plus } from "lucide-react";
import CustomButton from "./ui/CustomButton";
import { AlertDialog } from "radix-ui";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useSocket } from "@/hooks/useSocket";
import {
  FromWebSocketMessages,
  ValidateCreateRoomSchema,
  ValidateJoinRoomSchema,
} from "@repo/common/type";
import { useRouter } from "next/navigation";

export default function RoomInput() {
  const session = useSession();
  const [generatedRoomCode, setgeneratedRoomCode] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [roomPassword, setRoomPassword] = useState<string>("");
  const [joinRoomId, setjoinRoomId] = useState<string>("");
  const [joinedRoomPassword, setJoinRoomPassword] = useState<string>("");
  const [creating, setCreating] = useState<boolean>(false);
  const [joining, setJoining] = useState<boolean>(false);
  const toastId = useRef<string | null>(null);
  const router = useRouter();

  // for spotify
  // const [accessToken, setAccessToken] = useState<string>("");
  // const [infoMouseEnter, setInfoMouseEnter] = useState<boolean>(false);

  const { socket, loading, SetRoomMetadata } = useSocket();

  const generateCode = (length: number = 6): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }
    return code;
  };

  useEffect(() => {
    if (!socket || loading) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as unknown as FromWebSocketMessages;

      if (data.type === "joined" && data.metadata) {
        toast.success("Redirecting...", { id: toastId.current! });
        SetRoomMetadata(data.metadata);
        const pathTitle = data.metadata.room_title.replaceAll(" ", "");
        router.push(`/room/${pathTitle}--${data.metadata.room_id}`);
      }
      if (data.type === "error" && data.message) {
        toast.error(data.message, { id: toastId.current! });
        return;
      }
    };

    socket.addEventListener("message", handleMessage);
  }, [socket]);

  const createJoinRoom = async () => {
    try {
      setCreating(true);
      toastId.current = toast.loading("Creating...");
      const zodChecking = ValidateCreateRoomSchema.safeParse({
        type: "create_room",
        roomId: generatedRoomCode,
        roomTitle: title,
        roomPassword,
      });
      if (zodChecking.error) {
        toast.error("Invalid values", { duration: 800, id: toastId.current });
        return;
      }

      if (socket && !loading) {
        const roomMsg = {
          type: "create_room",
          roomId: generatedRoomCode,
          roomTitle: title,
          roomPassword,
        };
        return socket.send(JSON.stringify(roomMsg));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCreating(false);
    }
  };

  const getJoined = () => {
    try {
      setJoining(true);
      toastId.current = toast.loading("Joining...");
      const zodChecking = ValidateJoinRoomSchema.safeParse({
        type: "join_room",
        roomId: joinRoomId,
        roomPassword: joinedRoomPassword,
      });
      if (zodChecking.error) {
        console.log("ERROR ZOD", zodChecking.error);
        toast.error("Invalid values", { duration: 800, id: toastId.current });
        return;
      }
      if (socket && !loading) {
        const roomMsg = {
          type: "join_room",
          roomId: joinRoomId,
          roomPassword: joinedRoomPassword,
        };
        return socket.send(JSON.stringify(roomMsg));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="mt-12 flex flex-row justify-between space-x-20 px-32">
      <div className="ml-32 flex max-w-[450px] flex-col space-y-10">
        <div className="flex flex-col space-y-1">
          <label htmlFor="createRoom">Create room</label>
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <CustomButton
                id="createRoom"
                className="max-w-full tracking-widest"
                isLoading={false}
                Icon={Plus}
                onClick={async () => {
                  const code = generateCode();
                  setgeneratedRoomCode(code);
                }}
                iconStyle="mr-2"
                loaderStyle="mr-2"
              >
                Create room
              </CustomButton>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-transparent backdrop-blur-sm" />
              <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-100 p-[25px] shadow-[var(--shadow-6)] focus:outline-none">
                <AlertDialog.Title className="m-0 text-[17px] font-medium text-mauve12">
                  Share code to friends
                </AlertDialog.Title>
                <AlertDialog.Description className="mb-5 mt-[15px] flex flex-col">
                  <span className="text-center font-mono text-2xl font-semibold leading-10 tracking-widest text-blue-700">
                    {generatedRoomCode}
                  </span>
                  <label className="mt-2 pl-0.5 text-sm text-black">
                    Enter room title
                  </label>
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setTitle(e.target.value);
                    }}
                    placeholder="enter room title"
                    className="mt-2 w-full tracking-tight text-neutral-800"
                    type="text"
                  />
                  {title.length > 0 && title.length < 10 ? (
                    <span className="mt-2 text-sm text-red-400">
                      Title must be at least 10 characters
                    </span>
                  ) : null}
                  <label className="mt-2 pl-0.5 text-sm text-black">
                    Enter room password
                  </label>
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setRoomPassword(e.target.value);
                    }}
                    placeholder="enter room password"
                    className="mt-2 w-full tracking-tight text-neutral-800"
                    type="password"
                  />
                  {roomPassword.length > 0 && roomPassword.length < 8 ? (
                    <span className="mt-2 text-sm text-red-400">
                      Password must be at least 8 characters
                    </span>
                  ) : null}

                  {/* spotify login */}
                  {/* <>
                    <span className="mt-2">
                      <label className="mt-2 flex items-center space-x-2 pl-0.5 text-sm text-black">
                        <span>Enter spotify token</span>
                        <Info
                          className="h-4 w-4 hover:cursor-pointer"
                          onMouseEnter={() => setInfoMouseEnter(true)}
                          onMouseLeave={() => setInfoMouseEnter(false)}
                        />
                        {infoMouseEnter ? (
                          <span className="rounded-lg bg-neutral-700 p-1 text-xs text-white">
                            token guide
                          </span>
                        ) : null}
                      </label>
                      <Input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setAccessToken(e.target.value);
                        }}
                        placeholder="enter access token"
                        className="mt-2 w-full text-xs tracking-tight text-neutral-800"
                        type="text"
                      />
                      {accessToken.length > 0 && accessToken.length <= 270 ? (
                        <span className="mt-2 text-sm text-red-400">
                          Invalid accessToken
                        </span>
                      ) : null}
                    </span>
                    <label className="my-1 flex justify-center text-black">
                      OR
                    </label>
                    <CustomButton
                      onClick={async () => {
                        // await spotifyLogin();
                      }}
                      className="bg-black text-white transition-opacity duration-200 hover:opacity-85"
                      iconStyle="text-green-400"
                      isLoading={false}
                      Icon={FaSpotify}
                    >
                      Login with spotify
                    </CustomButton>
                  </> */}
                </AlertDialog.Description>
                <div className="flex justify-end gap-[25px]">
                  <AlertDialog.Cancel asChild>
                    <button className="inline-flex h-[35px] select-none items-center justify-center rounded bg-mauve4 px-[15px] font-medium leading-none text-mauve11 outline-none outline-offset-1 hover:bg-mauve5 focus-visible:outline-2 focus-visible:outline-mauve7">
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action
                    asChild
                    onClick={(e) => e.preventDefault()}
                  >
                    <CustomButton
                      Icon={null}
                      isLoading={creating}
                      className="focus-visible:outline-red inline-flex h-[35px] items-center justify-center rounded bg-green-200 px-[15px] font-medium leading-none text-green-700 outline-none outline-offset-1 hover:bg-green-300 focus-visible:outline-2"
                      onClick={async () => {
                        await createJoinRoom();
                      }}
                      iconStyle="mr-2"
                      loaderStyle="mr-2"
                    >
                      Create
                    </CustomButton>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
        <div className="flex flex-col">
          <label htmlFor="joinRoom">Join room</label>
          <div className="mt-2 flex flex-col space-y-2">
            <Input
              id="joinRoom"
              placeholder="enter room id"
              className="tracking-widest"
              onChange={(e) => {
                setjoinRoomId(e.target.value.toUpperCase());
              }}
              value={joinRoomId}
            />
            <Input
              id="roomPassword"
              placeholder="enter room password"
              className="tracking-widest"
              type="password"
              onChange={(e) => {
                setJoinRoomPassword(e.target.value);
              }}
            />
            <CustomButton
              variant={"ghost"}
              className="w-full bg-blue-700 tracking-widest"
              isLoading={joining}
              Icon={null}
              onClick={getJoined}
              iconStyle="mr-2"
              loaderStyle="mr-2"
            >
              Join
            </CustomButton>
          </div>
        </div>
      </div>
      <div className="border-custom flex max-h-[90vh] min-h-[60vh] w-96 flex-col scroll-smooth rounded-xl border pt-2">
        <span className="flex justify-center text-lg font-semibold">
          Recent joined rooms
        </span>

        <div className="scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded flex max-h-[70vh] flex-col justify-between space-y-3 overflow-y-auto px-3 py-4 text-start">
          {[
            {
              title: "Ajaoo music bjate hai",
              code: "RJSXO",
              Owner: "Ashish Tiwari",
            },
            {
              title: "Ajaoo music bjate hai",
              code: "RJSXO",
              Owner: "Ashish Tiwari",
            },
            {
              title: "Ajaoo music bjate hai",
              code: "RJSXO",
              Owner: "Ashish Tiwari",
            },
            {
              title: "Saturday stream join",
              code: "NAMME",
              Owner: "Ashish Tiwari",
            },
            {
              title: "Bgmi jonthan room",
              code: "RJSXO",
              Owner: "Ashish Tiwari",
            },
            {
              title: "Beat pe dance",
              code: "JKXKSQ",
              Owner: "Ashish Tiwari",
            },
            {
              title: "Music Bajaoo laundo",
              code: "RJSXO",
              Owner: "Ashish Tiwari",
            },
            {
              title: "Music Bajaoo laundo",
              code: "RJSXO",
              Owner: "Ashish Tiwari",
            },
            {
              title: "Music Bajaoo laundo",
              code: "RJSXO",
              Owner: "Ashish Tiwari",
            },
            {
              title: "Ajaoo music bjate hai",
              code: "RJSXO",
              Owner: "Ashish Tiwari",
            },
            {
              title: "Saturday stream join",
              code: "NAMME",
              Owner: "Ashish Tiwari",
            },
            {
              title: "Ajaoo music bjate hai",
              code: "RJSXO",
              Owner: "Ashish Tiwari",
            },
            {
              title: "Saturday stream join",
              code: "NAMME",
              Owner: "Ashish Tiwari",
            },
          ].map((value, index) => (
            <div className="flex flex-col" key={index}>
              <span>{value.title}</span>
              <span className="pt-0.5 text-xs text-neutral-300">
                room id - {value.code}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
