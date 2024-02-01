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

            console.log('Fetching system data for name:', lowercaseQuery);

            if (shipDataCache.has(lowercaseQuery)) {
                console.log('System data found in cache');

                const cachedData = shipDataCache.get(lowercaseQuery);
                res.status(200).json(cachedData);
            } else {
                console.log('Searching for system with name:', lowercaseQuery.toLowerCase());
                const shipData = await Ship.findOne({ name: lowercaseQuery.toLowerCase() }).lean();
                console.log('Database query result:', shipData);

                if (shipData) {
                    console.log('System found in the database');
                    shipDataCache.set(lowercaseQuery, shipData);
                    res.status(200).json(shipData);
                } else {
                    console.log('System not found in the database');

                    const externalApiResponse = await axios.get(
                        `https://api.starcitizen-api.com/t4s8f43ILSxCRvUPiXbfWmVifYTYEzN1/v1/cache/starmap/star-system?code=${encodeURIComponent(lowercaseQuery)}`
                        );

                    if (externalApiResponse.status === 200 && externalApiResponse.data) {
                        console.log('Saving system data to the backend:', lowercaseQuery);
                        const savedShipData = await saveShipData(externalApiResponse.data);
                        shipDataCache.set(lowercaseQuery, savedShipData);
                        res.status(200).json(savedShipData);
                    } else {
                        console.log('System not found in the external API');
                        res.status(404).json({ error: 'System not found in the external API' });
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching system data:', error);
            res.status(500).json({ error: 'Could not fetch system data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}



async function saveShipData(shipData: ShipData) {
    try {
        


        console.log(chalk.blue('System data saved to the database.'));
        return shipData;
    } catch (error) {
        console.error('Error saving system data:', error);
        throw error;
    }
}
