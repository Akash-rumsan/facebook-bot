import app from "./app";
import { config } from "./config/config";

const server = app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
