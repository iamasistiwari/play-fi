"use client"
import { useSession } from "next-auth/react";
import React from "react";

export default function Page() {
  const session = useSession();
  return (
    <div className="flex flex-col text-4xl font-semibold">
      {session.data?.user.accessToken}
      <div className="">
        <input className="m-20 border border-neutral-700 bg-neutral-800 text-white focus:outline focus:outline-blue-700"></input>
      </div>
    </div>
  );
}
