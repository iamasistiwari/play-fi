import z from "zod";

export const ValidateCreateRoomSchema = z.object({
  type: z.literal("create_room"),
  roomId: z.string().min(6).max(6),
  roomTitle: z.string().min(10).max(50),
  roomPassword: z.string().min(8).max(30),
});
export const ValidateJoinRoomSchema = z.object({
  type: z.literal("join_room"),
  roomId: z.string().min(6).max(6),
  roomPassword: z.string().min(8).max(30),
});
export const SongSearchSchema = z.object({
  type: z.literal("searchSongs"),
  roomId: z.string().min(6).max(6),
  song: z.string().min(4),
});
export const ValidateAddSongSchema = z.object({
  type: z.literal("addSong"),
  roomId: z.string().min(6).max(6),
  songToAdd: z.object({
    id: z.string(),
    type: z.string(),
    thumbnail: z.object({
      thumbnails: z.array(
        z.object({
          url: z.string(),
          width: z.number(),
          height: z.number(),
        }),
        z.object({
          url: z.string(),
          width: z.number(),
          height: z.number(),
        }),
      ),
    }),
    title: z.string(),
    channelTitle: z.string(),
    length: z.object({
      simpleText: z.string(),
    }),
  }),
});
export const ValidateSongVoteSchema = z.object({
  type: z.literal("voteSong"),
  roomId: z.string().min(6).max(6),
  songToVoteId: z.string(),
});
export const ValidatePlayNextSongSchema = z.object({
  type: z.literal("playNext"),
  roomId: z.string().min(6).max(6),
});
export const ValidateSongProgressSchema = z.object({
  type: z.literal("songProgress"),
  roomId: z.string().min(6).max(6),
  track: z.object({
    isPlaying: z.boolean(),
    currentSongProgress: z.number().optional(),
    currentSongDuration: z.number().optional(),
    currentSongProgressINsecond: z.number().optional()
  }),
});

export type SongSearch = z.infer<typeof SongSearchSchema>;
export type CreateRoom = z.infer<typeof ValidateCreateRoomSchema>;
export type JoinRoom = z.infer<typeof ValidateJoinRoomSchema>;
export type AddSong = z.infer<typeof ValidateAddSongSchema>;
export type VoteSong = z.infer<typeof ValidateSongVoteSchema>;
export type PlayNextSong = z.infer<typeof ValidatePlayNextSongSchema>;
export type SongProgress = z.infer<typeof ValidateSongProgressSchema>;

export type ToWebSocketMessages =
  | CreateRoom
  | JoinRoom
  | SongSearch
  | AddSong
  | VoteSong
  | PlayNextSong
  | SongProgress;

export interface FromWebSocketMessages {
  type:
    | "joined"
    | "error"
    | "songs"
    | "close"
    | "metadata"
    | "success"
    | "queue"
    | "track";
  message?: string;
  metadata?: RoomMetadata;
  queue?: StoreSongs[];
  track?: {
    isPlaying: boolean;
    currentTrack: StoreSongs | undefined;
    currentSongProgress: number | undefined;
    currentSongDuration: number | undefined;
    currentSongProgressINsecond: number | undefined;
  };
}

export interface RoomMetadata {
  room_id: string;
  room_title: string;
  owner_name: string;
  joined_persons: number;
  queue: StoreSongs[];
  track: {
    isPlaying: boolean;
    currentTrack: StoreSongs | undefined;
    currentSongProgress: number | undefined;
    currentSongDuration: number | undefined
    currentSongProgressINsecond: number | undefined
  };
  role: "admin" | "user";
}

export interface StoreSongs extends YoutubeVideoDetails {
  voted: boolean;
  votes: number;
  addedBy: string;
}

export interface YoutubeVideoDetails {
  id: string;
  type: string;
  thumbnail: {
    thumbnails: {
      url: string;
      width: number;
      height: number;
    }[];
  };
  title: string;
  channelTitle: string;
  length: {
    simpleText: string;
  };
}
export interface YoutubeSearchDetails {
  items: [YoutubeVideoDetails];
}

// export interface Song {
//   song_uri: string;
//   name: string;
//   duration_ms: number;
//   artists: string;
//   image_url: string;
//   votes: number;
// }

// export interface SpotifyTrackType {
//   tracks: {
//     items: [
//       {
//         album: {
//           artists: [{ name: string; type: string }];
//           images: [
//             {
//               height: string;
//               width: string;
//               url: string;
//             },
//             {
//               height: string;
//               width: string;
//               url: string;
//             },
//           ];
//           name: string;
//           release_date: string;
//         };
//         artists: [
//           {
//             name: string;
//           },
//         ];
//         duration_ms: number;
//         id: string;
//         is_playable: boolean;
//         name: string;
//         type: string;
//         uri: string;
//       },
//     ];
//   };
// }
