const { Server } = require("socket.io");
const { BadRequestError } = require("../core/error.response");

let io;
const initSocket = (server) => {
  io = new Server(server);
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
  });
};

const getIO = () => {
  if (!io) {
    throw new BadRequestError("Socket.IO has not been initialized");
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};
