import { WebSocket } from "ws";
import axios from "axios";
import { FromWebSocketMessages } from "@repo/common/type";
import { AxiosError } from "axios";


export default class Room {
  private joinedPersons: WebSocket[];
  private roomTitle: string;
  private roomPassword: string;
  private adminSocket: WebSocket;
  private adminId: string;
  private accessToken: string;

  constructor(
    socket: WebSocket,
    roomTitle: string,
    roomPassword: string,
    accessToken: string
  ) {
    this.joinedPersons = [];
    this.roomPassword = roomPassword;
    this.roomTitle = roomTitle;
    this.adminSocket = socket;
    this.joinedPersons.push(socket);
    this.adminId = socket.userId;
    this.accessToken = accessToken;
  }

  setAdmin(socket: WebSocket) {
    this.adminSocket = socket;
  }
  addPersons(socket: WebSocket) {
    this.joinedPersons.push(socket);
  }
  getRoomPassword() {
    return this.roomPassword;
  }
  getRoomTitle() {
    return this.roomTitle;
  }
  checkPersonPresence(socket: WebSocket){
    this.joinedPersons.map((joinedSocket) => {
      if(joinedSocket === socket){
        return true
      }
    })
    return false
  }

  async searchSong(socket: WebSocket,song: string) {
    try {
      const songResult = await axios.get(
        `https://api.spotify.com/v1/search?q=${song}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
      const sendMsg: FromWebSocketMessages = {
        type: "songs",
        message: JSON.stringify(songResult.data),
      };
      socket.send(JSON.stringify(sendMsg));
      return;
    } catch (error) {
      if(error instanceof AxiosError){
        const sendMsg: FromWebSocketMessages = {
          type: "error",
          message: "Error while searching songs",
        };
        socket.send(JSON.stringify(sendMsg));
        return;
      }
    }
  }
}
