const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: ['https://quizmaster-oji8.onrender.com', 'http://localhost:5173'], // Add allowed origins here
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests globally

app.use(express.json());

// Serve static files (CSS, JS, images, etc.) from the "public" directory
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  }
}));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/quiz', require('./routes/quiz.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
