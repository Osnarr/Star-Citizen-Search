import React, { useState, useEffect } from 'react';
import axios from 'axios';

{/* TYPES */ }
import { ShipData } from '../types/ShipData.t.ds';
import { SystemData } from '../types/SystemData.t.ds';

import Image from 'next/image';

{/* System & Ship names */ }
import shipNames from '../shipNames.json';
import systemNames from '../systemNames.json';

import { Input, Button, Switch, Card, CardBody, Link, ButtonGroup } from "@nextui-org/react";

import { SearchIconn } from "@/components/icons";


export function Search() {
  const [query, setQuery] = useState('');
  const [shipData, setShipData] = useState<ShipData | null>(null);
  const [SystemData, setSystemData] = useState<SystemData | null>(null);

  const [similarShips, setSimilarShips] = useState<string[]>([]);
  const [similarSystems, setSimilarSystems] = useState<string[]>([]);

  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showAllShips, setShowAllShips] = useState(false);
  const [activeTab, setActiveTab] = useState('ship');
  const [isLoading, setIsLoading] = useState(false);

  const updateSystemData = (data: any) => {
    setSystemData(data);
  }

  let soldAtLocation = 'Unknown location';

  if (shipData && Array.isArray(shipData.soldAt) && shipData.soldAt.length > 0) {
    soldAtLocation = shipData.soldAt[0]?.locationLabel || 'Unknown location';
  }

  let manufacturerName = 'N/A';

  if (shipData) {
    manufacturerName = shipData.manufacturer?.name || 'Unknown';
  }

  interface data {
    name: string;
  }

  { /*  #18181b7d */ }
  const themeCardStyles = {
    backgroundColor: isDarkTheme ? '#1d1d1d' : 'white',
    color: isDarkTheme ? 'white' : 'black',
    borderColor: isDarkTheme ? 'white' : 'black',
  };

  useEffect(() => {
    if (query.trim() === '') {
      setSimilarShips([]);
      setSelectedSuggestion(null);
      return;
    }

    const filteredSuggestions = shipNames.filter((shipName) =>
      shipName.toLowerCase().includes(query.toLowerCase())
    );

    setSimilarShips(filteredSuggestions);
    setSelectedSuggestion(0);
  }, [query]);

  useEffect(() => {
    if (query.trim() === '') {
      setSimilarSystems([]);
      setSelectedSuggestion(null);
      return;
    }

    const filteredSuggestions = systemNames.filter((systemNames) =>
      systemNames.toLowerCase().includes(query.toLowerCase())
    );

    setSimilarSystems(filteredSuggestions);
    setSelectedSuggestion(0);
  }, [query]);

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      let formattedQuery = query;

      if (query.trim() && !showAllShips) {
        formattedQuery = query.replace(/ /g, '-');
      }

      const lowercaseQuery = formattedQuery.toLowerCase();
      const backendResponse = await axios.get(`/api/getship?name=${encodeURIComponent(lowercaseQuery)}`);

      if (backendResponse.status === 200 && backendResponse.data) {
        console.log('Fetching ship data from the backend.');
        setShipData(backendResponse.data);
        setIsLoading(false);
        return;
      }

      const externalApiResponse = await axios.get(
        `https://api.fleetyards.net/v1/models/${encodeURIComponent(lowercaseQuery)}`
      );

      console.log('Checking external API for ship data:', lowercaseQuery);

      if (externalApiResponse.status === 200 && externalApiResponse.data) {
        console.log('Saving ship data to the backend:', lowercaseQuery);

        const saveResponse = await axios.post('/api/saveship', externalApiResponse.data);

        if (saveResponse.data.message === 'Ship data saved successfully') {
          console.log('Ship data saved successfully to the backend.');
        } else {
          console.error('Error saving ship data to the backend.');
        }

        setShipData(externalApiResponse.data);
        setIsLoading(false);
      } else {
        setShipData(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setShipData(null);
      setIsLoading(false);
    }
  };

  const handleSystemSearch = async () => {
    setIsLoading(true);

    try {
      let formattedQuery = query;

      if (query.trim() && !showAllShips) {
        formattedQuery = query.replace(/ /g, '-');
      }

      const lowercaseQuery = formattedQuery.toLowerCase();
      const backendResponse = await axios.get(`/api/getsystem?name=${encodeURIComponent(lowercaseQuery)}`);

      if (backendResponse.status === 200 && backendResponse.data) {
        console.log('Fetching ship data from the backend.');
        updateSystemData(backendResponse.data);
        setIsLoading(false);
        return;
      }

      const externalApiResponse = await axios.get(
        `https://api.starcitizen-api.com/t4s8f43ILSxCRvUPiXbfWmVifYTYEzN1/v1/cache/starmap/star-system?code=${encodeURIComponent(lowercaseQuery)}`
      );

      console.log('Checking external API for ship data:', lowercaseQuery);

      if (externalApiResponse.status === 200 && externalApiResponse.data) {
        console.log('Saving ship data to the backend:', lowercaseQuery);

        const saveResponse = await axios.post('/api/saveship', externalApiResponse.data);

        if (saveResponse.data.message === 'Ship data saved successfully') {
          console.log('Ship data saved successfully to the backend.');
        } else {
          console.error('Error saving ship data to the backend.');
        }

        updateSystemData(externalApiResponse.data);
        setIsLoading(false);
      } else {
        updateSystemData(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      updateSystemData(null);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSimilarShips([]);
    setSelectedSuggestion(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev !== null && prev < similarShips.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev !== null && prev > 0 ? prev - 1 : prev
      );
    } else if (e.key === 'Enter') {
      if (selectedSuggestion !== null && similarShips[selectedSuggestion]) {
        handleSuggestionClick(similarShips[selectedSuggestion]);
      } else {
        handleSearch();
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="loading-spinner">
        <span id="loading-text">Searching</span>
        <span id="loading-dots"></span>
      </div>;
    }


    if (activeTab === 'ship') {
      return (
        <div>
          <div className="flex flex-wrap items-center justify-between md:justify-start gap-2 mt-10">
            <div className="relative flex-grow">


              <Input
                isClearable
                value={query}
                color='warning'
                size='sm'
                variant='bordered'
                placeholder="Enter ship model"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onClear={() => console.log("input cleared")}

                startContent={
                  <SearchIconn className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
              />
            </div>
            <Button onClick={handleSearch}
              color="warning">
              Search
            </Button>
          </div>

          {similarShips.length > 0 && (
            <div className="suggestions">
              {similarShips.map((suggestion, index) => (
                <div
                  key={index}
                  className={`suggestion ${selectedSuggestion === index ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: selectedSuggestion === index ? '#fdab40e5' : 'transparent',
                    color: selectedSuggestion === index ? '#1d1d1d' : '#FDAA40',
                    borderRadius: '4px',
                    marginBottom: '4px',
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}


          {/* Ship data display */}
          {shipData && (
            <Card
              style={{ backgroundColor: '' }}
              className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px] mt-10"


            >
              <CardBody>
                <div className="mt-4">
                  <h2 className="text-xl font-semibold">{shipData.name}</h2>
                  <p>
                    <b>Description:</b> {shipData.description || 'N/A'}
                  </p>
                  <br />
                  <Image
                    className="aboutBot"
                    src={shipData.storeImage}
                    alt={shipData.name}
                    style={{ borderRadius: '10px' }}
                    width={400}
                    height={37}
                  />
                  <br />
                  <p>
                    <b>Manufacturer:</b> {shipData.manufacturer?.name || 'N/A'}
                  </p>
                  <p>
                    <p><b>Station sold at:</b> {soldAtLocation}</p>
                  </p>
                  <p>
                    <b>Ingame Price:</b> {shipData.priceLabel || 'N/A'}
                  </p>
                  <p>
                    <b>Cargo Capacity:</b> {shipData.cargoLabel || 'N/A'}
                  </p>
                  <p>
                    <b>Size:</b> {shipData.sizeLabel || 'N/A'}
                  </p>
                  <p>
                    <b>Focus:</b> {shipData.focus || 'N/A'}
                  </p>
                  <p>
                    <b>Crew Size (min-max):</b> {shipData.minCrew}-{shipData.maxCrew || 'N/A'}
                  </p>
                  <p>
                    <b>Pledge Price:</b> {shipData.pledgePriceLabel || 'N/A'}
                  </p>
                  <p>
                    <b>Sale Price:</b> {shipData.lastPledgePriceLabel || 'N/A'}
                  </p>
                  <p>
                    <b>Flight Status:</b> {shipData.productionStatus || 'N/A'}
                  </p>
                  {shipData.storeUrl && (
                    <p>
                      <b>Pledge Store:</b>  <Link href={shipData.storeUrl} color="warning">Store Link</Link>

                    </p>
                  )}
                  <p>
                    <b>Buyable in Pledge Store: </b>
                    <span className={shipData.onSale ? 'text-green-500' : 'text-red-500'}>
                      {shipData.onSale ? 'True' : 'False'}
                    </span>
                  </p>

                </div>
              </CardBody>
            </Card>


          )
          }
        </div >
      );


    } else if (activeTab === 'system') {
      return (
        <div>
          <div className="flex flex-wrap items-center justify-between md:justify-start gap-2 mt-10">
            <div className="relative flex-grow">


              <Input
                isClearable
                placeholder='Enter system name'

                value={query}
                style={{ color: '' }}
                color='warning'
                size='sm'
                variant='bordered'
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                startContent={
                  <SearchIconn className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
              />
            </div>
            <Button onClick={handleSystemSearch}
              color="warning">
              Search
            </Button>



          </div>



          {similarSystems.length > 0 && (
            <div className="suggestions">
              {similarSystems.map((suggestion, index) => (
                <div
                  key={index}
                  className={`suggestion ${selectedSuggestion === index ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: selectedSuggestion === index ? '#fdab40e5' : 'transparent',
                    color: selectedSuggestion === index ? '#1d1d1d' : '#FDAA40',
                    borderRadius: '4px',
                    marginBottom: '4px',
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}




          {/* System data display below */}
          {SystemData && (
            <Card>
              <CardBody>
                <div className="mt-4">

                  {SystemData?.data?.name ? (
                    <>
                    < h2 className="text-xl font-semibold">{SystemData.data.name}</h2>
                    {console.log('Name:', SystemData.data.name)}

                    </>
                ) : (
                <p>Data not found</p>
                  )}


                <p>
                  <b>Descriptionn:</b> {SystemData?.data?.description || 'N/A'}
                </p>
                <br />
                <Image
                  className="aboutBot"
                  src={SystemData.data?.thumbnail?.images?.product_thumb_large || 'https://cdn.discordapp.com/attachments/1089066701238313021/1092504589976227910/NO_IMAGE.png'}
                  alt={SystemData.data?.name}
                  style={{ borderRadius: '10px' }}
                  width={400}
                  height={37}
                />
                <br />
                <p>
                  <b>Code:</b> {SystemData.data?.code || 'N/A'}
                </p>
                <p>
                  <b>Controlled By:</b> {SystemData.data?.affiliation[0].name || 'Unknown'}
                </p>
                <p>
                  <b>Type:</b> {SystemData.data?.type || 'Unknown'}
                </p>

                <p>
                  <b>Sub Type:</b> {SystemData.data?.subtype ? SystemData.data.subtype?.name : 'Unknown'}
                </p>

                <p>
                  <b>Status:</b> {SystemData.data?.status || 'Unknown'}
                </p>

                <p>
                  <b>Frost Line:</b> {SystemData.data?.frost_line || 'Unknown'}
                </p>

                <p>
                  <b>Position:</b> {`x: ${SystemData.data?.position_x}, y: ${SystemData.data?.position_y}, z: ${SystemData.data?.position_z}`}
                </p>

                <p>
                  <b>Celestial Objects:</b><br />
                  {SystemData.data?.celestial_objects.map((obj: { designation: string; type: string }, index: number) => (
                    <div key={index}>• {obj.designation} ({obj.type})</div>
                  )) || 'Unknown'}
                </p>
              </div>
            </CardBody>
            </Card>
      )
    }

        </div >

      );
}
  };

return (
  <Card className=''>
    <CardBody>
      <div className="min-h-screen flex items-center justify-center " >
        <div className="max-w-md w-full p-6 rounded-lg rounded border-2 border-[#FDAA40]	">
          <h1 className="text-2xl font-semibold mb-4">Search</h1>

          <div className="flex mb-4">
            <ButtonGroup>
              <Button
                className={`flex-grow py-2 ${activeTab === 'ship' ? 'bg-warning text-black' : 'bg-gray-200 text-gray-600'}  `}
                onClick={() => setActiveTab('ship')}
              >
                Ship Model
              </Button>
              <Button
                className={`flex-grow py-2 ${activeTab === 'system' ? 'bg-warning text-black' : 'bg-gray-200 text-gray-600'}  `}
                onClick={() => setActiveTab('system')}
              >
                Star System
              </Button>
            </ButtonGroup>
          </div>

          {renderContent()}
        </div>
      </div>
    </CardBody>
  </Card>



);
}
export default Search;