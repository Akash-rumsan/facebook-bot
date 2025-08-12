import axios from "axios";
import { config } from "../config/config";

export const facebookApi = axios.create({
  baseURL: config.facebookGraphApiBase,
});

export const botApi = axios.create({
  baseURL: config.botApiBase,
});
export const whatsAppApi = axios.create({
  baseURL: config.whatsApp.whatsAppBaseApi,
  headers: {
    Authorization: `Bearer ${config.whatsApp.whatsAppAccessToken}`, // fixed token
    "Content-Type": "application/json",
  },
});
