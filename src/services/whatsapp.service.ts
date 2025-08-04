import { config } from "../config/config";
import { whatsAppApi } from "../utils/axiosInstance";

export function handleWhatsAppMessage(message: any, value: any) {
  const from = message.from; // Phone number
  const messageBody = message.text?.body;
  const messageType = message.type;

  console.log(`WhatsApp message from ${from}: ${messageBody}`);

  // Send reply
  sendWhatsAppMessage(from, "Hello i am mef assistant");
}

export async function sendWhatsAppMessage(to: any, messageText: any) {
  const phoneNumberId = config.whatsAppPhoneId;
  //   const accessToken = config.whatsAppAccessToken;

  //   const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;

  const data = {
    messaging_product: "whatsapp",
    to: to,
    text: { body: messageText },
  };

  // fetch(url, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then((response) => response.json())
  //   .then((data) => console.log("WhatsApp message sent:", data))
  //   .catch((error) => console.error("Error:", error));
  try {
    await whatsAppApi.post(`/${phoneNumberId}/messages`, data);
  } catch (error) {
    console.error("Send Api error:", error);
  }
}
