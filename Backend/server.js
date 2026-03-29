import express from 'express';
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/dbConfig.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});