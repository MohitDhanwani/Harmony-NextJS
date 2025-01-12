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
ALTER TABLE "upvote" ADD CONSTRAINT "upvote_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videoDetails"("videoid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upvote" ADD CONSTRAINT "upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
