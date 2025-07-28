import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Types
interface WebhookEntry {
  messaging: MessagingEvent[];
}

interface MessagingEvent {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: MessageEvent;
  postback?: PostbackEvent;
}

interface MessageEvent {
  mid: string;
  text?: string;
  attachments?: Attachment[];
}

interface Attachment {
  type: string;
  payload: {
    url?: string;
  };
}

interface PostbackEvent {
  title: string;
  payload: string;
}

interface MessageResponse {
  text?: string;
  attachment?: any;
  quick_replies?: QuickReply[];
}

interface QuickReply {
  content_type: string;
  title: string;
  payload: string;
}

interface SendAPIRequest {
  recipient: { id: string };
  message: MessageResponse;
}

// Webhook verification
app.get("/webhook", (req: Request, res: Response) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Webhook for receiving messages
app.post("/webhook", (req: Request, res: Response) => {
  const body = req.body;

  // Check this is a page subscription
  if (body.object === "page") {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach((entry: WebhookEntry) => {
      // Get the webhook event. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      const webhook_event = entry.messaging[0];
      console.log(webhook_event, "Webhook event received");

      // Get the sender PSID
      const sender_psid = webhook_event.sender.id;

      // Check if the event is a message or postback and
      // handle it accordingly
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Return a '200 OK' response to all events
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Handles messages events
function handleMessage(
  sender_psid: string,
  received_message: MessageEvent
): void {
  console.log(`Received message from ${sender_psid}:`, received_message);
  let response: MessageResponse;

  // Checks if the message contains text
  if (received_message.text === "feedback") {
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Do you like this bot?",
          buttons: [
            {
              type: "postback",
              title: "Yes",
              payload: "yes",
            },
            {
              type: "postback",
              title: "No",
              payload: "no",
            },
          ],
        },
      },
    };
  } else {
    // Create the payload for a basic text message
    response = {
      text: "Hi, how can I help you?",
    };
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(
  sender_psid: string,
  received_postback: PostbackEvent
): void {
  console.log(`Received postback from ${sender_psid}:`, received_postback);
  let response: MessageResponse;

  // Get the payload for the postback
  const payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === "yes") {
    response = { text: "Thanks!" };
  } else if (payload === "no") {
    response = { text: "Oops,Sorry" };
  } else {
    response = { text: "Hi, how can I help you?" };
  }

  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
async function callSendAPI(
  sender_psid: string,
  response: MessageResponse
): Promise<void> {
  // Construct the message body
  const request_body: SendAPIRequest = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
      request_body
    );
    console.log("Message sent!");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Unable to send message:", error.response?.data);
    } else {
      console.error("Unable to send message:", error);
    }
  }
}

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Facebook Messenger Bot is running!");
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
