import {WebSocket} from "ws";
import { ToWebSocketMessages } from "@repo/common/type";
import RoomManager from "./helpers/RoomManager";

const roomManager = RoomManager.getInstance()

export function handleMessage(socket: WebSocket, data: ToWebSocketMessages) {
  try {
    if(data.type === "create_room" || data.type === "join_room"){
      return roomManager.handleRoom(socket, data)
    }
  } catch (error) {
    return socket.send("Invalid Format");
  }
}
