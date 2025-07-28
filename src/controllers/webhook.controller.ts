import { Request, Response } from "express";
import { config } from "../config/config";
import { WebhookEntry } from "../types/webhook";
import { handleMessage, handlePostback } from "../services/messenger.service";

export async function verifyWebhook(req: Request, res: Response) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === config.verifyToken) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
}

export async function receiveMessage(req: Request, res: Response) {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry as WebhookEntry[]) {
      const event = entry.messaging[0];
      const senderId = event.sender.id;

      if (event.message) {
        await handleMessage(senderId, event.message);
      } else if (event.postback) {
        await handlePostback(senderId, event.postback);
      }
    }

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
}
