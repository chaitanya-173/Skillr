import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// Load env
dotenv.config();

// Init express
const app = express();

// Connect DB
await connectDB();

// Middleware
app.use(cors());

// Routes
app.get("/", (req, res) => res.send("API is working ✅"));
app.post("/clerk", express.json(), clerkWebhooks);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
