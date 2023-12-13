const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();
app.use(express.json());

// TODO: Changed to process.env.NODE_ENV
// Development logging with Morgan
if (process.env.NODEENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(
  cors({
    origin: '*',
  })
);

app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Welcome to the Job Search API',
  });
});

// Mount routers

const userRouter = require('./routes/userRoutes');
const balanceRouter = require('./routes/balanceRoutes');

app.use('/api/v1/user', userRouter);
app.use('/api/v1/balance', balanceRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
