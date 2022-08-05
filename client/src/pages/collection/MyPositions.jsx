import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useParams } from "react-router-dom";
import { VscChevronRight } from 'react-icons/vsc';
import { IconContext } from 'react-icons';
import Web3 from 'web3';
const  web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/6f81495740124909a660eaa5f72961d7'));

const MyPositions = (props) => {
  const [myAssets, setMyAssets] = useState(false);
  const { slug } = useParams();
  const user = useUser();
  const fetchAssets = () => {
    let address = '0x1D9d883B454f0dF4203f9aC07db6fc2f067e5d9a';
    let address1 = '0x011868F79Ec1D599804043b5a48Df551d2e57B57';
    let data = { address }
    fetch(`http://localhost:4000/collection/${slug}/owner-assets`, {
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if(!data.assets.length) {
        setMyAssets(false)
      } else {
        let length = data.assets.length;
        let currentMktVal = props.collection.stats.floor_price * length;
        let previousMktVal = props.collection.timeseries.slice(-1)[0].floor_price * length;
        let allTimeReturnPercent = (currentMktVal - data.avgCost * length) / (data.avgCost * length) * 100;
        let dailyReturnPercent = (currentMktVal - previousMktVal) / previousMktVal * 100;
        setMyAssets({
          assets: data.assets,
          avgCost: data.avgCost,
          length: length,
          floorPrice: props.collection.stats.floor_price,
          currentMktVal: currentMktVal,
          previousMktVal: previousMktVal,
          dailyReturnPercent: dailyReturnPercent,
          allTimeReturnPercent: allTimeReturnPercent,
          next: data.next,
          previous: data.previous
        });
      }
    })
    .catch(error => {
      console.error(error);
      setMyAssets(false);

    });
  }
  useEffect(() => {
    fetchAssets();
  }, []);
  return (
    <>
    { myAssets && user.currentAccount.address && 
    <div key='positions-wrapper' className='flex flex-col px-5'>
      <header className='text-xl font-semibold pt-6 pb-3'>Positions</header>
      <section className='pb-2'>
        <div key='asset-id-labels' className='flex text-gray-500 text-sm'>
          <label className='basis-1/2'>Purchased assets</label>
          <label>ID's</label>
        </div>
        <div key='asset-id-values' className='flex'>
          <p className='basis-1/2'>{ myAssets.assets.length }</p>
          <p className='flex gap-x-2 line-clamp-1'>
              { 
                myAssets.assets.map((asset,idx) => 
                  idx < 2
                  ? <a href='#' key={ `a${idx}` } className='text-base'>{ asset.token_id },  </a>
                  : idx === 2 
                  ? <a href='#' key={ `a${idx}` } className='text-base'>{ asset.token_id }</a>
                  : ''
                )
              }
              { 
                myAssets.assets.length > 3 && 
                (
                  <IconContext.Provider value={{ className: 'text-base h-4 w-4' }}>
                    <a href='#' className='flex items-center'><span className='relative right-1'>...</span>< VscChevronRight/></a>
                  </IconContext.Provider>
                )
              }
            </p>
        </div>
      </section>

      <section className='pb-2'>
        <div key='avg-total-labels' className='flex text-gray-500 text-sm'>
          <label className='basis-1/2'>Avg cost</label>
          <label className='basis-1/2 text-gray-500 text-sm'>Total cost</label>
        </div>
        <div key='avg-total-values' className='flex'>
          <span className='flex basis-1/2'>
            <img className='w-4 h-4 self-center' src={ myAssets.assets[0].last_sale.payment_token.image_url } />
            { myAssets.avgCost.toFixed(2) }
          </span>
          <span className='flex basis-1/2'>
            <img className='w-4 h-4 self-center' src={ myAssets.assets[0].last_sale.payment_token.image_url } />
            { +(myAssets.avgCost * myAssets.length).toFixed(2) }
          </span>
        </div>
      </section>

      <section className='pb-3'>
        <div key='avg-total-labels' className='flex text-gray-500 text-sm'>
          <label className='basis-1/2'>Floor price</label>
          <label className='basis-1/2 text-gray-500 text-sm'>Current mkt value</label>
        </div>
        <div key='avg-total-values' className='flex'>
          <span className='flex basis-1/2'>
            <img className='w-4 h-4 self-center' src={ myAssets.assets[0].last_sale.payment_token.image_url } />
            { +myAssets.floorPrice.toFixed(3) }
          </span>
          <span className='flex'>
            <img className='w-4 h-4 self-center' src={ myAssets.assets[0].last_sale.payment_token.image_url } />
            { +myAssets.currentMktVal.toFixed(2) }
          </span>
        </div>
      </section>
      
      <section className='pb-6'>
        <div key='24h-allTime-return' className='flex flex-col gap-y-1'>
          <span className='flex border-b border-gray-500'>
            <p className='text-gray-500 text-sm basis-1/2'>Last 24h</p>
            <span key='24h-eth-text' className='flex basis-1/2 place-content-end'>
              { myAssets.currentMktVal - myAssets.previousMktVal < 0  ? '-' : '+' }
              <img className='w-4 h-4 self-center' src={ myAssets.assets[0].last_sale.payment_token.image_url } />
              <p>{ (myAssets.currentMktVal - myAssets.previousMktVal < 0 ? -1 : 1 ) * (myAssets.currentMktVal - myAssets.previousMktVal).toFixed(2) }</p>
              <span className=
                {
                  myAssets.dailyReturnPercent  > 0
                  ? ' text-green-700 ml-2' 
                  : myAssets.dailyReturnPercent < 0
                  ? ' text-red-700 ml-2'
                  : ' text-gray-700 ml-2'
                }
              >
                ({ (myAssets.dailyReturnPercent < 0 ? '-' : '+') + +myAssets.dailyReturnPercent.toFixed(2) }%)
              </span>
            </span>
          </span>
          <span className='flex'>
            <p className='text-gray-500 text-sm basis-1/2'>All time</p>
            <span key='allTime-eth-text' className='flex basis-1/2 place-content-end'>
              { myAssets.currentMktVal - myAssets.avgCost < 0 ?  '-' : '' }
              <img className='w-4 h-4 self-center' src={ myAssets.assets[0].last_sale.payment_token.image_url } />
              <p>{ (myAssets.currentMktVal - myAssets.avgCost < 0 ? -1 : 1) * (myAssets.currentMktVal - myAssets.avgCost * myAssets.length).toFixed(2) }</p>
              <span className=
                {
                  myAssets.allTimeReturnPercent  > 0
                  ? ' text-green-700 ml-2' 
                  : myAssets.allTimeReturnPercent < 0
                  ? ' text-red-700 ml-2'
                  : ' text-gray-700 ml-2'
                }
              >
                ({ +myAssets.allTimeReturnPercent.toFixed(2) }%)
              </span>
            </span>
          </span>
        </div>
      </section>
    </div>
    }
    </>
  )
};

export default MyPositions;