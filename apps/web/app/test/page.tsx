"use client"
import { AlertDialog } from "radix-ui";
import * as React from "react";
export default function page() {
  return (
    <div>
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <button className="bg-violet4 text-violet11 hover:bg-mauve3 focus-visible:outline-violet6 inline-flex h-[35px] select-none items-center justify-center rounded px-[15px] font-medium leading-none outline-none outline-offset-1 focus-visible:outline-2">
            Delete account
          </button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black data-[state=open]:animate-overlayShow fixed inset-0" />
          <AlertDialog.Content className="bg-gray1 data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md p-[25px] shadow-[var(--shadow-6)] focus:outline-none">
            <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              Are you absolutely sure?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-mauve11 mb-5 mt-[15px] text-[15px] leading-normal">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialog.Description>
            <div className="flex justify-end gap-[25px]">
              <AlertDialog.Cancel asChild>
                <button className="bg-mauve4 text-mauve11 hover:bg-mauve5 focus-visible:outline-mauve7 inline-flex h-[35px] select-none items-center justify-center rounded px-[15px] font-medium leading-none outline-none outline-offset-1 focus-visible:outline-2">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button className="bg-red4 text-red11 hover:bg-red5 focus-visible:outline-red7 inline-flex h-[35px] select-none items-center justify-center rounded px-[15px] font-medium leading-none outline-none outline-offset-1 focus-visible:outline-2">
                  Yes, delete account
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}
