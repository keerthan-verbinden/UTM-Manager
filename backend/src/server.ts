import { createExpressApp } from "./app.js";
import { config } from "./config/index.js";

const app = createExpressApp();
const PORT = config.port || 5000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`UTM Manager Backend running on http://127.0.0.1:${PORT}`);
});
