/*
  Warnings:

  - You are about to drop the column `addedTime` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the `_RoomToSong` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RoomToSong" DROP CONSTRAINT "_RoomToSong_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomToSong" DROP CONSTRAINT "_RoomToSong_B_fkey";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "addedTime";

-- DropTable
DROP TABLE "_RoomToSong";

-- CreateTable
CREATE TABLE "RoomSong" (
    "roomId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "addedTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomSong_pkey" PRIMARY KEY ("roomId","songId")
);

-- AddForeignKey
ALTER TABLE "RoomSong" ADD CONSTRAINT "RoomSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("songId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomSong" ADD CONSTRAINT "RoomSong_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;
