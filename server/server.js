import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import webhookRoutes from "./routes/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";

// Initialize express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get("/", (req, res) => res.send("API working"));
app.use("/webhooks", webhookRoutes);
app.use("/api/educator", express.json(), educatorRouter);

// Connect to database and export the app
async function initializeApp() {
  await connectDB();
  console.log("Database connected!");
  return app;
}

// Export the initialized app for Vercel
export default initializeApp();
