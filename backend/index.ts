import express, { Application } from 'express';
import connectDB from './db';
import shipRoutes from './routes/ship';
import axios from 'axios';
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000');
import Ship from './models/ship';

connectDB();

app.use(express.json());

app.use('/api/saveship', shipRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const updateShipData = async () => {
    try {
      const response = await axios.get('https://api.fleetyards.net/v1/models');
  
      for (const ship of response.data) {
        await Ship.findOneAndUpdate(
          { name: ship.name },
          ship,
          { upsert: true, new: true }
        );
      }
  
      console.log('Ship data updated successfully');
    } catch (error) {
      console.error('Error updating ship data:', error);
    }
  };
  
  setInterval(updateShipData, 24 * 60 * 60 * 1000);