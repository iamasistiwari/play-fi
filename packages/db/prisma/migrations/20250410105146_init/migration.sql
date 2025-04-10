-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "provider" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "roomId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "roomPassword" TEXT NOT NULL,
    "created_At" TEXT NOT NULL,
    "maxJoinedUser" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "bigImg" TEXT NOT NULL DEFAULT '',
    "smallImg" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL,
    "channelTitle" TEXT NOT NULL,
    "length" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_JoinedRooms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JoinedRooms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Song_id_key" ON "Song"("id");

-- CreateIndex
CREATE INDEX "_JoinedRooms_B_index" ON "_JoinedRooms"("B");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JoinedRooms" ADD CONSTRAINT "_JoinedRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("roomId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JoinedRooms" ADD CONSTRAINT "_JoinedRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
