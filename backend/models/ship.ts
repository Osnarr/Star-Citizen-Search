import mongoose, { Document } from 'mongoose';

export interface IManufacturer {
  name: string;
}

export interface IShip extends Document {
  name: string;
  description: string;
  manufacturer: IManufacturer;
  soldAt: string;
  locationLabel: string;
  priceLabel: number;
  cargoLabel: string;
  sizeLabel: number;
  focus: string;
  minCrew: number;
  maxCrew: number;
  pledgePriceLabel: number;
  lastPledgePriceLabel: number;
  productionStatus: string;
  storeUrl: string;
  onSale: boolean;
  storeImage: string;
}

const ShipSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true, 
  },
  description: String,
  manufacturer: {
    name: String,
  },
  soldAt: String,
  locationLabel: String,
  priceLabel: {
    type: mongoose.Schema.Types.Mixed, 
  },
  cargoLabel: String,
  sizeLabel: {
    type: mongoose.Schema.Types.Mixed, 
  },
  focus: String,
  minCrew: Number,
  maxCrew: Number,
  pledgePriceLabel: {
    type: mongoose.Schema.Types.Mixed, 
  },
  lastPledgePriceLabel: {
    type: mongoose.Schema.Types.Mixed, 
  },
  productionStatus: String,
  storeUrl: String,
  onSale: Boolean,
  storeImage: String,
});

export default mongoose.models.Ship || mongoose.model<IShip>('Ship', ShipSchema);
