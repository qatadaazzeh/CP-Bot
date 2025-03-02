import mongoose from "mongoose";
import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: "../.env" });
const url = process.env.DB_URL

const connectToDatabase = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
        });

        console.log("Database connected!");
    } catch (err) {
        console.error("Failed to connect to the database", err);
        throw err;
    }
};

export default connectToDatabase;
