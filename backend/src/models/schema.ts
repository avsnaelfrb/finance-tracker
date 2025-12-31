import { mysqlTable, mysqlSchema, type AnyMySqlColumn, foreignKey, int, varchar, mysqlEnum, decimal, timestamp, date, text, unique, uniqueIndex } from "drizzle-orm/mysql-core"
import { relations, sql } from "drizzle-orm"

export const accounts = mysqlTable("accounts", {
	id: int().autoincrement().notNull().primaryKey(),
	name: varchar({ length: 191 }).notNull(),
	type: mysqlEnum(['CASH','BANK','CREDIT_CARD','WALLET','INVESTMENT']).default('CASH').notNull(),
	balance: decimal({ precision: 15, scale: 2 }).default('0.00').notNull(),
	currency: varchar({ length: 191 }).default('\'IDR\'').notNull(),
	userId: int().notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
}, (table) => [
	uniqueIndex('unique_account_name').on(table.userId, table.name) 
]);

export const budgets = mysqlTable("budgets", {
	id: int().autoincrement().notNull().primaryKey(),
	amount: decimal({ precision: 15, scale: 2 }).notNull(),
	startDate: date({ mode: 'string' }).notNull(),
	endDate: date({ mode: 'string' }).notNull(),
	userId: int().notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	categoryId: int().notNull().references(() => categories.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const categories = mysqlTable("categories", {
	id: int().autoincrement().notNull().primaryKey(),
	name: varchar({ length: 191 }).notNull(),
	icon: varchar({ length: 191 }).default('NULL'),
	type: mysqlEnum(['INCOME','EXPENSE','TRANSFER']).notNull(),
	userId: int().notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const transactions = mysqlTable("transactions", {
	id: int().autoincrement().notNull().primaryKey(),
	amount: decimal({ precision: 15, scale: 2 }).notNull(),
	date: date('date').notNull().default(sql`(CURRENT_DATE)`),
	description: text().default('NULL'),
	type: mysqlEnum(['INCOME','EXPENSE','TRANSFER']).notNull(),
	userId: int().notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	accountId: int().notNull().references(() => accounts.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	categoryId: int().default(0).references(() => categories.id, { onDelete: "set null", onUpdate: "cascade" } ),
	targetAccountId: int().default(0).references(() => accounts.id, { onDelete: "set null", onUpdate: "cascade" } ),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull().primaryKey(),
	email: varchar({ length: 191 }).notNull(),
	password: varchar({ length: 191 }).notNull(),
	name: varchar({ length: 191 }).default('NULL'),
	role: mysqlEnum(['USER','ADMIN']).default('USER').notNull(),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
},
(table) => [
	unique("users_email_key").on(table.email),
]);


export const accountsRelations = relations(accounts, ({one, many}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
	transactions_accountId: many(transactions, {
		relationName: "transactions_accountId_accounts_id"
	}),
	transactions_targetAccountId: many(transactions, {
		relationName: "transactions_targetAccountId_accounts_id"
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(accounts),
	budgets: many(budgets),
	categories: many(categories),
	transactions: many(transactions),
}));

export const budgetsRelations = relations(budgets, ({one}) => ({
	category: one(categories, {
		fields: [budgets.categoryId],
		references: [categories.id]
	}),
	user: one(users, {
		fields: [budgets.userId],
		references: [users.id]
	}),
}));

export const categoriesRelations = relations(categories, ({one, many}) => ({
	budgets: many(budgets),
	user: one(users, {
		fields: [categories.userId],
		references: [users.id]
	}),
	transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({one}) => ({
	account_accountId: one(accounts, {
		fields: [transactions.accountId],
		references: [accounts.id],
		relationName: "transactions_accountId_accounts_id"
	}),
	category: one(categories, {
		fields: [transactions.categoryId],
		references: [categories.id]
	}),
	account_targetAccountId: one(accounts, {
		fields: [transactions.targetAccountId],
		references: [accounts.id],
		relationName: "transactions_targetAccountId_accounts_id"
	}),
	user: one(users, {
		fields: [transactions.userId],
		references: [users.id]
	}),
}));
