import { MessageEvent, PostbackEvent, MessageResponse } from "../types/webhook";
import { config } from "../config/config";
import { getQueryResponse } from "./query.service";
import { getCarouselTemplate } from "../utils/getCarouselTemplate";
import { facebookApi } from "../utils/axiosInstance";

export async function handleMessage(senderId: string, message: MessageEvent) {
  let response: MessageResponse;

  if (message.text?.toLowerCase() === "show faqs") {
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

  if (postback.payload === "GET_STARTED") {
    response = {
      text: "Welcome! How can I assist you today?",
      quick_replies: [
        {
          content_type: "text",
          title: "Explain MEF",
          payload: "explain_mef",
        },
        {
          content_type: "text",
          title: "Membership types",
          payload: "membership_types",
        },
      ],
    };
  } else {
    const mefAnswer = await getQueryResponse(postback.title);
    response = { text: mefAnswer };
  }

  await sendMessage(senderId, response);
}

export async function sendMessage(senderId: string, response: MessageResponse) {
  const body = {
    recipient: { id: senderId },
    message: response,
  };

  try {
    await facebookApi.post(
      `/messages?access_token=${config.pageAccessToken}`,
      body
    );
  } catch (error) {
    console.error("Send API error:", error);
  }
}
export async function setupGetStartedButton() {
  const body = {
    get_started: {
      payload: "GET_STARTED",
    },
  };

  try {
    await facebookApi.post(
      `/messenger_profile?access_token=${config.pageAccessToken}`,
      body
    );
    console.log("Get Started button configured!");
  } catch (error) {
    console.error("Error setting up Get Started button:", error);
  }
}
export async function clearMessengerProfile() {
  try {
    await facebookApi.delete(
      `/messenger_profile?access_token=${config.pageAccessToken}`,
      {
        data: {
          fields: ["get_started", "greeting", "persistent_menu"],
        },
      }
    );

    console.log("Messenger profile cleared!");
  } catch (error) {
    console.error("Error clearing messenger profile:", error);
  }
}
export async function setupGreeting() {
  const body = {
    greeting: [
      {
        locale: "default",
        text: "Hi! Welcome to our service. Click 'Get Started' to begin!",
      },
    ],
  };

  try {
    await facebookApi.post(
      `/messenger_profile?access_token=${config.pageAccessToken}`,
      body
    );
  } catch (error) {
    console.error("Error setting up greeting:", error);
  }
}

export async function setupPersistentMenu() {
  const body = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "postback",
            title: "Explain MEF",
            payload: "explain_mef",
          },
          {
            type: "postback",
            title: "Membership Types",
            payload: "silver_price",
          },
          {
            type: "postback",
            title: "Mef functions",
            payload: "mef_functions",
          },
        ],
      },
    ],
  };

  try {
    await facebookApi.post(
      `/messenger_profile?access_token=${config.pageAccessToken}`,
      body
    );
    console.log("Persistent menu configured!");
  } catch (error) {
    console.error("Error setting up persistent menu:", error);
  }
}
