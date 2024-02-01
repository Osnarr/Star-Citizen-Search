import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../backend/db';
import Ship from '../../backend/models/ship';
import axios from 'axios';
import mongoose from 'mongoose';
const NodeCache = require('node-cache');
import chalk from 'chalk';

interface ShipData {
    name: string;
    description: string;
    priceLabel: number;
    sizeLabel: number;
    lastPledgePriceLabel: number;
}

connectDB();

const shipDataCache = new NodeCache({ stdTTL: 86400 });

const processingSet = new Set<string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { name } = req.query;
            const lowercaseQuery = (name as string).toLowerCase();

            console.log('Fetching ship data for name:', lowercaseQuery);

            if (shipDataCache.has(lowercaseQuery)) {
                console.log('Ship data found in cache');

                const cachedData = shipDataCache.get(lowercaseQuery);
                res.status(200).json(cachedData);
            } else {
                console.log('Searching for ship with name:', lowercaseQuery.toLowerCase());
                const shipData = await Ship.findOne({ name: lowercaseQuery.toLowerCase() }).lean();
                console.log('Database query result:', shipData);

                if (shipData) {
                    console.log('Ship found in the database');
                    shipDataCache.set(lowercaseQuery, shipData);
                    res.status(200).json(shipData);
                } else {
                    console.log('Ship not found in the database');

                    const externalApiResponse = await axios.get(
                        `https://api.fleetyards.net/v1/models/${encodeURIComponent(lowercaseQuery)}`
                    );

                    if (externalApiResponse.status === 200 && externalApiResponse.data) {
                        console.log('Saving ship data to the backend:', lowercaseQuery);
                        const savedShipData = await saveShipData(externalApiResponse.data);
                        shipDataCache.set(lowercaseQuery, savedShipData);
                        res.status(200).json(savedShipData);
                    } else {
                        console.log('Ship not found in the external API');
                        res.status(404).json({ error: 'Ship not found in the external API' });
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching ship data:', error);
            res.status(500).json({ error: 'Could not fetch ship data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}



async function saveShipData(shipData: ShipData) {
    try {
        const priceLabel = typeof shipData.priceLabel === 'string'
            ? parseFloat((shipData.priceLabel as string).replace(/[^\d.]/g, '')) || 0
            : 0;

        const sizeLabel = typeof shipData.sizeLabel === 'string'
            ? parseFloat((shipData.sizeLabel as string).replace(/[^\d.]/g, '')) || 0
            : 0;

        const lastPledgePriceLabel = typeof shipData.lastPledgePriceLabel === 'string'
            ? parseFloat((shipData.lastPledgePriceLabel as string).replace(/[^\d.]/g, '')) || 0
            : 0;

        const validatedShipData: ShipData = {
            ...shipData,
            priceLabel,
            sizeLabel,
            lastPledgePriceLabel,
        };

        (validatedShipData as any)._id = new mongoose.Types.ObjectId();

        const savedData = await Ship.create(validatedShipData);
        console.log(chalk.blue('Ship data saved to the database.'));
        return shipData; 
    } catch (error) {
        console.error('Error saving ship data:', error);
        throw error; 
    }
}
