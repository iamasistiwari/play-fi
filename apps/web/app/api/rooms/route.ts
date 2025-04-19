import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/db/index";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("SERVER CAME");

  if (!session) {
    return NextResponse.json("Unauthorized request", { status: 403 });
  }
  try {
    const result = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        hostedSpaces: {
          orderBy: {
            created_At: "desc",
          },
        },
        joinedRooms: {
          orderBy: {
            joinedAt: "desc",
          },
          include: {
            room: true,
          },
        },
      },
    });
    const hosted = (result?.hostedSpaces ?? []).map((room) => ({
      type: "hosted",
      time: new Date(room.created_At),
      data: room,
    }));

    const joined = (result?.joinedRooms ?? []).map((join) => ({
      type: "joined",
      time: new Date(join.joinedAt),
      data: join.room,
    }));

    const merged = [...hosted, ...joined].sort(
      (a, b) => b.time.getTime() - a.time.getTime(),
    );
    return NextResponse.json(merged, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 400 });
  }
}
