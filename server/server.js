import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// initialize express
const app = express();

// connnect to db
await connectDB();

// middlewares
app.use(cors());

app.get("/", (req, res) => res.send("API working"));
app.post("/clerk", express.json(), clerkWebhooks);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});