import { MessageEvent, PostbackEvent, MessageResponse } from "../types/webhook";
import { config } from "../config/config";
import { getQueryResponse } from "./query.service";
import { getCarouselTemplate } from "../utils/getCarouselTemplate";
import api from "../utils/axiosInstance";

export async function handleMessage(senderId: string, message: MessageEvent) {
  let response: MessageResponse;

  if (message.text === "show faqs") {
    response = getCarouselTemplate();
  } else {
    const mefAnswer = await getQueryResponse(message.text!);
    response = { text: mefAnswer };
  }
  await sendMessage(senderId, response);
}

export async function handlePostback(
  senderId: string,
  postback: PostbackEvent
) {
  let response: MessageResponse;
  const mefAnswer = await getQueryResponse(postback.title);
  response = { text: mefAnswer };

  await sendMessage(senderId, response);
}

export async function sendMessage(senderId: string, response: MessageResponse) {
  const body = {
    recipient: { id: senderId },
    message: response,
  };

  try {
    await api.post(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${config.pageAccessToken}`,
      body
    );
    console.log("Message sent!");
  } catch (error) {
    console.error("Send API error:", error);
  }
}
