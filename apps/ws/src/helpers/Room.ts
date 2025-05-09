//@ts-ignore
import ytSearch from "youtube-search-api";
import { WebSocket } from "ws";
import {
  FromWebSocketMessages,
  YoutubeVideoDetails,
  StoreSongs,
  VoteSong,
  SongProgress,
} from "@repo/common/type";
import { AxiosError } from "axios";
import Redis from "ioredis";

export default class Room {
  private joinedPlayers: Map<string, WebSocket>;
  private roomTitle: string;
  private roomPassword: string;
  private adminName: string;
  private roomId: string;
  private userLimitSong: Map<string, { count: number; timeStamp: number[] }>;
  private adminId: string;
  private currentSongQueue: StoreSongs[];
  private TIME_WINDOW = 20 * 60 * 1000;
  private SONG_LIMIT = 3;
  private currentTrack: StoreSongs | undefined;
  private currentSongProgress: number | undefined;
  private isPlaying: boolean;
  private currentSongDuration: number | undefined;
  private highestUser: number
  private currentSongProgressINsecond: number | undefined;
  // key must be like `socket.userId:songId`
  private votingDetails: Map<string, boolean>;

  constructor(
    socket: WebSocket,
    roomTitle: string,
    roomPassword: string,
    roomId: string
  ) {
    this.currentSongQueue = [];
    this.joinedPlayers = new Map();
    this.roomPassword = roomPassword;
    this.roomTitle = roomTitle;
    this.adminId = socket.userId;
    this.joinedPlayers.set(socket.userId, socket);
    this.adminName = socket.userName;
    this.roomId = roomId;
    this.userLimitSong = new Map();
    this.votingDetails = new Map();
    this.currentTrack = undefined;
    this.currentSongProgress = undefined;
    this.currentSongDuration = undefined;
    this.currentSongProgressINsecond = undefined
    this.isPlaying = false;
    this.highestUser = 1;
  }

  getAdminId(){
    return this.adminId
  } 


  async addPersons(socket: WebSocket) {
    this.joinedPlayers.set(socket.userId, socket);
    const profileType = this.adminId === socket.userId ? "admin" : "user";
    const sendMsg: FromWebSocketMessages = {
      type: "joined",
      message: `${this.roomTitle}`,
      metadata: {
        room_id: this.roomId,
        room_title: this.roomTitle,
        joined_persons: this.joinedPlayers.size,
        owner_name: this.adminName,
        queue: this.currentSongQueue,
        track: {
          currentSongProgress: this.currentSongProgress,
          isPlaying: this.isPlaying,
          currentTrack: this.currentTrack,
          currentSongDuration: this.currentSongDuration,
          currentSongProgressINsecond: this.currentSongProgressINsecond,
        },
        role: profileType,
      },
    };
    socket.send(JSON.stringify(sendMsg));
    this.broadCastMetaData();
    if(this.highestUser < this.joinedPlayers.size){
      this.highestUser = this.joinedPlayers.size
    }
    
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
  async searchSong(socket: WebSocket, song: string) {
    try {
      const results = await ytSearch.GetListByKeyword(`${song}`, false);
      const sendMsg: FromWebSocketMessages = {
        type: "songs",
        message: JSON.stringify(results),
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

  addSongToQueue(socket: WebSocket, song: YoutubeVideoDetails) {
    //content should be valid video
    if (song.type !== "video") {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Invalid video properties",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    //check current queue length
    if (this.currentSongQueue.length >= 20) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Queue is full",
      };
      return socket.send(JSON.stringify(sendMsg));
    }

    // now check is video length is not greater than 10 min && less than 1
    const timeSplitedArrays = song.length.simpleText.split(":");
    if (timeSplitedArrays.length > 2) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Cannot add song over 10 minutes",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    const songMinutes = Number(timeSplitedArrays[0]);
    if (songMinutes > 10) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Cannot add song over 10 minutes",
      };
      return socket.send(JSON.stringify(sendMsg));
    }

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
    if (userSongs!.count >= this.SONG_LIMIT && socket.userId !== this.adminId) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "You can only add up to 3 songs in 20 minutes",
      };
      return socket.send(JSON.stringify(sendMsg));
    }

