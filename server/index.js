const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Server is running and MongoDB is connected!');
});

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const courseRoutes = require('./src/routes/courseRoutes');
app.use('/api/courses', courseRoutes);

// const lectureRoutes = require('./src/routes/lectureRoutes');
// app.use('/api/lectures', lectureRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});