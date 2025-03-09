import cluster from "cluster";
import os from "os";
import { WebSocketServer } from "ws";
import { handleMessage } from ".";
import { FromWebSocketMessages, ToWebSocketMessages } from "@repo/common/type";
import { verifyUser } from "./helpers/validation";
import { WebSocket } from "ws";


const PORT = 7077;
const totalCPUs = os.cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(`worker ${worker.id} stopped working.`);
  });
} else {
  const wss = new WebSocketServer({ port: PORT });
  wss.on("connection", async (socket: WebSocket, request) => {
    console.log("Connected to ",process.pid)
    const queryParams = new URLSearchParams(request.url?.split("?")[1])
    const token = queryParams.get("token")
    if(!token){
      const sendData: FromWebSocketMessages = {
        type: 'error',
        message: "Unauthorized request"
      }
      return socket.send(JSON.stringify(sendData))
    }
    const validation = await verifyUser(token)
    if(!validation){
      const sendData: FromWebSocketMessages = {
        type: "error",
        message: "Unauthorized request",
      };
      return socket.send(JSON.stringify(sendData));
    }
    socket.userId = validation
    socket.on("message", (msg) => {
      const data = JSON.parse(msg.toString()) as unknown as ToWebSocketMessages;
      handleMessage(socket, data);
    });
  });
}
