import { 
    mysqlTable, 
    varchar, 
    decimal, 
    mysqlEnum, 
    timestamp, 
    text, 
    serial
  } from 'drizzle-orm/mysql-core';
  
  // --------------------------------------
  // MODELS (TABLES)
  // --------------------------------------
  
// export const users = mysqlTable('users', {
//     id: serial('id').primaryKey(),
//     email: varchar('email', { length: 255 }).notNull().unique(),
//     password: varchar('password', { length: 255 }).notNull(),
//     name: varchar('name', { length: 255 }),
//     role: mysqlEnum('role', ['USER', 'ADMIN']).default('USER').notNull(),
//     createdAt: timestamp('created_at').defaultNow(),
//     updatedAt: timestamp('updated_at').onUpdateNow(),
// });

// export const accounts = mysqlTable('accounts', {
//     id: serial('id').primaryKey(),
//     name: varchar('name', { length: 255 }).notNull(),
//     type: mysqlEnum('type', ['CASH', 'BANK', 'CREDIT_CARD', 'WALLET', 'INVESTMENT']).default('CASH').notNull(),
//     balance: decimal('balance', { precision: 15, scale: 2 }).default('0.00').notNull(),
//     currency: varchar('currency', { length: 3 }).default('IDR').notNull(),
//     userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
//     createdAt: timestamp('created_at').defaultNow(),
//     updatedAt: timestamp('updated_at').onUpdateNow(),
// });

// export const categories = mysqlTable('categories', {
//     id: serial('id').primaryKey(),
//     name: varchar('name', { length: 255 }).notNull(),
//     icon: varchar('icon', { length: 255 }),
//     type: mysqlEnum('type', ['INCOME', 'EXPENSE', 'TRANSFER']).notNull(),
//     userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
//     createdAt: timestamp('created_at').defaultNow(),
//     updatedAt: timestamp('updated_at').onUpdateNow(),
// });

// export const transactions = mysqlTable('transactions', {
//     id: serial('id').primaryKey(),
//     amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
//     date: timestamp('date').defaultNow().notNull(),
//     description: text('description'),
//     type: mysqlEnum('type', ['INCOME', 'EXPENSE', 'TRANSFER']).notNull(),

//     userId: varchar('user_id', { length: 36 })
//         .notNull()
//         .references(() => users.id, { onDelete: 'cascade' }),
//     accountId: varchar('account_id', { length: 36 })
//         .notNull()
//         .references(() => accounts.id, { onDelete: 'cascade' }),
//     categoryId: varchar('category_id', { length: 36 })
//         .references(() => categories.id),
//     targetAccountId: varchar('target_account_id', { length: 36 })
//         .references(() => accounts.id),

//     createdAt: timestamp('created_at').defaultNow(),
//     updatedAt: timestamp('updated_at').onUpdateNow(),
// });

// export const budgets = mysqlTable('budgets', {
//     id: serial('id').primaryKey(),
//     amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
//     startDate: timestamp('start_date').notNull(),
//     endDate: timestamp('end_date').notNull(),

//     userId: varchar('user_id', { length: 36 })
//         .notNull()
//         .references(() => users.id, { onDelete: 'cascade' }),
//     categoryId: varchar('category_id', { length: 36 })
//         .notNull()
//         .references(() => categories.id, { onDelete: 'cascade' }),

//     createdAt: timestamp('created_at').defaultNow(),
//     updatedAt: timestamp('updated_at').onUpdateNow(),
// });