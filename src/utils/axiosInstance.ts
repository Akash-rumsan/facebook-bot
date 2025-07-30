import axios from "axios";
import { config } from "../config/config";

export const facebookApi = axios.create({
  baseURL: config.facebookGraphApiBase,
});

export const botApi = axios.create({
  baseURL: config.botApiBase,
});
