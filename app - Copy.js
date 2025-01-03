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
const io = socketIo(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

connectDB();
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.get('/tasks/edit/:id', (req, res) => {
    res.render('edit-task');
});

module.exports = { io };
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Example app listening on port ${port}!`));