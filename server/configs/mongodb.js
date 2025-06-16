import mongoose from 'mongoose';

// connect to mongodb 
const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('Database connected'));
  await mongoose.connect(`${process.env.MONGODB_URI}/UpSkillr`);
};

export default connectDB;

