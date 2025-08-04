import { Request, Response } from "express";
import { config } from "../config/config";
import { WebhookEntry } from "../types/webhook";
import { handleMessage, handlePostback } from "../services/messenger.service";
import { handleWhatsAppMessage } from "../services/whatsapp.service";

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
  console.log("recieve message block");
  const body = req.body;
  console.log(body.object, "body object");
  if (body.object === "whatsapp_business_account") {
    console.log("this is triggered");
    // Handle WhatsApp messages
    body.entry.forEach((entry: { changes: any }) => {
      const changes = entry.changes;
      changes.forEach((change: { field: string; value: { messages: any } }) => {
        if (change.field === "messages") {
          const messages = change.value.messages;
          if (messages) {
            messages.forEach((message: any) => {
              handleWhatsAppMessage(message, change.value);
            });
          }
        }
      });
    });
    res.status(200).send("EVENT_RECEIVED");
  } else if (body.object === "page") {
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
