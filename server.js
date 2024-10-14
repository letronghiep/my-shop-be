const app = require("./src/app");
const { createServer } = require("node:http");
const { initSocket, getIO } = require("./src/db/init.socket");
const { Server } = require("socket.io");
// const server = createServer(app);
const PORT = process.env.PORT || 8080;
// const portSocket = 8000;
// const server = createServer(app);
// initSocket(server);

// server.listen(portSocket);
app.listen(PORT, () => {
  console.log(`Server starting with ${PORT}`);
});
