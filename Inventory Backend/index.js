import cloudinary from 'cloudinary';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import connectDB from './middleware/db.js';
import { __dirname } from './middleware/file.js';
import routeHandler from './routes/route.js';

dotenv.config();

const { BACKEND_PORT, FRONTEND_URL, CLOUDINARY_APIKEY, CLOUDINARY_NAME, CLOUDINARY_SECRET} = process.env;

const app = express();
connectDB();

app.use(cors({
    origin: [FRONTEND_URL, 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization, x-auth-token',
    credentials: true
}));

cloudinary.v2.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_APIKEY,
    api_secret: CLOUDINARY_SECRET,
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(compression({
  level: 9,
  threshold: 1024
}));

app.use('/', express.static(path.join(__dirname, 'frontend', 'dist')));
app.use('/', routeHandler);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});



mongoose.connection.once('connected', async () => {
    app.listen(BACKEND_PORT, () => {
        console.log(`Server is running on port ${BACKEND_PORT}`);
    });
});