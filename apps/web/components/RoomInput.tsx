"use client"
import React, { useState } from 'react'
import Input from './ui/Input'
import { Plus } from 'lucide-react'
import CustomButton from './ui/CustomButton';
import { AlertDialog } from 'radix-ui';
import toast from 'react-hot-toast';

export default function RoomInput() {
    const [generatedCode, setGeneratedCode] = useState<string>("")
    const [roomPassword, setRoomPassword] = useState<string>("")
    const [errors, setErrors] = useState<boolean>(false)
  return (
    <div>
      <form className="flex flex-col">
        <div className="flex flex-col">
          <label htmlFor="createRoom">Create room</label>
          {/* DAILOG */}
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <CustomButton
                id="createRoom"
                className="max-w-sm"
                isLoading={false}
                Icon={Plus}
                onClick={async () => {
                  const code = generateCode();
                  setGeneratedCode(code);
                  await navigator.clipboard.writeText(code);
                  toast.success("Code copied!", {duration: 4000});
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
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.value.length < 8) {
                        setErrors(true);
                      } else {
                        setErrors(false);
                        setRoomPassword(e.target.value);
                      }
                    }}
                    placeholder="enter room password"
                    className="mt-2 w-full tracking-tight text-neutral-800"
                    type="password"
                  />
                  {errors ? (
                    <span className='text-red-400 text-sm mt-2'>Password must be at least 8 characters</span>
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
                      className="focus-visible:outline-red7 inline-flex h-[35px] select-none items-center justify-center rounded bg-green-200 px-[15px] font-medium leading-none text-green-700 outline-none outline-offset-1 hover:bg-green-300 focus-visible:outline-2"
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
          <div>
            <Input id="joinRoom" placeholder="enter room id" />
            <CustomButton
              variant={"ghost"}
              className="w-52"
              isLoading={false}
              Icon={null}
            >
              Join
            </CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
}


const generateCode = (length:number = 6): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    
    for(let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * chars.length)
        result += chars[randomIndex]
    }
    return result
}