import {
  FromWebSocketMessages,
  ToWebSocketMessages,
  ValidateAddSongSchema,
  ValidateCreateRoomSchema,
  ValidatePlayNextSongSchema,
  ValidateSongProgressSchema,
  ValidateSongVoteSchema,
} from "@repo/common/type";
import { WebSocket } from "ws";
import Room from "./Room";
import dotenv from "dotenv";
import Redis from "ioredis";
import { prisma } from "@repo/db/index";
dotenv.config();

export default class RoomManager {
  private musicRooms: Map<string, Room>;
  private static instance: RoomManager;
  private redisClient: Redis;

  private constructor() {
    const redis_url = process.env.REDIS_URL;
    this.redisClient = new Redis();
    this.musicRooms = new Map();
  }
  public static getInstance() {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
      return RoomManager.instance;
    }
    return RoomManager.instance;
  }

  async handleRoom(socket: WebSocket, data: ToWebSocketMessages) {
    if (data.type === "create_room") {
      try {
        if (this.musicRooms.get(data.roomId)) {
          const sendMsg: FromWebSocketMessages = {
            type: "error",
            message: "Room aldready exists",
          };
          return socket.send(JSON.stringify(sendMsg));
        }
        const createdRooms = await this.redisClient.smembers("rooms");
        const isCreated = createdRooms.includes(data.roomId);
        if (isCreated) {
          const sendMsg: FromWebSocketMessages = {
            type: "error",
            message: "Room aldready exists",
          };
          return socket.send(JSON.stringify(sendMsg));
        }

        this.musicRooms.set(
          data.roomId,
          new Room(socket, data.roomTitle, data.roomPassword, data.roomId)
        );

        const sendMsg: FromWebSocketMessages = {
          type: "joined",
          message: "Lets rock",
          metadata: {
            room_id: data.roomId,
            room_title: data.roomTitle,
            owner_name: socket.userName,
            joined_persons: 1,
            queue: [],
            track: {
              currentTrack: undefined,
              isPlaying: false,
              currentSongProgress: 0,
              currentSongDuration: undefined,
              currentSongProgressINsecond: undefined,
            },
            role: "admin",
          },
        };

        socket.send(JSON.stringify(sendMsg));
        const pushMessage = {
          type: "created_room",
          roomId: data.roomId,
          ownerId: socket.userId,
          ownerName: socket.userName,
          roomName: data.roomTitle,
          roomPassword: data.roomPassword,
          created_At: new Date(),
          maxJoinedUser: 1,
        };
        await this.redisClient.lpush("data", JSON.stringify(pushMessage));
        await this.redisClient.sadd("rooms", data.roomId);
        return;
      } catch (error) {
        const sendMsg: FromWebSocketMessages = {
          type: "error",
          message: "Something went wrong",
        };
        return socket.send(JSON.stringify(sendMsg));
      }
    }
    if (data.type === "join_room") {
      const room = this.musicRooms.get(data.roomId);
      if (!room) {
        const sendMsg: FromWebSocketMessages = {
          type: "error",
          message: "Room not exists",
        };
        return socket.send(JSON.stringify(sendMsg));
      }
      //check with the redis that room exits or not
      const createdRooms = await this.redisClient.smembers("rooms");
      const isCreated = createdRooms.includes(data.roomId);
      if (!isCreated) {
        const sendMsg: FromWebSocketMessages = {
          type: "error",
          message: "Room not exists",
        };
        return socket.send(JSON.stringify(sendMsg));
      }

      const roomPassword = room.getRoomPassword();
      const checkPassword = roomPassword === data.roomPassword;

      if (!checkPassword) {
        const sendMsg: FromWebSocketMessages = {
          type: "error",
          message: "Invalid password",
        };
        return socket.send(JSON.stringify(sendMsg));
      }
      room.addPersons(socket);
      const pushMessage = {
        type: "join_room",
        roomId: data.roomId,
        userId: socket.userId,
        joinedAt: new Date(),
      };
      await this.redisClient.lpush("data", JSON.stringify(pushMessage));
    }
  }

  handleSearch(socket: WebSocket, song: string, roomId: string) {
    const room = this.musicRooms.get(roomId);
    if (!room) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "room doesn't exists",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    const isPersonJoined = room.checkPersonPresence(socket);

    if (!isPersonJoined) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "you are not part of this room",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    return room.searchSong(socket, song);
  }

  handleAddSong(socket: WebSocket, data: ToWebSocketMessages) {
    const room = this.musicRooms.get(data.roomId);
    if (!room) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "room doesn't exists",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    const isPersonJoined = room.checkPersonPresence(socket);

    if (!isPersonJoined) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "you are not part of this room",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    const zodChecking = ValidateAddSongSchema.safeParse(data);
    if (!zodChecking.success) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Invalid song payload",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    return room.addSongToQueue(socket, zodChecking.data.songToAdd);
  }

  handleVote(socket: WebSocket, data: ToWebSocketMessages) {
    const zodData = ValidateSongVoteSchema.safeParse(data);
    if (!zodData.success) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Invalid song payload",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    const room = this.musicRooms.get(zodData.data.roomId);
    if (!room) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "room doesn't exists",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    const isPersonJoined = room.checkPersonPresence(socket);

    if (!isPersonJoined) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "you are not part of this room",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    
    return room.voteSong(socket, zodData.data.songToVoteId);
  }

  handleSongChange(socket: WebSocket, data: ToWebSocketMessages) {
    const zodData = ValidatePlayNextSongSchema.safeParse(data);
    if (!zodData.success) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Invalid song change payload",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    if(zodData.data.type !== "playNext"){
      return
    }
    const room = this.musicRooms.get(zodData.data.roomId);
    if (!room) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "room doesn't exists",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    const adminId = room.getAdminId()
    const isAdmin = socket.userId === adminId

    if (!isAdmin) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "you are not admin",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    
    return room.handleSongChange(socket, this.redisClient);
  }

  handleSongProgress(socket: WebSocket, data: ToWebSocketMessages) {
    const zodData = ValidateSongProgressSchema.safeParse(data);
    if (!zodData.success) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Invalid song change payload",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    const room = this.musicRooms.get(zodData.data.roomId);
    if (!room) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "room doesn't exists",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    const isPersonJoined = room.checkPersonPresence(socket);
    const adminId = room.getAdminId()
    if (socket.userId !== adminId) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Admin can only change song progress",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    return room.handleSongProgress(socket, zodData.data);
  }

  async handleClose(socket: WebSocket) {
    // handle here
  }
}
