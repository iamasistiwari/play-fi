import z from "zod";

export const ValidateCreateRoomSchema = z.object({
  type: z.literal("create_room"),
  roomId: z.string().min(6).max(6),
  roomTitle: z.string().min(10).max(50),
  roomPassword: z.string().min(8).max(30),
  accessToken: z.string().min(270)
});
export const ValidateJoinRoomSchema = z.object({
  type: z.literal("join_room"),
  roomId: z.string().min(5).max(5),
  roomPassword: z.string().min(8).max(30),
});
export const SongSearchSchema = z.object({
  type: z.literal("searchSongs"),
  roomId: z.string().min(6).max(6),
  song: z.string().min(4)
})

export type SongSearch = z.infer<typeof SongSearchSchema>
export type CreateRoom = z.infer<typeof ValidateCreateRoomSchema>;
export type JoinRoom = z.infer<typeof ValidateJoinRoomSchema>;

export interface FromWebSocketMessages {
  type: "joined" | "error" | "songs";
  message?: string;
}

export type ToWebSocketMessages = CreateRoom | JoinRoom | SongSearch;
