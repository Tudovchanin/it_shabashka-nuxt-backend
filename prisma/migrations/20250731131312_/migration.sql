/*
  Warnings:

  - You are about to drop the column `cardId` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_cardId_fkey`;

-- DropIndex
DROP INDEX `Comment_cardId_fkey` ON `Comment`;

-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `cardId`,
    ADD COLUMN `projectId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
