import { mysqlTable, mysqlSchema, type AnyMySqlColumn, foreignKey, int, varchar, mysqlEnum, decimal, timestamp, date, text, unique } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const accounts = mysqlTable("accounts", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 191 }).notNull(),
	type: mysqlEnum(['CASH','BANK','CREDIT_CARD','WALLET','INVESTMENT']).default('CASH').notNull(),
	balance: decimal({ precision: 15, scale: 2 }).default('0.00').notNull(),
	currency: varchar({ length: 191 }).default('\'IDR\'').notNull(),
	userId: int().notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
	updatedAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
});

export const budgets = mysqlTable("budgets", {
	id: int().autoincrement().notNull(),
	amount: decimal({ precision: 15, scale: 2 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	startDate: date({ mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	endDate: date({ mode: 'string' }).notNull(),
	userId: int().notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	categoryId: int().notNull().references(() => categories.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
	updatedAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
});

export const categories = mysqlTable("categories", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 191 }).notNull(),
	icon: varchar({ length: 191 }).default('NULL'),
	type: mysqlEnum(['INCOME','EXPENSE','TRANSFER']).notNull(),
	userId: int().notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
	updatedAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
});

export const transactions = mysqlTable("transactions", {
	id: int().autoincrement().notNull(),
	amount: decimal({ precision: 15, scale: 2 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	date: date({ mode: 'string' }).default('current_timestamp()').notNull(),
	description: text().default('NULL'),
	type: mysqlEnum(['INCOME','EXPENSE','TRANSFER']).notNull(),
	userId: int().notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	accountId: int().notNull().references(() => accounts.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	categoryId: int().default(0).references(() => categories.id, { onDelete: "set null", onUpdate: "cascade" } ),
	targetAccountId: int().default(0).references(() => accounts.id, { onDelete: "set null", onUpdate: "cascade" } ),
	createdAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
	updatedAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
});

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	email: varchar({ length: 191 }).notNull(),
	password: varchar({ length: 191 }).notNull(),
	name: varchar({ length: 191 }).default('NULL'),
	role: mysqlEnum(['USER','ADMIN']).default('USER').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
	updatedAt: timestamp({ mode: 'string' }).default('current_timestamp()').notNull(),
},
(table) => [
	unique("users_email_key").on(table.email),
]);
