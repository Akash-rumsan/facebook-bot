import { Router } from "express";
import {
  facebookAuth,
  facebookCallback,
  getProfile,
  logout,
} from "../controllers/facebook.controller";

const router = Router();

router.get("/auth/facebook", facebookAuth);
router.get("/auth/facebook/callback", ...facebookCallback);
router.get("/profile", getProfile);
router.get("/logout", logout);

export default router;
