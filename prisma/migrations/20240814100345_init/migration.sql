-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "locations" TEXT[],

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finish" TIMESTAMP(3),
    "player" VARCHAR(255),
    "imageid" INTEGER NOT NULL,
    "found" TEXT[],

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_imageid_fkey" FOREIGN KEY ("imageid") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
