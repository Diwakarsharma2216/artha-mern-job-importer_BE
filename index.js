const express = require("express");
require("dotenv").config();
const http = require("http");
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(8080, () => console.log(`Server running on port ${PORT}`));
