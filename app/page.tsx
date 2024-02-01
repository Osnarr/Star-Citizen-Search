'use client'
import React, { useState, useEffect } from 'react';
import Search from '@/components/search';
import Preloader from '@/components/preloader';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <>
          
          
          <Search />
        </>
      )}
    </>
  );
};

export default Home;