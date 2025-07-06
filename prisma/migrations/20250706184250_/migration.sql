-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_cardId_fkey`;

-- DropIndex
DROP INDEX `Card_userId_fkey` ON `Card`;

-- DropIndex
DROP INDEX `Comment_cardId_fkey` ON `Comment`;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
