import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../backend/db';
import Ship, { IShip } from '../../backend/models/ship';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    try {
      type ExternalShipData = {
        name: string;
        description: string;
        manufacturer: {
          name: string;
        };
        soldAt: string;
        locationLabel: string;
        priceLabel: string;
        cargoLabel: string;
        sizeLabel: string;
        focus: string;
        minCrew: number;
        maxCrew: number;
        pledgePriceLabel: string;
        lastPledgePriceLabel: string;
        productionStatus: string;
        storeUrl: string;
        onSale: boolean;
        storeImage: string;
      };

      const externalShipData: ExternalShipData = req.body;

      if (!externalShipData.name || !externalShipData.manufacturer.name) {
        return res.status(400).json({ error: 'Name and manufacturer name are required' });
      }

      const existingShip = await Ship.findOne({ name: externalShipData.name });

      if (existingShip) {
        return res.status(200).json({ message: 'Ship data already exists in the database' });
      }

      const pledgePriceLabel = parseFloat(
        externalShipData.pledgePriceLabel.replace(/[^\d.]/g, '') || '0'
      );

      const priceLabel = (externalShipData.priceLabel.match(/\d+(\.\d+)?/) || [])[0] || '0';
      const price = parseFloat(priceLabel);

      const sizeLabel = parseFloat(externalShipData.sizeLabel) || 0;

      const lastPledgePriceLabel = parseFloat(
        externalShipData.lastPledgePriceLabel.replace(/[^\d.]/g, '') || '0'
      );

      const shipData: Partial<IShip> = {
        name: externalShipData.name,
        description: externalShipData.description,
        manufacturer: { name: externalShipData.manufacturer.name },
        soldAt: externalShipData.soldAt,
        locationLabel: externalShipData.locationLabel,
        priceLabel: price,
        cargoLabel: externalShipData.cargoLabel,
        sizeLabel: sizeLabel,
        focus: externalShipData.focus,
        minCrew: externalShipData.minCrew,
        maxCrew: externalShipData.maxCrew,
        pledgePriceLabel: pledgePriceLabel,
        lastPledgePriceLabel: lastPledgePriceLabel,
        productionStatus: externalShipData.productionStatus,
        storeUrl: externalShipData.storeUrl,
        onSale: externalShipData.onSale,
        storeImage: externalShipData.storeImage,
      };

      const newShip = new Ship(shipData);

      await newShip.save();

      console.log('Ship data saved successfully to the database'); 
      res.status(201).json({ message: 'Ship data saved successfully' });
    } catch (error: any) {
      console.error('Error saving ship data:', error.message); 
      res.status(500).json({ error: 'Could not save ship data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
