const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = require("./routes/users.js");
// import users from "./routes/users.js";

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/users", users);

io.on("connection", (socket) => {
  console.log("WebSocket Client connected");

  socket.on("disconnect", () => {
    console.log("WebSocket Client desconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Backend server live in http://localhost:${PORT}`);
});
