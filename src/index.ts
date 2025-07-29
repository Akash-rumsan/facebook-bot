import app from "./app";
import { config } from "./config/config";
import {
  setupGetStartedButton,
  setupGreeting,
  setupPersistentMenu,
} from "./services/messenger.service";

const server = app.listen(config.port, async () => {
  console.log(`Server is running on port ${config.port}`);
  try {
    await setupGreeting();
    await setupGetStartedButton();
    await setupPersistentMenu();
  } catch (error: unknown) {
    console.error(
      "Error setting up Messenger profile:",
      (error as any).data.error
    );
  }
});
