"use client";
import React, { useState } from "react";
import Input from "./ui/Input";
import { Info, Plus } from "lucide-react";
import CustomButton from "./ui/CustomButton";
import { AlertDialog } from "radix-ui";
import toast from "react-hot-toast";
import { FaSpotify } from "react-icons/fa6";

// import { useSession } from "next-auth/react";

export default function RoomInput() {
  // const session = useSession();
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [, setRoomPassword] = useState<string>("");
  const [titleError, setTitleError] = useState<boolean>(false);
  const [passError, setPassError] = useState<boolean>(false);
  const [infoMouseEnter, setInfoMouseEnter] = useState<boolean>(false)

  const generateCode = (length: number = 6): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }
    return code;
  };

  return (
    <div className="mt-12 flex flex-row justify-between space-x-20 px-32">
      <form className="ml-32 flex max-w-[450px] flex-col space-y-10">
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
                  setGeneratedCode(code);
                  await navigator.clipboard.writeText(code);
                  toast.success("Code copied!", { duration: 4000 });
                }}
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
                    {generatedCode}
                  </span>
                  <label className="mt-2 pl-0.5 text-sm text-black">
                    Enter room title
                  </label>
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.value.length < 8) {
                        setTitleError(true);
                      } else {
                        setTitleError(false);
                        setRoomPassword(e.target.value);
                      }
                    }}
                    placeholder="enter room title"
                    className="mt-2 w-full tracking-tight text-neutral-800"
                    type="password"
                  />
                  {titleError ? (
                    <span className="mt-2 text-sm text-red-400">
                      Title must be at least 10 characters
                    </span>
                  ) : null}
                  <label className="mt-2 pl-0.5 text-sm text-black">
                    Enter room password
                  </label>
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.value.length < 8) {
                        setPassError(true);
                      } else {
                        setPassError(false);
                        setRoomPassword(e.target.value);
                      }
                    }}
                    placeholder="enter room password"
                    className="mt-2 w-full tracking-tight text-neutral-800"
                    type="password"
                  />
                  {passError ? (
                    <span className="mt-2 text-sm text-red-400">
                      Password must be at least 8 characters
                    </span>
                  ) : null}

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
                        console.log(e);
                      }}
                      placeholder="enter access token"
                      className="mt-2 w-full tracking-tight text-neutral-800 text-xs"
                      type="text"
                    />
                  </span>
                  <label className="my-1 flex justify-center text-black">
                    OR
                  </label>
                  <CustomButton className="bg-black text-white hover:opacity-85 transition-opacity duration-200" iconStyle="text-green-400" isLoading={false} Icon={FaSpotify}>
                    Login with spotify
                  </CustomButton>
                </AlertDialog.Description>
                <div className="flex justify-end gap-[25px]">
                  <AlertDialog.Cancel asChild>
                    <button className="inline-flex h-[35px] select-none items-center justify-center rounded bg-mauve4 px-[15px] font-medium leading-none text-mauve11 outline-none outline-offset-1 hover:bg-mauve5 focus-visible:outline-2 focus-visible:outline-mauve7">
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <CustomButton
                      Icon={null}
                      isLoading={false}
                      disabled={true}
                      className="inline-flex h-[35px] select-none items-center justify-center rounded bg-green-200 px-[15px] font-medium leading-none text-green-700 outline-none outline-offset-1 hover:bg-green-300 focus-visible:outline-2 focus-visible:outline-red7 disabled:cursor-not-allowed"
                    >
                      Create
                    </CustomButton>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="joinRoom">Join room</label>
          <div className="space-x-3">
            <Input
              id="joinRoom"
              placeholder="enter room id"
              className="tracking-widest"
            />
            <CustomButton
              variant={"ghost"}
              className="h-12 w-28 bg-blue-700 tracking-widest"
              isLoading={false}
              Icon={null}
            >
              Join
            </CustomButton>
          </div>
        </div>
      </form>
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
