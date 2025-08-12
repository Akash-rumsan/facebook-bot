import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN!,
  verifyToken: process.env.VERIFY_TOKEN!,
  facebookGraphApiBase: process.env.FACEBOOK_GRAPH_API_BASE!,
  botApiBase: process.env.BOT_API_BASE!,
  whatsApp: {
    whatsAppBaseApi: process.env.WHATSAPP_API_BASE,
    whatsAppAccessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    whatsAppPhoneId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    whatsAppBusinessId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID!,
    appSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
  },
};
