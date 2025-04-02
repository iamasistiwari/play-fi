import { WebSocket, WebSocketServer } from "ws";
import { FromWebSocketMessages, ToWebSocketMessages } from "@repo/common/type";
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
  const validation = verifyUser(socket,token);
  if (!validation) {
    const sendData: FromWebSocketMessages = {
      type: "error",
      message: "Unauthorized request",
    };
    return socket.send(JSON.stringify(sendData));
  }
  
  socket.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString()) as unknown as ToWebSocketMessages;
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
      if(data.type === "addSong"){
        return RoomManager.getInstance().handleAddSong(socket, data)
      }
      if(data.type === 'voteSong'){
        return RoomManager.getInstance().handleVote(socket, data)
      }

      if(data.type === "playNext"){
        return RoomManager.getInstance().handleSongChange(socket, data)
      }

      if(data.type === "songProgress"){
        return RoomManager.getInstance().handleSongProgress(socket, data)
      }
      return socket.send("Invalid payload data");

    } catch (error) {
      return socket.send("Invalid Format");
    }
  });

  socket.on("close", () => {
    return RoomManager.getInstance().handleClose(socket)
  })
});
