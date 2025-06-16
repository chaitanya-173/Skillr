import mongoose from 'mongoose';

// Connect to the mongodb database

const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('Database connnected'));
  await mongoose.connect(`${process.env.DB_PATH}`);
}

export default connectDB;