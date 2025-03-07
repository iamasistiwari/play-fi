import WebSocket from "ws";
import {WebSocketMessages} from "@repo/common/type"

export function handleMessage(socket: WebSocket ,msg: WebSocket.RawData) {
    try {
        const data = (JSON.parse(msg.toString())) as unknown as WebSocketMessages

        if(data.type === "create_room") {
        }
        
    } catch (error) {
        socket.send("Invalid Format")
    }
}