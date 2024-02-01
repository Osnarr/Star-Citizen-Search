const axios = require('axios');
const fs = require('fs');

const apiUrl = 'https://api.fleetyards.net/v1/starsystems/';
const jsonFilePath = 'systemNames.json';

const fetchAllSystemNames = async () => {
  let allSystemNames = [];
  let page = 1;

  while (true) {
    try {
      const response = await axios.get(apiUrl, {
        params: {
          page,
          per_page: 60,
        },
      });

      console.log(`Page ${page}: Received ${response.data.length} systems.`);

      const systemNamesInPage = response.data
        .filter(system => system?.name)
        .map(system => system.name);

      allSystemNames = allSystemNames.concat(systemNamesInPage);

      if (response.data.length < 1) {
        break;
      }

      page++;
    } catch (error) {
      console.error('Error fetching system names:', error.message);
      break;
    }
  }

  return allSystemNames;
};

const saveSystemNamesToFile = async () => {
  try {
    const systemNames = await fetchAllSystemNames();
    fs.writeFileSync(jsonFilePath, JSON.stringify(systemNames, null, 2));
    console.log(`Saved ${systemNames.length} system names to ${jsonFilePath}`);
    console.log(systemNames)
  } catch (error) {
    console.error('Error saving system names to file:', error.message);
  }
};

saveSystemNamesToFile();

