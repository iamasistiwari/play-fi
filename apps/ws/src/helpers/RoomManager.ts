import { FromWebSocketMessages, ToWebSocketMessages } from "@repo/common/type";
import WebSocket from "ws";
import { musicRoom } from "./memory";
import Room from "./Room";

export default class RoomManager {
  private static instance: RoomManager;

  constructor() {}

  static getInstance() {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  handleRoom(socket: WebSocket, data: ToWebSocketMessages) {
    if (data.type === "create_room") {
      const roomId = data.roomId;
      if (!musicRoom.get(roomId)) {
        musicRoom.set(
          roomId,
          new Room(socket, data.roomTitle, data.roomPassword)
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
      const room = musicRoom.get(roomId);
      if (room) {
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
        const roomTitle = room.getRoomTitle()
        const sendMsg: FromWebSocketMessages = {
          type: "joined",
          message: `${roomTitle}`,
        };
        return socket.send(JSON.stringify(sendMsg));
      } else {
        const sendMsg: FromWebSocketMessages = {
          type: "error",
          message: "Room not exists",
        };
        return socket.send(JSON.stringify(sendMsg));
      }
    }
  }

  handleVote(){
    
  }
}
