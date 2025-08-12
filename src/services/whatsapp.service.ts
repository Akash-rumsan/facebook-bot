import { config } from "../config/config";
import { whatsAppApi } from "../utils/axiosInstance";
import { getQueryResponse } from "./query.service";

export async function handleWhatsAppMessage(message: any, value: any) {
  const from = message.from; // Phone number
  const messageBody = message.text?.body;
  const messageType = message.type;

  console.log(`WhatsApp message from ${from}: ${messageBody}`);
  if (messageType === "text" && messageBody) {
    try {
      const botResponse = await getQueryResponse(messageBody);
      sendTemplateMessage(from, botResponse);
    } catch (error) {
      console.error("Error processing message:", error);

      await sendTemplateMessage(
        from,
        "Sorry, I encountered an error processing your request. Please try again later."
      );
    }
  }
}

export async function sendWhatsAppMessage(to: any, messageText: any) {
  const phoneNumberId = config.whatsApp.whatsAppPhoneId;

  const data = {
    messaging_product: "whatsapp",
    to: to,
    text: { body: messageText },
  };

  try {
    await whatsAppApi.post(`/${phoneNumberId}/messages`, data);
  } catch (error) {
    console.error("Send Api error:", error);
  }
}
export async function sendTemplateMessage(to: string, responseText: string) {
  const phoneNumberId = config.whatsApp.whatsAppPhoneId;
  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "template",
    template: {
      name: "reply_from_mefqna",
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: responseText,
            },
          ],
        },
      ],
    },
  };
  try {
    await whatsAppApi.post(`/${phoneNumberId}/messages`, data);
  } catch (error) {
    console.error("Template send error:", error);
  }
}
