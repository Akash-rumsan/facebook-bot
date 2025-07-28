import app from "./app";
import dotenv from "dotenv";
import { config } from "./config/config";

// dotenv.config();

const server = app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed.");
  });
});
