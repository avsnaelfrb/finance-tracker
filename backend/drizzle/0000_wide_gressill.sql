-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `accounts` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`type` enum('CASH','BANK','CREDIT_CARD','WALLET','INVESTMENT') NOT NULL DEFAULT '''CASH''',
	`balance` decimal(15,2) NOT NULL DEFAULT '0.00',
	`currency` varchar(191) NOT NULL DEFAULT '''IDR''',
	`userId` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`updatedAt` datetime(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` varchar(191) NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`startDate` datetime(3) NOT NULL,
	`endDate` datetime(3) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`categoryId` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`updatedAt` datetime(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`icon` varchar(191) DEFAULT 'NULL',
	`type` enum('INCOME','EXPENSE','TRANSFER') NOT NULL,
	`userId` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`updatedAt` datetime(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` varchar(191) NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`date` datetime(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`description` text DEFAULT 'NULL',
	`type` enum('INCOME','EXPENSE','TRANSFER') NOT NULL,
	`userId` varchar(191) NOT NULL,
	`accountId` varchar(191) NOT NULL,
	`categoryId` varchar(191) DEFAULT 'NULL',
	`targetAccountId` varchar(191) DEFAULT 'NULL',
	`createdAt` datetime(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`updatedAt` datetime(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`password` varchar(191) NOT NULL,
	`name` varchar(191) DEFAULT 'NULL',
	`role` enum('USER','ADMIN') NOT NULL DEFAULT '''USER''',
	`createdAt` datetime(3) NOT NULL DEFAULT 'current_timestamp(3)',
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `users_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `budgets` ADD CONSTRAINT `budgets_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `budgets` ADD CONSTRAINT `budgets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `categories_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_targetAccountId_fkey` FOREIGN KEY (`targetAccountId`) REFERENCES `accounts`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;
*/