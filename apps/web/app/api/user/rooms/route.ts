import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/db/index";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions)
    // if(!session){
    //     return new Response("Unauthorized request", { status: 403 });
    // }
    const result = await prisma.user.findUnique({
      where: { id: "100213631629308552409" },
      select: {
        hostedSpace: {
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
    const hosted = (result?.hostedSpace ?? []).map((room) => ({
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
    return new Response(JSON.stringify(merged), { status: 200 });
  } catch (error) {
    return new Response("ERROR", { status: 404 });
  }
}
