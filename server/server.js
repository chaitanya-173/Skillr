import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// initialize express
const app = express();

// connect to db
await connectDB();

// middlewares
app.use(cors());
app.use(express.json()); // for all routes

// 👇 use raw body only for /clerk webhook route
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

app.get("/", (req, res) => res.send("API working"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
