import dotenv from "dotenv";
import app from "../src/app.js";
import connectDB from "../src/config/db.js";
import { connectRedis } from "../src/config/redis.js";

dotenv.config();

let isConnected = false;

const handler = async (req, res) => {
    try {
        if (!isConnected) {
            await connectDB();
            await connectRedis();
            isConnected = true;
        }

        return app(req, res);
    } catch (error) {
        console.error("Error inicializando servicios:", error.message);

        return res.status(500).json({
            message: "Error inicializando servicios",
            error: error.message
        });
    }
};

export default handler;