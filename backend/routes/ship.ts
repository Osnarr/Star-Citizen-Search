
import { Router, Request, Response } from 'express';
import axios from 'axios';
import Ship, { IShip } from '../models/ship';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const shipName = req.body.name;
    const shipData = await axios.get(
      `https://api.fleetyards.net/v1/models/${encodeURIComponent(shipName.toLowerCase())}`
    );

    if (shipData.data) {
      const requiredFields = [
        'name',
        'description',
        'manufacturer',
        'soldAt',
        'locationLabel',
        'priceLabel',
        'cargoLabel',
        'sizeLabel',
        'focus',
        'minCrew',
        'maxCrew',
        'pledgePriceLabel',
        'lastPledgePriceLabel',
        'productionStatus',
        'storeUrl',
        'onSale',
        'storeImage',
      ];

      const missingFields = requiredFields.filter((field) => !shipData.data[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
      }

      const shipDataToSave = {
        name: shipData.data.name,
        description: shipData.data.description,
        manufacturer: { name: shipData.data.manufacturer.name },
        soldAt: shipData.data.soldAt,
        locationLabel: shipData.data.locationLabel,
        priceLabel: shipData.data.priceLabel,
        cargoLabel: shipData.data.cargoLabel,
        sizeLabel: shipData.data.sizeLabel,
        focus: shipData.data.focus,
        minCrew: shipData.data.minCrew,
        maxCrew: shipData.data.maxCrew,
        pledgePriceLabel: shipData.data.pledgePriceLabel,
        lastPledgePriceLabel: shipData.data.lastPledgePriceLabel,
        productionStatus: shipData.data.productionStatus,
        storeUrl: shipData.data.storeUrl,
        onSale: shipData.data.onSale,
        storeImage: shipData.data.storeImage,
      };
      

      const shipDataWithoutId = { ...shipDataToSave };
      delete (shipDataWithoutId as any)._id;

      const savedShip = await Ship.findOneAndUpdate(
        { name: shipName },
        shipDataWithoutId,
        { upsert: true, new: true }
      );

      if (!savedShip) {
        return res.status(404).json({ error: 'Ship not found or could not be saved' });
      }

      res.status(201).json(savedShip);
    } else {
      res.status(404).json({ error: 'Ship not found' });
    }
  } catch (error) {
    console.error('Error saving/updating ship data:', error);
    res.status(500).json({ error: 'Could not save/update ship data' });
  }
});

export default router;
