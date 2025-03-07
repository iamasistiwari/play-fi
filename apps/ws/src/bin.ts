import cluster from "cluster";
import os from "os";
import { WebSocketServer } from "ws";
import { handleMessage } from ".";

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
  wss.on("connection", (socket) => {
    socket.on("message", (msg) => {
      handleMessage(socket, msg);
    });
  });
}
