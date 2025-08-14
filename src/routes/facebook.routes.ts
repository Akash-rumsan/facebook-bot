import { Router } from "express";
import {
  facebookAuth,
  facebookCallback,
  getProfile,
  handleSignupCallback,
  logout,
  renderSignupPage,
} from "../controllers/facebook.controller";

const router = Router();

router.get("/auth/facebook", renderSignupPage);
router.get("/auth/facebook/callback", handleSignupCallback);
router.get("/profile", getProfile);
router.get("/logout", logout);

export default router;
