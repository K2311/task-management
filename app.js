const express = require('express');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./db/connectDB');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

connectDB();
app.use(express.json());
app.use('/api/users', userRoutes);
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`));