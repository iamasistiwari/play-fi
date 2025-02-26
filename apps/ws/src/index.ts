import { WebSocketServer } from "ws";


const PORT = 7077;
const wss = new WebSocketServer({ port: PORT })


wss.on('connection', (socket, request) => {

})