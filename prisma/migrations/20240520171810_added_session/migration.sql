/*
  Warnings:

  - A unique constraint covering the columns `[tx_ref]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `first_name` VARCHAR(191) NULL,
    MODIFY `last_name` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Transaction_tx_ref_key` ON `Transaction`(`tx_ref`);
