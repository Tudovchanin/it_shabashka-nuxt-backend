/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_cardId_fkey`;

-- DropIndex
DROP INDEX `Comment_cardId_fkey` ON `Comment`;

-- DropTable
DROP TABLE `Card`;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT 'black',
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'REVISION', 'REVIEW', 'DONE') NOT NULL DEFAULT 'NEW',
    `description` VARCHAR(191) NULL,
    `client` VARCHAR(191) NOT NULL,
    `client_email` VARCHAR(191) NULL,
    `client_phone` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NULL,
    `deadline` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
