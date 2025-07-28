import axios from "axios";
import { MessageEvent, PostbackEvent, MessageResponse } from "../types/webhook";
import { config } from "../config/config";
import { getQueryResponse } from "./query.service";

export async function handleMessage(senderId: string, message: MessageEvent) {
  let response: MessageResponse;

  if (message.text === "feedback") {
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Do you like this bot?",
          buttons: [
            { type: "postback", title: "Yes", payload: "yes" },
            { type: "postback", title: "No", payload: "no" },
          ],
        },
      },
    };
  } else {
    const mefAnswer = await getQueryResponse(message.text!);
    response = { text: mefAnswer };
    // response = { text: "Hi, how can I help you?" };
  }

  await sendMessage(senderId, response);
}

export async function handlePostback(
  senderId: string,
  postback: PostbackEvent
) {
  let response: MessageResponse;

  switch (postback.payload) {
    case "yes":
      response = { text: "Thanks!" };
      break;
    case "no":
      response = { text: "Oops, sorry!" };
      break;
    default:
      response = { text: "Hi, how can I help you?" };
      break;
  }

  await sendMessage(senderId, response);
}

export async function sendMessage(senderId: string, response: MessageResponse) {
  const body = {
    recipient: { id: senderId },
    message: response,
  };

  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${config.pageAccessToken}`,
      body
    );
    console.log("Message sent!");
  } catch (error) {
    console.error("Send API error:", error);
  }
}
