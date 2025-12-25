import 'dotenv/config'
import app from './app.js'
import { db } from './config/dbConfig.js'; // Gunakan ekstensi .js karena kita pakai NodeNext
import { users } from './models/schema.js';

const port = Number(process.env.PORT_BE) || 5000

app.listen(port, () => {
    console.log(`Server run on port http://localhost:${port}`);
})


console.log("Mencoba cek koneksi database...");
const allUsers = await db.select().from(users);
console.log("Koneksi aman! Data user:", allUsers);