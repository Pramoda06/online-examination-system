const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/db');
const seedSampleQuizzes = require('./utils/seedSampleQuizzes');

dotenv.config();
connectDB().then(() => seedSampleQuizzes()).catch((error) => {
  console.error(`Startup failed: ${error.message}`);
});

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Online Quiz Examination API is running.' });
});

app.use('/api/auth', require('./routes/authroutes'));
app.use('/api/questions', require('./routes/questionroutes'));
app.use('/api/quizzes', require('./routes/quizroutes'));
app.use('/api/attempts', require('./routes/attemptroutes'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
