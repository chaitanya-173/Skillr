import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

await connectDB(); // Connect to DB

app.use(cors());
app.use(express.json()); // Needed for parsing webhooks

app.get("/", (req, res) => res.send("API working ✅"));
app.post("/clerk", clerkWebhooks); // Webhook handler

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
