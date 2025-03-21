import { WebSocket } from "ws";
import axios from "axios";
import { FromWebSocketMessages } from "@repo/common/type";
import { AxiosError } from "axios";


export default class Room {
  private joinedPlayers: Map<string, WebSocket>
  private roomTitle: string;
  private roomPassword: string;
  private accessToken: string;
  private adminId: string;
  private adminName: string
  private totalCurrentJoinedPersons: number

  constructor(
    socket: WebSocket,
    roomTitle: string,
    roomPassword: string,
    accessToken: string
  ) {
    this.joinedPlayers = new Map();
    this.roomPassword = roomPassword;
    this.roomTitle = roomTitle;
    this.adminId = socket.userId;
    this.accessToken = accessToken;
    this.joinedPlayers.set(socket.userId, socket)
    this.totalCurrentJoinedPersons = 1
    this.adminName = socket.userName
  }
  addPersons(socket: WebSocket) {
    const isPresent = this.joinedPlayers.get(socket.userId)
    if(!isPresent){
      this.joinedPlayers.set(socket.userId, socket)
      this.totalCurrentJoinedPersons = this.totalCurrentJoinedPersons + 1
      const sendMsg: FromWebSocketMessages = {
        type: "joined",
        message: `${this.roomTitle}`,
        metadata: {
          room_title: this.roomTitle,
          joined_persons: this.totalCurrentJoinedPersons,
          owner_name: this.adminName 
        }
      };
      socket.send(JSON.stringify(sendMsg));
      this.joinedPlayers.forEach((socket) => {
        const sendMsg: FromWebSocketMessages = {
          type: "metadata",
          metadata: {
            room_title: this.roomTitle,
            joined_persons: this.totalCurrentJoinedPersons,
            owner_name: this.adminName,
          },
        };
        socket.send(JSON.stringify(sendMsg));
      });
      return 
    }
    const sendMsg: FromWebSocketMessages = {
      type: "close",
      message: `close the other tab`,
    };
    return socket.send(JSON.stringify(sendMsg));
  }
  getRoomPassword() {
    return this.roomPassword;
  }
  checkPersonPresence(socket: WebSocket){
    const isPresent = this.joinedPlayers.get(socket.userId);
    if (!isPresent) {
      return false;
    }
    return true;
  }
  handleClose(socket: WebSocket){
    this.joinedPlayers.delete(socket.userId)
    this.totalCurrentJoinedPersons = this.totalCurrentJoinedPersons - 1;
    this.joinedPlayers.forEach((socket) => {
      const sendMsg: FromWebSocketMessages = {
        type: "metadata",
        metadata: {
          room_title: this.roomTitle,
          joined_persons: this.totalCurrentJoinedPersons,
          owner_name: this.adminName,
        },
      };
      socket.send(JSON.stringify(sendMsg));
    })
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
      return socket.send(JSON.stringify(sendMsg));
    } catch (error) {
      if(error instanceof AxiosError){
        const sendMsg: FromWebSocketMessages = {
          type: "error",
          message: "Error while searching songs",
        };
        return socket.send(JSON.stringify(sendMsg));
      }
    }
  }

}
