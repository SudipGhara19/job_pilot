const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json());


// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/user', require('./src/routes/user.routes'));
app.use('/api/jobs', require('./src/routes/job.routes'));

// Error Middleware
app.use(require('./src/middlewares/error.middleware'));


const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


