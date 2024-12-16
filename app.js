const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();

// Middleware
app.use(express.json());

// Connect to Database
connectDB();

// Basic Route
app.get('/', (req, res) => {
  res.send('Chess Club App is running...');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
