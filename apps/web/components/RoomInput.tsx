"use client";
import React, { useState } from "react";
import Input from "./ui/Input";
import { Plus } from "lucide-react";
import CustomButton from "./ui/CustomButton";
import { AlertDialog } from "radix-ui";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function RoomInput() {
  const session = useSession();
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [roomPassword, setRoomPassword] = useState<string>("");
  const [titleError, setTitleError] = useState<boolean>(false);
  const [passError, setPassError] = useState<boolean>(false);

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
      <form className="flex max-w-[450px] flex-col space-y-10 ml-32">
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
                <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                  Share code to friends
                </AlertDialog.Title>
                <AlertDialog.Description className="mb-5 mt-[15px] flex flex-col">
                  <span className="text-center font-mono text-2xl font-semibold leading-10 tracking-widest text-blue-400">
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
                    placeholder="enter room password"
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
                </AlertDialog.Description>
                <div className="flex justify-end gap-[25px]">
                  <AlertDialog.Cancel asChild>
                    <button className="bg-mauve4 text-mauve11 hover:bg-mauve5 focus-visible:outline-mauve7 inline-flex h-[35px] select-none items-center justify-center rounded px-[15px] font-medium leading-none outline-none outline-offset-1 focus-visible:outline-2">
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <CustomButton
                      Icon={null}
                      isLoading={false}
                      disabled={true}
                      className="focus-visible:outline-red7 inline-flex h-[35px] select-none items-center justify-center rounded bg-green-200 px-[15px] font-medium leading-none text-green-700 outline-none outline-offset-1 hover:bg-green-300 focus-visible:outline-2 disabled:cursor-not-allowed"
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
            <Input id="joinRoom" placeholder="enter room id" className="tracking-widest"/>
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
      <div className="border-custom flex max-h-[90vh] min-h-[60vh] w-96 scroll-smooth flex-col rounded-xl border pt-2">
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
