const axios = require('axios');
const fs = require('fs');

const apiUrl = 'https://api.fleetyards.net/v1/models/';
const jsonFilePath = 'shipNames.json';

const fetchAllShipNames = async () => {
  let allShipNames = [];
  let page = 1;

  while (true) {
    try {
      const response = await axios.get(apiUrl, {
        params: {
          page,
          per_page: 240,
        },
      });

      const shipNamesInPage = response.data.map(ship => ship.name);
      allShipNames = allShipNames.concat(shipNamesInPage);

      if (response.headers.link && response.headers.link.includes('rel="next"')) {
        page++;
      } else {
        break;
      }
    } catch (error) {
      console.error('Error fetching ship names:', error.message);
      break; 
    }
  }

  return allShipNames;
};

const saveShipNamesToFile = async () => {
  try {
    const shipNames = await fetchAllShipNames();
    fs.writeFileSync(jsonFilePath, JSON.stringify(shipNames, null, 2));
    console.log(`Saved ${shipNames.length} ship names to ${jsonFilePath}`);
  } catch (error) {
    console.error('Error saving ship names to file:', error.message);
  }
};

saveShipNamesToFile();
