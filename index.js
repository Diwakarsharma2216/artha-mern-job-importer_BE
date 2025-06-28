const express = require("express");
require("dotenv").config();
const http = require("http");
const app = express();
const importLogRoutes = require('./routes/importLogRoutes')
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require("./config/db");
const server = http.createServer(app);

connectDB();
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5050',
    methods: ['GET', 'POST'],
     credentials: true,
  },
});

io.on('connection', socket => {
  console.log('Client connected via Socket.IO');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


module.exports.io = io;

app.use(cors());
app.use(express.json());
app.use('/api', importLogRoutes);

const PORT = process.env.PORT || 3000;

server.listen(8080, () => console.log(`Server running on port ${PORT}`));
