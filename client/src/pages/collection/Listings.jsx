import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { VscDiffAdded, VscAdd } from 'react-icons/vsc';
import { getRemainingTime } from '../../utils/helpers.js';
import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/6f81495740124909a660eaa5f72961d7'));

const Listings = () => {
  const { slug } = useParams();
  const [collectionAssets,setCollectionAssets] = useState([]);
 
  let query=`?next=false`;
  let assets = collectionAssets;
  (function myLoop(iteration, query, assets) {
    
    setTimeout(function() {
      fetch(`/collection/${slug}/listings${query}`)
      .then(response => response.json())
      .then(data => {
        query=`?next=${data.next}`;
        let listings = (Object.keys(data.listings).map(key => data.listings[key])).filter(orders => orders.sellOrders.length);

        let uniqueListings = {};
        let incomingAssets = [];
        listings.map(listing => {
          if(listing.sellOrders.length) {
            if(!uniqueListings[listing.sellOrders[0].asset.tokenId]) {
              uniqueListings[listing.sellOrders[0].asset.tokenId] = listing;
              incomingAssets.push(listing);
            }
          } else {
            console.log(slug,listing,'not finding any sellOrders');
          }
        });
        if(!assets.length) {
          assets = incomingAssets;
          assets.sort((l1,l2) => l1.sellOrders[0].expirationTime - l2.sellOrders[0].expirationTime);
          setCollectionAssets(assets);
          myLoop(iteration+1, query, assets);
        } else if(assets.length <= 40) {
          let collectionAssetsMap = {};
          assets.map(listing => collectionAssetsMap[listing.sellOrders[0].asset.tokenId] = listing);
          incomingAssets.map(listing => {
            if(!collectionAssetsMap[listing.sellOrders[0].asset.tokenId]) collectionAssetsMap[listing.sellOrders[0].asset.tokenId] = listing;
          });
          assets = Object.values(collectionAssetsMap);
          assets.sort((l1,l2) => l1.sellOrders[0].expirationTime - l2.sellOrders[0].expirationTime);
          setCollectionAssets(assets);
          myLoop(iteration+1, query, assets);
        } else {
          assets.sort((l1,l2) => l1.sellOrders[0].expirationTime - l2.sellOrders[0].expirationTime);
          setCollectionAssets(assets);
          return assets; 
        }
      });
    }, 10000) 
  })(1, query, assets);    
  
  useEffect(() => {
    console.log(collectionAssets);
  },[collectionAssets]);

  return (
    <div key='asset-listings-div'>
    { collectionAssets.length > 0 && <section key='listings' className='flex flex-col gap-y-6 px-5 overflow-y-auto bg-gray-800 leading-wide'>
      { collectionAssets.map((data,idx) => 
        <div key={ `asset-listings-div-${idx}` }className='flex flex-col w-auto h-auto overflow-hidden'>
          <img 
            src={ data.sellOrders[0].asset.imageUrl } 
            className='w-auto h-[53vh] object-contain outline outline-slate-50'
          />
          <footer className='flex justify-between w-full h-auto px-4 py-2  border border-slate-50 bg-gray-700'>
            <ul className='flex flex-col justify-center'>
              <li className='text-xs text-gray-300'>{ data.sellOrders[0].asset.collection.name }</li>
              <li className='text-xs'>
                { 
                  data.sellOrders[0].asset.name ? data.sellOrders[0].asset.name 
                  : data.sellOrders[0].asset.tokenId.includes('#') 
                  ? data.sellOrders[0].asset.tokenId
                  : `#${data.sellOrders[0].asset.tokenId}`
                }
              </li>
            </ul>
                
            <ul className='flex flex-col gap-y-0.5 justify-center'>
              <li className='flex justify-between text-xs'>
                <span className='text-xs text-gray-500'>
                  Ask:
                </span> 
                <span className='flex'>
                  <img src={ data.sellOrders[0].paymentTokenContract.imageUrl } className='w-3 h-3.5'/>
                   { 
                    +(data.sellOrders[0].currentPrice/Math.pow(10,data.sellOrders[0].paymentTokenContract.decimals)).toFixed(2)
                   }
                </span>
              </li> 
              { data.buyOrders.length > 0 && <li className='flex justify-between text-xs'>
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
              </li> }
              <li className='flex gap-x-4 justify-between text-xs'>
                <span className='text-xs text-gray-500'>Ends:</span>
                { getRemainingTime(
                  new Date(data.sellOrders[0].expirationTime*1000), new Date(Date.now()) )
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