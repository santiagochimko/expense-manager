import dotenv from "dotenv";
import app from "../src/app.js";
import connectDB from "../src/config/db.js";
import { connectRedis } from "../src/config/redis.js";

dotenv.config();

let isConnected = false;

const handler = async (req, res) => {
    if (!isConnected) {
        await connectDB();
        await connectRedis();
        isConnected = true;
    }

    return app(req, res);
};

export default handler;