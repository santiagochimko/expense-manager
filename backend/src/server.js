import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';
import { ensureAdminUser } from './services/adminSeed.service.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

//Conectar a la base de datos
const startServer = async () => {
    try {
        await connectDB();
        await ensureAdminUser();
        await connectRedis();
        
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(`Error al iniciar el servidor:`, error.message);
    }
};

startServer();