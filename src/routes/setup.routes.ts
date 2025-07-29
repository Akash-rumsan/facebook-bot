// routes/setup.routes.ts
import express from "express";
import { setupMessengerProfile } from "../controllers/setup.controller";

const router = express.Router();

router.post("/messenger-profile", setupMessengerProfile);

export default router;
