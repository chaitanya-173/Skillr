import express from "express";
import { clerkWebhooks } from "../controllers/webhooks.js";

const router = express.Router();

router.post("/clerk", clerkWebhooks);

export default router;
