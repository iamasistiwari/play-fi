import { WebSocket, WebSocketServer } from "ws";
import { FromWebSocketMessages, ToWebSocketMessages, ValidateToWebSocketSchema } from "@repo/common/type";
import RoomManager from "./helpers/RoomManager";
import { verifyUser } from "./helpers/validation";

const PORT = 7077;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", async (socket: WebSocket, request) => {
  const queryParams = new URLSearchParams(request.url?.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) {
    const sendData: FromWebSocketMessages = {
      type: "error",
      message: "Unauthorized request",
    };
    return socket.send(JSON.stringify(sendData));
  }
  const validation = verifyUser(socket, token);
  if (!validation) {
    const sendData: FromWebSocketMessages = {
      type: "error",
      message: "Unauthorized request",
    };
    return socket.send(JSON.stringify(sendData));
  }

  socket.on("message", (msg) => {
    try {
      const json = JSON.parse(msg.toString())
      const data = ValidateToWebSocketSchema.parse(json)

      if (data.type === "create_room" || data.type === "join_room") {
        return RoomManager.getInstance().handleRoom(socket, data);
      }
      if (data.type === "searchSongs") {
        return RoomManager.getInstance().handleSearch(
          socket,
          data.song,
          data.roomId
        );
      }
      if (data.type === "addSong") {
        return RoomManager.getInstance().handleAddSong(socket, data);
      }
      if (data.type === "voteSong") {
        return RoomManager.getInstance().handleVote(socket, data);
      }

      if (data.type === "playNext") {
        return RoomManager.getInstance().handleSongChange(socket, data);
      }

      if (data.type === "songProgress") {
        return RoomManager.getInstance().handleSongProgress(socket, data);
      }
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Invalid Payload Data",
      };
      return socket.send(JSON.stringify(sendMsg));
    } catch (error) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Invalid Payload",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
  });

  socket.on("close", () => {
    return RoomManager.getInstance().handleClose(socket);
  });
});
