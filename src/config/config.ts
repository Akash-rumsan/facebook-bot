import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN!,
  verifyToken: process.env.VERIFY_TOKEN!,
  facebookGraphApiBase: process.env.FACEBOOK_GRAPH_API_BASE!,
  botApiBase: process.env.BOT_API_BASE!,
};
