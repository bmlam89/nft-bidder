import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
const Complete = () => {
  const location = useLocation();
  const user = useUser();

  return (
    <div 
      key='sweeper-complete-wrapper'
      className='flex px-5 pt-6'
    >
      <p>
        Sweeper is now running. To view current bids, navigate to your <a href="/open-positions" className='text-blue-600'>positions</a> or <a href='https://opensea.io/' className='text-blue-500'> Opensea</a>.
      </p>
    </div>
  )
};

export default Complete;