import mongoose from 'mongoose';
require('dotenv').config();
const dbName = 'WebSearch'; 
const collectionName = 'ships'; 

const connectDB = async () => {
  try {
    const uri = process.env.DATABASE_URL;

    await mongoose.connect(String(uri), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    } as mongoose.ConnectOptions); 

    console.log(`Connected to MongoDB database: ${dbName}`);

    mongoose.connection.once('open', () => {
      mongoose.connection.db.collection(collectionName).createIndex({ name: 1 }, { background: true });
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectDB;