    //check if songs exits or not
    const isAdded = this.currentSongQueue.some((addedSong) => {
      return addedSong.id === song.id;
    });
    if (isAdded) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Can't add same song again",
      };
      return socket.send(JSON.stringify(sendMsg));
    }

    // add song to queee
    const songToAdd = {
      ...song,
      votes: 0,
      addedBy: socket.userName,
      voted: false,
    };
    this.currentSongQueue.push(songToAdd);

    //sort the array des
    this.currentSongQueue.sort((a, b) => b.votes - a.votes);

    // update all user values & send success
    userSongs!.timeStamp.push(current_time);
    userSongs!.count++;

    //send updated queue to all
    this.broadCastQueue();

    const sendMsg: FromWebSocketMessages = {
      type: "success",
      message: `song added`,
    };
    return socket.send(JSON.stringify(sendMsg));
  }

  voteSong(socket: WebSocket, songId: string) {
    //check whether song is in the
    const isSongInQueue = this.currentSongQueue.some((addedSong) => {
      return addedSong.id === songId;
    });

    if (!isSongInQueue) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "Song is not in the queue",
      };
      return socket.send(JSON.stringify(sendMsg));
    }
    // is user voted that song if yes reverse it and if not vote it
    const isVoted = this.votingDetails.get(`${socket.userId}:${songId}`);
    if (!isVoted) {
      this.votingDetails.set(`${socket.userId}:${songId}`, true);
      //now increase song vote also
      this.currentSongQueue = this.currentSongQueue.map((val) => {
        if (val.id === songId) {
          return {
            ...val,
            votes: val.votes + 1,
          };
        }
        return {
          ...val,
        };
      });
      //again sort array
      this.currentSongQueue.sort((a, b) => b.votes - a.votes);
      this.broadCastQueue();
    } else {
      this.votingDetails.set(`${socket.userId}:${songId}`, false);

      //now decrease the song vote also
      this.currentSongQueue = this.currentSongQueue.map((val) => {
        if (val.id === songId) {
          return {
            ...val,
            votes: val.votes - 1,
          };
        }
        return {
          ...val,
        };
      });
      //again sort array
      this.currentSongQueue.sort((a, b) => b.votes - a.votes);
      this.broadCastQueue();
    }
  }

  async handleSongChange(socket: WebSocket, redisClient: Redis) {
    if (this.currentSongQueue.length === 0) {
      const sendMsg: FromWebSocketMessages = {
        type: "error",
        message: "no song in the queue",
      };
      return socket.send(JSON.stringify(sendMsg));
    }

    this.currentTrack = this.currentSongQueue.shift();
    this.currentSongQueue.sort((a, b) => b.votes - a.votes);
    this.broadCastQueue();
    this.broadCastTrack()

    if(this.currentTrack){
      const pushMessage = {
        type: "song_added",
        roomId: this.roomId,
        songId: this.currentTrack.id,
        bigImg: this.currentTrack.thumbnail.thumbnails[1]?.url || "",
        smallImg: this.currentTrack.thumbnail.thumbnails[0]?.url || "",
        title: this.currentTrack.title,
        channelTitle: this.currentTrack.channelTitle,
        length: this.currentTrack.length.simpleText,
        addedTime: new Date()
      };
      await redisClient.lpush("data", JSON.stringify(pushMessage));
    }
  }

  handleSongProgress(socket: WebSocket, data: SongProgress) {
    this.currentSongProgress = data.track.currentSongProgress;
    this.currentSongProgressINsecond = data.track.currentSongProgressINsecond
    this.currentSongDuration = data.track.currentSongDuration
    this.isPlaying = data.track.isPlaying;
    this.broadCastTrack();
  }

  private broadCastMetaData() {
    this.joinedPlayers.forEach((socket) => {
      const profileType = this.adminId === socket.userId ? "admin" : "user";
      const sendMsg: FromWebSocketMessages = {
        type: "metadata",
        metadata: {
          room_id: this.roomId,
          room_title: this.roomTitle,
          joined_persons: this.joinedPlayers.size,
          owner_name: this.adminName,
          queue: this.currentSongQueue,
          track: {
            currentSongProgress: this.currentSongProgress,
            isPlaying: this.isPlaying,
            currentTrack: this.currentTrack,
            currentSongDuration: this.currentSongDuration,
            currentSongProgressINsecond: this.currentSongProgressINsecond,
          },
          role: profileType,
        },
      };
      socket.send(JSON.stringify(sendMsg));
    });
  }

  private broadCastQueue() {
    this.joinedPlayers.forEach((socket) => {
      const userSongArray = this.currentSongQueue.map((song) => {
        let isVoted = this.votingDetails.get(`${socket.userId}:${song.id}`);
        if (!isVoted) {
          isVoted = false;
        }
        return {
          ...song,
          voted: isVoted,
        };
      });
      const sendMsg: FromWebSocketMessages = {
        type: "queue",
        queue: userSongArray,
      };
      socket.send(JSON.stringify(sendMsg));
    });
  }

  private broadCastTrack() {
    this.joinedPlayers.forEach((socket) => {
      const sendMsg: FromWebSocketMessages = {
        type: "track",
        track: {
          currentSongProgress: this.currentSongProgress,
          isPlaying: this.isPlaying,
          currentTrack: this.currentTrack,
          currentSongDuration: this.currentSongDuration,
          currentSongProgressINsecond:this.currentSongProgressINsecond
        },
      };
      socket.send(JSON.stringify(sendMsg));
    });
  }
}
