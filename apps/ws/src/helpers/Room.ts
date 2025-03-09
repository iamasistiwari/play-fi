import {WebSocket} from "ws";


export default class Room {
  private joinedPersons: WebSocket[];
  private roomTitle: string;
  private roomPassword: string;
  private adminSocket: WebSocket;
  private adminId: string;

  constructor(
    socket: WebSocket,
    roomTitle: string,
    roomPassword: string
  ) {
    this.joinedPersons = [];
    this.roomPassword = roomPassword;
    this.roomTitle = roomTitle;
    this.adminSocket = socket;
    this.joinedPersons.push(socket)
    this.adminId = socket.userId!
  }

  setAdmin(socket: WebSocket){
    this.adminSocket = socket
  }
  addPersons(socket: WebSocket){
    this.joinedPersons.push(socket)
  }
  getRoomPassword(){
    return this.roomPassword
  }
  getRoomTitle(){
    return this.roomTitle
  }
}
