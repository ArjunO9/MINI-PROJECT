const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'UTS Backend is running!' });
});
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/business', require('./routes/business'));
app.use('/api/token', require('./routes/token'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});