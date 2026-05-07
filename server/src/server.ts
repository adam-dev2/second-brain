import http from "http";
import app from "./app.js";
import { initSocketServer } from "./utils/socketManager.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocketServer(server);

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

