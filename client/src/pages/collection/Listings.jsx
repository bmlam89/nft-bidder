import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { VscDiffAdded, VscAdd } from 'react-icons/vsc';
import { getRemainingTime } from '../../utils/helpers.js';
import Web3 from 'web3';
import { set } from 'mongoose';
import axios from 'axios';
import { useData } from '../../context/DataContext';

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/6f81495740124909a660eaa5f72961d7'));


const Listings = () => {
  const { slug } = useParams();
  const [collectionListings, setCollectionListings] = useState([]);
  const dataContext = useData();
  let listings = [];
  let cursor = '';
  const recurringFetch = async () => {
    console.log(listings.length)
    const options = {
      method: 'GET',
      url: `https://api.opensea.io/api/v1/assets?collection_slug=${slug}&order_direction=desc&limit=50&include_orders=true${cursor}`,
      headers: {Accept: 'application/json', 'X-API-KEY': 'c1afc836148e424ca57553b528e965a0'}
    };
    let response = await axios.request(options).then(colRes => colRes);
    let assets = response.data.assets;
    cursor = `&cursor=${response.data.next}`;
    console.log(cursor,'cursor');
    assets.map(asset => {
      if(asset.seaport_sell_orders) listings.push(asset);
    })
    if(listings.length >= 20) {
      clearTimeout(outterTimeout);
      setCollectionListings(listings);
    }
    console.log(listings.length,'listingssss');
  };
  let outterTimeout = setTimeout(recurringFetch, 2000);

  let assets = collectionListings;
  
  /*const fetchCollection = () => {
    fetch(`/collection/listings/${slug}`)
    .then(response => {
      console.log(response,'RESPONSE!!!');
      setCollectionListings(response);
    })
  }*/


  return (
    <div key='asset-listings-div'>
    { collectionListings.length > 0 && <section key='listings' className='flex flex-col gap-y-6 px-5 overflow-y-auto '>
      { collectionListings.map((data,idx) => 
        <div key={ `asset-listings-div-${idx}` }className='flex flex-col w-auto h-auto overflow-hidden'>
          <img 
            src={ data.image_original_url } 
            className='w-auto h-[53vh] object-contain outline outline-slate-50'
          />
          <footer className='flex justify-between w-full h-auto px-4 py-2  border border-slate-50 '>
            <ul className='flex flex-col justify-center'>
              <li className='text-xs'>{ data.collection.name }</li>
              <li className='text-xs'>{  data.name }</li>
            </ul>
                
            <ul className='flex flex-col gap-y-0.5 justify-center'>
              <li className='flex justify-between text-xs'>
                <span className='text-xs text-gray-500'>
                  Ask:
                </span> 
                <span className='flex'>
                  <img src={dataContext.ethImageUrl} className='w-3 h-3.5'/>
                   { 
                    +(web3.utils.fromWei(data.seaport_sell_orders[0].current_price+'','ether'))
                   }
                </span>
              </li> 
              {/* data.buyOrders.length > 0 && <li className='flex justify-between text-xs'>
                <span className='text-xs text-gray-500'>Current bid:</span>
              
                <span className='flex'>
                  <img src={ data.buyOrders[0].paymentTokenContract.imageUrl }
                    className='w-3 h-3.5'
                    alt={ data.buyOrders[0].paymentTokenContract.symbol }
                  />
                  { 
                    +(data.buyOrders[0].currentPrice/Math.pow(10,data.buyOrders[0].paymentTokenContract.decimals)).toFixed(2)
                  }
                </span> 
                </li>*/ }
              <li className='flex gap-x-4 justify-between text-xs'>
                <span className='text-xs text-gray-500'>Ends:</span>
                { getRemainingTime(
                  new Date(data.seaport_sell_orders[0].expiration_time*1000), new Date(Date.now()) )
                }
              </li>
            </ul>
          </footer>
        </div> )}
      </section> }
    </div>
  )
};

export default Listings;