import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        if (mongoose.connection.readyState === 2) {
            return;
        }

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI no está definida");
        }

        if (!process.env.DATABASE) {
            throw new Error("DATABASE no está definida");
        }

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DATABASE,
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB conectado correctamente");
    } catch (error) {
        console.error("Error conectando a MongoDB:", error.message);
        throw error;
    }
};

export default connectDB;