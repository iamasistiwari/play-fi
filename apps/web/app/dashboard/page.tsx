import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../lib/auth";
import { User } from "lucide-react";
import RoomInput from "../../components/RoomInput";

export default async function page() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <nav className="flex h-16 items-center justify-between border-b border-neutral-800 px-32">
        <span className="inline-block bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text text-2xl font-semibold text-transparent">
          Play-Fi
        </span>
        <div className="flex items-center justify-center space-x-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 p-1.5 text-neutral-400">
            <User />
          </span>
          <span className="">{session?.user.name}</span>
        </div>
      </nav>
      {/* input and recent */}
      <div>
        <div>
          <RoomInput />
        </div>
      </div>
    </div>
  );
}
