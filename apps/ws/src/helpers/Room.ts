import { WebSocket } from "ws";
import axios from "axios";
import { FromWebSocketMessages, Song } from "@repo/common/type";
import { AxiosError } from "axios";

export default class Room {
  private joinedPlayers: Map<string, WebSocket>;
  private roomTitle: string;
  private roomPassword: string;
  private accessToken: string;
  private adminName: string;
  private roomId: string;
  private userLimitSong: Map<string, { count: number; timeStamp: number[] }>;
  private adminId: string;
  private currentSongQueue: [];
  private TIME_WINDOW = 20 * 60 * 1000;
  private SONG_LIMIT = 3;

  constructor(
    socket: WebSocket,
    roomTitle: string,
    roomPassword: string,
    accessToken: string,
    roomId: string
  ) {
    this.currentSongQueue = [];
    this.joinedPlayers = new Map();
    this.roomPassword = roomPassword;
    this.roomTitle = roomTitle;
    this.adminId = socket.userId;
    this.accessToken = accessToken;
    this.joinedPlayers.set(socket.userId, socket);
    this.adminName = socket.userName;
    this.roomId = roomId;
    this.userLimitSong = new Map();
  }
  addPersons(socket: WebSocket) {
    const isPresent = this.joinedPlayers.get(socket.userId);
    if (!isPresent) {
      this.joinedPlayers.set(socket.userId, socket);
      const sendMsg: FromWebSocketMessages = {
        type: "joined",
        message: `${this.roomTitle}`,
        metadata: {
          room_id: this.roomId,
          room_title: this.roomTitle,
          joined_persons: this.joinedPlayers.size,
          owner_name: this.adminName,
        },
      };
      socket.send(JSON.stringify(sendMsg));
      this.joinedPlayers.forEach((socket) => {
        const sendMsg: FromWebSocketMessages = {
          type: "metadata",
          metadata: {
            room_id: this.roomId,
            room_title: this.roomTitle,
            joined_persons: this.joinedPlayers.size,
            owner_name: this.adminName,
          },
        };
        socket.send(JSON.stringify(sendMsg));
      });
      return;
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
  checkPersonPresence(socket: WebSocket) {
    const isPresent = this.joinedPlayers.get(socket.userId);
    if (!isPresent) {
      return false;
    }
    return true;
  }
  handleClose(socket: WebSocket) {
    this.joinedPlayers.delete(socket.userId);
    this.joinedPlayers.forEach((socket) => {
      const sendMsg: FromWebSocketMessages = {
        type: "metadata",
        metadata: {
          room_id: this.roomId,
          room_title: this.roomTitle,
          joined_persons: this.joinedPlayers.size,
          owner_name: this.adminName,
        },
      };
      socket.send(JSON.stringify(sendMsg));
    });
  }
  async searchSong(socket: WebSocket, song: string) {
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
      if (error instanceof AxiosError) {
        const sendMsg: FromWebSocketMessages = {
          type: "error",
          message: "Error while searching songs",
        };
        return socket.send(JSON.stringify(sendMsg));
      }
    }
  }

  handleVote() {}

  addSongToQueue(socket: WebSocket, userSendedSong: Song) {
    //check users maxAdded song timestamp

    const current_time = Date.now();

    if (!this.userLimitSong.has(socket.userId)) {
      this.userLimitSong.set(socket.userId, { count: 0, timeStamp: [] });
    }

    let userSongs = this.userLimitSong.get(socket.userId);

    // remove expired timestamp
    userSongs!.timeStamp = userSongs!.timeStamp.filter(
      (timeStamp) => current_time - timeStamp < this.TIME_WINDOW
    );

    userSongs!.count = userSongs!.timeStamp.length;

    if (userSongs!.count >= this.SONG_LIMIT) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "You can only add up to 3 songs in 20 minutes.",
      };
      return socket.send(JSON.stringify(sendMsg));
    }

    // add song to queee


    // update all user values

    userSongs!.timeStamp.push(current_time)
    userSongs!.count++
    const sendMsg:FromWebSocketMessages = {
      type: "success",
      message: `added to the queue.`,
    };
    return socket.send(JSON.stringify(sendMsg));
  }
}
