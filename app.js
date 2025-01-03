// app.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const connectDB = require('./db/connectDB');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);  // Initialize Socket.IO

let userSockets = {};
io.on('connection', (socket) => {
    socket.on('userConnected', (userId) => {
        userSockets[userId] = socket.id;
        console.log(`User connected: ${userId}`);
    });
    socket.on('disconnect', () => {
        for (let userId in userSockets) {
            if (userSockets[userId] === socket.id) {
                delete userSockets[userId];
                console.log(`User disconnected: ${userId}`);
                break;
            }
        }
    });
});

app.use((req, res, next) => {
    req.io = io; 
    req.userSockets = userSockets; 
    next();
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
// Server and other routes setup
connectDB();
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/login', (req, res) => res.render('login'));
app.get('/dashboard', (req, res) => {
   
    res.render('dashboard')
});
app.get('/tasks/edit/:id', (req, res) =>{
 
    res.render('edit-task')
});



const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server is running on port ${port}`));
