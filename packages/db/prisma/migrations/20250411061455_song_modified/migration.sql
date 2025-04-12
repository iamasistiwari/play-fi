/*
  Warnings:

  - Changed the type of `created_At` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `addedTime` on the `Song` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "created_At",
ADD COLUMN     "created_At" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "addedTime",
ADD COLUMN     "addedTime" INTEGER NOT NULL;
