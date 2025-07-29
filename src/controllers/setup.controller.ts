// controllers/setup.controller.ts
import { Request, Response } from "express";
import {
  setupGetStartedButton,
  setupGreeting,
  //   setupPersistentMenu,
} from "../services/messenger.service";

export async function setupMessengerProfile(req: Request, res: Response) {
  console.log("Setting up Messenger profile...");
  try {
    // await setupGetStartedButton();

    await setupGreeting();

    // Set up persistent menu (optional)
    // await setupPersistentMenu();

    res.status(200).json({
      success: true,
      message: "Messenger profile setup completed successfully!",
    });
  } catch (error) {
    console.error("Setup error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to setup messenger profile",
      error: error,
    });
  }
}
