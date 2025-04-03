import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const getRedisURL = () => {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS URL NOT FOUND");
  }

  return url;
};

const redis = new Redis(getRedisURL());

async function main() {
  while (true) {
    try {
    } catch (error) {
      console.log(error);
    }
  }
}

main();
