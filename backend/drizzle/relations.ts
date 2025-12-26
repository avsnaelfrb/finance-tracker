import { relations } from "drizzle-orm/relations";
import { users, accounts, categories, budgets, transactions } from "./schema.js";

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