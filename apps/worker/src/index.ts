import Redis from "ioredis";
import dotenv from "dotenv";
import { prisma } from "@repo/db/index";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientInitializationError,
} from "@prisma/client/runtime/library";
dotenv.config();

const getRedisURL = () => {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS URL NOT FOUND");
  }

  return url;
};

const redis = new Redis();

async function main() {
  while (true) {
    let data:any = null
    try {
      const res = await redis.brpop("data", 0);
      if (!res) {
        continue;
      }
      data = await JSON.parse(res[1]);
      if(data.type === "song_added"){
        await prisma.song.upsert({
          where: {
            songId: data.songId,
          },
          update: {
            room: {
              connect: {
                roomId: data.roomId
              }
            }
          },
          create: {
            songId: data.songId,
            bigImg: data.bigImg,
            smallImg: data.smallImg,
            title: data.title,
            channelTitle: data.channelTitle,
            length: data.length,
            addedTime: data.addedTime,
            room: {
              connect: {
                roomId: data.roomId
              },
            },
          },
        });
        console.log("OK ADDED")
        continue;
      }

      if (data.type === "join_room") {
        await prisma.roomUser.upsert({
          where: {
            userId_roomId: {
              userId: data.userId,
              roomId: data.roomId,
            },
          },
          update: {
            joinedAt: data.joinedAt,
          },
          create: {
            userId: data.userId,
            roomId: data.roomId,
            joinedAt: data.joinedAt,
          },
        });
        console.log("OK JOINED");
        continue;
      }
      if (data.type === "created_room") {
        await prisma.room.create({
          data: {
            roomId: data.roomId,
            ownerId: data.ownerId,
            ownerName: data.ownerName,
            roomName: data.roomName,
            roomPassword: data.roomPassword,
            created_At: data.created_At,
            maxJoinedUser: data.maxJoinedUser,
          },
        });
        console.log("OK CREATED");
        continue;
      }
    } catch (error) {
      console.log("Err is", error);
      
      const isDbDown =
        (error instanceof PrismaClientKnownRequestError &&
          ["P1001", "P1002", "P1003"].includes(error.code)) ||
        error instanceof PrismaClientUnknownRequestError ||
        error instanceof PrismaClientInitializationError;

      if (isDbDown) {
        console.log("Database seems unreachable. Requeuing message...");
        await redis.lpush("data", JSON.stringify(data));
      } else {
        console.error("Unhandled error:", error);
      }

    }
  }
}

main();
