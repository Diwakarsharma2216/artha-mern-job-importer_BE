const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const importLogRoutes = require('./routes/importLogRoutes');
const jobRoutes = require('./routes/jobRoutes');
const errorHandler = require('./middleware/errorHandler');
const startCronJobs = require('./scheduler/cronJobs');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

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
app.use('/api/jobs', jobRoutes);
app.get('/', (_, res) => res.send('API is running...'));

require('./workers/jobProcessor'); 
startCronJobs(); 
app.use(errorHandler); 

const PORT = process.env.PORT || 3000;
server.listen(8080, () => console.log(`Server running on port ${PORT}`));
