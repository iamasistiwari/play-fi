import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../lib/auth";
import { LogOut, User } from "lucide-react";
import RoomInput from "../../components/RoomInput";
import Image from "next/image";
import RecentlyJoined from "@/components/RecentlyJoined";
import Link from "next/link";

export default async function page() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <nav className="flex h-16 items-center justify-between border-b border-neutral-800 px-4 xl:px-32">
        <span className="inline-block bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text text-2xl font-semibold text-transparent">
          Play-Fi
        </span>
        <div className="flex items-center justify-center space-x-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 p-1.5 text-neutral-400">
            {session?.user.image ? (
              <Image
                src={session.user.image}
                alt="dp"
                fill
                className="h-full w-full rounded-full object-fill"
              />
            ) : (
              <User />
            )}
          </span>
          <div className="flex flex-col">
            <span className="">{session?.user.name}</span>
            <Link href={'/api/auth/signout'} className="flex flex-col">
              <span className="text-xs text-neutral-400">Signout ?</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* input and recent */}
      <div className="my-10 flex flex-col space-y-16 lg:space-y-0 px-4 xl:flex-row xl:justify-between xl:px-32">
        <div className="">
          <RoomInput />
        </div>
        <div className=" mb-10 lg:mb-0">
          <RecentlyJoined />
        </div>
      </div>
    </div>
  );
}
