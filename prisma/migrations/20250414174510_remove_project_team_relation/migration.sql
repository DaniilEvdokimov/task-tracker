/*
  Warnings:

  - You are about to drop the column `team_id` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_team_id_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "team_id";
