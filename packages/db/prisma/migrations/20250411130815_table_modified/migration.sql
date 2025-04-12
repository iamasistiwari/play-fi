/*
  Warnings:

  - Changed the type of `created_At` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `joinedAt` on the `RoomUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `addedTime` on the `Song` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "created_At",
ADD COLUMN     "created_At" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "RoomUser" DROP COLUMN "joinedAt",
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "addedTime",
ADD COLUMN     "addedTime" TIMESTAMP(3) NOT NULL;
