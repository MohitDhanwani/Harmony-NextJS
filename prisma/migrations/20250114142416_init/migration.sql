-- CreateTable
CREATE TABLE "UserDetails" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomDetails" (
    "roomID" SERIAL NOT NULL,
    "roomName" TEXT NOT NULL,
    "roomPassword" TEXT NOT NULL,
    "roomGenre" TEXT NOT NULL,
    "userID" SERIAL NOT NULL,

    CONSTRAINT "RoomDetails_pkey" PRIMARY KEY ("roomID")
);

-- CreateTable
CREATE TABLE "videoDetails" (
    "videoid" SERIAL NOT NULL,
    "videoName" TEXT NOT NULL,
    "videoURL" TEXT NOT NULL,
    "videoIdUser" SERIAL NOT NULL,
    "videoCreatedInsideRoom" INTEGER NOT NULL,

    CONSTRAINT "videoDetails_pkey" PRIMARY KEY ("videoid")
);

-- CreateTable
CREATE TABLE "upvote" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "upVoteDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "upvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "upvote_videoId_userId_key" ON "upvote"("videoId", "userId");

-- AddForeignKey
ALTER TABLE "RoomDetails" ADD CONSTRAINT "RoomDetails_userID_fkey" FOREIGN KEY ("userID") REFERENCES "UserDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videoDetails" ADD CONSTRAINT "videoDetails_videoIdUser_fkey" FOREIGN KEY ("videoIdUser") REFERENCES "UserDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upvote" ADD CONSTRAINT "upvote_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videoDetails"("videoid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upvote" ADD CONSTRAINT "upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
