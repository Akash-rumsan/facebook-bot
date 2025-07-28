import express from "express";
import {
  receiveMessage,
  verifyWebhook,
} from "../controllers/webhook.controller";

const router = express.Router();

router.get("/", verifyWebhook);
router.post("/", receiveMessage);

export default router;
