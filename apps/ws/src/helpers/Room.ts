import { WebSocket } from "ws";
import axios from "axios";
import { FromWebSocketMessages } from "@repo/common/type";
import { AxiosError } from "axios";


export default class Room {
  private joinedPlayersWebsocket: WebSocket[];
  private joinedPlayerIds: Map<string, string>
  private roomTitle: string;
  private roomPassword: string;
  private accessToken: string;
  private adminId: string;

  constructor(
    socket: WebSocket,
    roomTitle: string,
    roomPassword: string,
    accessToken: string
  ) {
    this.joinedPlayersWebsocket = [];
    this.roomPassword = roomPassword;
    this.roomTitle = roomTitle;
    this.joinedPlayersWebsocket.push(socket);
    this.adminId = socket.userId;
    this.accessToken = accessToken;
    this.joinedPlayerIds = new Map()
    this.joinedPlayerIds.set(socket.userId, "")
  }

  addPersons(socket: WebSocket) {
    this.joinedPlayersWebsocket.push(socket);
    const isPresent = this.joinedPlayerIds.get(socket.userId)
    if(!isPresent){
      this.joinedPlayerIds.set(socket.userId, "")
    }
  }
  getRoomPassword() {
    return this.roomPassword;
  }
  getRoomTitle() {
    return this.roomTitle;
  }
  checkPersonPresence(socket: WebSocket){
    // const isPresent = this.joinedPlayerIds.some((id) => {
    //   return socket.userId === id
    // })
    // return isPresent
    const isPresent = this.joinedPlayerIds.get(socket.userId);
    if (!isPresent) {
      return false;
    }
    return true;
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
