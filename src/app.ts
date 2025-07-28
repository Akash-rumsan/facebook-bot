import express from "express";
import bodyParser from "body-parser";
import webhookRoutes from "./routes/webhook.routes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/webhook", webhookRoutes);

app.get("/", (_, res) => {
  res.send("Facebook Messenger Bot is running!");
});

export default app;
