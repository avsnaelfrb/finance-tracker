import 'dotenv/config'
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise"
import * as schema from "../models/schema.js";

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env file');
  }
  
const poolConnection = mysql.createPool(process.env.DATABASE_URL);
  
export const db = drizzle(poolConnection, {schema: schema, mode: 'default'});