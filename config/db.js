const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/week6';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('MongoDB Connected Successfully...');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);  
    }
};

module.exports = connectDB;