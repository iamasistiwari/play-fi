import {
  FromWebSocketMessages,
  ToWebSocketMessages,
  ValidateCreateRoomSchema,
} from "@repo/common/type";
import { WebSocket } from "ws";
import Room from "./Room";
import { musicRooms } from "./memory";

export default class RoomManager {
  private static instance: RoomManager;

  private constructor() {}

  public static getInstance() {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  handleRoom(socket: WebSocket, data: ToWebSocketMessages) {
    if (data.type === "create_room") {
      const zodChecking = ValidateCreateRoomSchema.safeParse(data);
      if (zodChecking.error) {
        const sendMsg: FromWebSocketMessages = {
          type: "error",
          message: "Invalid payload",
        };
        socket.send(JSON.stringify(sendMsg));
        return;
      }
      const roomId = data.roomId;
      const room = musicRooms.get(roomId)

      if (!room) {
        musicRooms.set(
          roomId,
          new Room(socket, data.roomTitle, data.roomPassword, data.accessToken)
        );
        const sendMsg: FromWebSocketMessages = {
          type: "joined",
          message: "Lets rock",
        };
        socket.send(JSON.stringify(sendMsg));
        return;
      } else {
        const sendMsg: FromWebSocketMessages = {
          type: "error",
          message: "Room aldready exists",
        };
        socket.send(JSON.stringify(sendMsg));
        return;
      }
    }
    if (data.type === "join_room") {
      const roomId = data.roomId;

      const room = musicRooms.get(roomId);
      if(!room){
          const sendMsg: FromWebSocketMessages = {
            type: "error",
            message: "Room not exists",
          };
          return socket.send(JSON.stringify(sendMsg));
      }
      const roomPassword = room.getRoomPassword()
      const checkPassword = roomPassword === data.roomPassword

      if (!checkPassword) {
        const sendMsg: FromWebSocketMessages = {
          type: "error",
          message: "Invalid password",
        };
        return socket.send(JSON.stringify(sendMsg));
      }
      room.addPersons(socket);
      const roomTitle = room.getRoomTitle();
      const sendMsg: FromWebSocketMessages = {
        type: "joined",
        message: `${roomTitle}`,
      };
      return socket.send(JSON.stringify(sendMsg));
    }
  }

  handleSearch(socket: WebSocket, song: string, roomId: string) {
    const room = musicRooms.get(roomId)
    if (!room) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "room doesn't exists",
      };
      socket.send(JSON.stringify(sendMsg));
      return;
    }
    // checking this user is exits in the room or not
    const isPersonJoined = room.checkPersonPresence(socket);

    if (!isPersonJoined) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "you are not part of this room",
      };
      socket.send(JSON.stringify(sendMsg));
      return;
    }
    // now person is joined search the song and give back the result
    return room.searchSong(socket, song);
  }
}
