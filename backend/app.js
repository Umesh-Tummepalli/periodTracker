import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import quoraRoutes from './routes/quora.js';
import trackerRoutes from './routes/tracker.js';
import userRoutes from './routes/user.js';
import mongooseConnect from "./config/mongoose.js";
import cookieParser from 'cookie-parser';
dotenv.config();
mongooseConnect();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('Period Tracker API is running');
});

app.use('/user', userRoutes);
app.use('/quora', quoraRoutes);
app.use('/tracker', trackerRoutes);


//404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route Not Found", success: false });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});