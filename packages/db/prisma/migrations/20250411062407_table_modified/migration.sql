/*
  Warnings:

  - You are about to drop the column `id` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the `_JoinedRooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_roomId_fkey";

-- DropForeignKey
ALTER TABLE "_JoinedRooms" DROP CONSTRAINT "_JoinedRooms_A_fkey";

-- DropForeignKey
ALTER TABLE "_JoinedRooms" DROP CONSTRAINT "_JoinedRooms_B_fkey";

-- DropIndex
DROP INDEX "Song_id_key";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "id",
DROP COLUMN "roomId",
ADD CONSTRAINT "Song_pkey" PRIMARY KEY ("songId");

-- DropTable
DROP TABLE "_JoinedRooms";

-- CreateTable
CREATE TABLE "RoomUser" (
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "joinedAt" INTEGER NOT NULL,

    CONSTRAINT "RoomUser_pkey" PRIMARY KEY ("userId","roomId")
);

-- CreateTable
CREATE TABLE "_RoomToSong" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RoomToSong_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RoomToSong_B_index" ON "_RoomToSong"("B");

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomToSong" ADD CONSTRAINT "_RoomToSong_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("roomId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomToSong" ADD CONSTRAINT "_RoomToSong_B_fkey" FOREIGN KEY ("B") REFERENCES "Song"("songId") ON DELETE CASCADE ON UPDATE CASCADE;
