import express from 'express';
import next from 'next';
import mongoose from 'mongoose'; 
import connectDB from './db';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

connectDB();

const server = express();

app.prepare().then(() => {
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3002;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
