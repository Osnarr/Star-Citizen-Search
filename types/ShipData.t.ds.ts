export interface ShipData {


    name: string;
    description: string;
    manufacturer: {
        name: string;
    };
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


