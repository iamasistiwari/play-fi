import {
  FromWebSocketMessages,
  ToWebSocketMessages,
  ValidateAddSongSchema,
  ValidateCreateRoomSchema,
  ValidatePlayNextSongSchema,
  ValidateSongVoteSchema,
  YoutubeVideoDetails,
} from "@repo/common/type";
import { WebSocket } from "ws";
import Room from "./Room";
import dotenv from "dotenv"
import Redis from "ioredis";
dotenv.config()

type RedisRoomType =  {
  "roomTitle": string,
  "roomPassword": string,
  "roomId": string,
  "roomAdminId": string,
} | {}

export default class RoomManager {
  private musicRooms: Map<string, Room>
  private static instance: RoomManager;
  private redisClient: Redis

  private constructor() {
    const redis_url = process.env.REDIS_URL;
    this.redisClient = new Redis(redis_url!);
    this.musicRooms = new Map()
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
        const zodChecking = ValidateCreateRoomSchema.safeParse(data);
        if (!zodChecking.success) {
          const sendMsg: FromWebSocketMessages = {
            type: "error",
            message: "Invalid payload",
          };
          return socket.send(JSON.stringify(sendMsg));
        }

        if (this.musicRooms.get(data.roomId)) {
          const sendMsg: FromWebSocketMessages = {
            type: "error",
            message: "Room aldready exists",
          };
          return socket.send(JSON.stringify(sendMsg));
        }

        this.musicRooms.set(data.roomId, new Room(socket, data.roomTitle, data.roomPassword, data.roomId))

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
              nextTrack: undefined,
            },
          },
        };

        return socket.send(JSON.stringify(sendMsg));

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
        return socket.send(JSON.stringify(sendMsg))
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

  handleAddSong(socket: WebSocket, data: ToWebSocketMessages){
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
    const zodChecking = ValidateAddSongSchema.safeParse(data)
    if(!zodChecking.success){
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Invalid song payload",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    return room.addSongToQueue(socket, zodChecking.data.songToAdd)
  }

  handleVote(socket: WebSocket, data: ToWebSocketMessages){
    if(data.type !== "voteSong") return
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
    const zodChecking = ValidateSongVoteSchema.safeParse(data);
    if (!zodChecking.success) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Invalid song payload",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    return room.voteSong(socket ,data.songToVoteId)

  }

  handleSongChange(socket: WebSocket, data: ToWebSocketMessages){
    if (data.type !== "playNext") return;
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
    const zodChecking = ValidatePlayNextSongSchema.safeParse(data);
    if (!zodChecking.success) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Invalid song change payload",
      };
      return socket.send(JSON.stringify(sendMsg));
    }

    return room.handleSongChange(socket)
  }

  async handleClose(socket: WebSocket) {

    //get its joinedRooms

    //check user exists in any room or not
  

  }
}
