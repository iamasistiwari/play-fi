import Redis from "ioredis";
import dotenv from "dotenv";
import {prisma} from "@repo/db/index"
dotenv.config();

const getRedisURL = () => {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS URL NOT FOUND");
  }

  return url;
};

type MessageReceived = {
  type: "created_room",
  roomId: string,
  ownerId: string
  roomName: string,
  roomPassword: string,
  created_At: string,
  maxJoinedUser: number
}


const redis = new Redis();

async function main() {
  while (true) {
    try {
      const res = await redis.brpop("data",0)
      if(!res){
        return 
      }
      const data = JSON.parse(res[1]);
      if(data.type === "create_room"){
        await prisma.room.create({
          data: {
            roomId: data.roomId,
            ownerId: data.ownerId,
            ownerName: data.roomName,
            roomName String
            roomPassword String
            created_At String
            maxJoinedUser Int
          }
        })
      }

      
    } catch (error) {
      console.log(error);
    }
  }
}

main();
