import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useUser } from '../../context/UserContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DisplayConfigs = (props) => {
  const metrics = () => {
    let metrics = {};
    let cumulativeProfit = 0;
    let collections = props.config.watchlistCollections.current.value;
    collections.map(collection => {
      if(collection.active === true) {
        let floorPrice = collection.floorPrice;
        let profitTarget = props.config.profitTarget.current.value;
        let sellerFees = collection.sellerFees/10000;
        let sellerFeeAmount = floorPrice * (sellerFees);
        let bid = floorPrice * (1-profitTarget);
        let grossIncome = floorPrice - bid;
        let netIncome = grossIncome - sellerFeeAmount;
        cumulativeProfit += netIncome * props.config.assetQty.current.value;
        metrics[collection.name] = {
          floorPrice,
          profitTarget,
          bid,
          grossIncome,
          sellerFees,
          netIncome
        }
      }
    })
    return({metrics, cumulativeProfit});
  };
  const stats = metrics();
  let collections = props.config.watchlistCollections.current.value;
  const data = useData();
  return (
    <>
    <ul key='display-ul' role="list" className="divide-y divide-slate-200 border-b border-slate-200">
    { collections.map((collection,idx) => 
    <>
      { collection.active && <li 
        key={ `watchlist-collection-li-${idx}-${collection.slug}` } 
        className="flex py-5 justify-between"
      >

        <img src={`${collection.imageUrl}`} className='w-[64px] h-[64px] bg-black rounded place-self-center'/>
        <div className="ml-4 flex flex-col w-full sm:ml-6 gap-y-2">
          <a href='#' className="font-medium text-slate-50 hover:text-slate-500">{`${collection.name}`}</a>
          <div className='flex w-full justify-between gap-x-4'>
            <span className='flex h-full basis-1/2 justify-between align-baseline'>
              <p className='flex basis-1/2 text-sm text-slate-500'>Floor:</p>
              <span className='flex justify-end basis-1/2'>
                <img className='w-5 h-5 inline relative bottom-[1px]'src={ collection.ethImageUrl }/>
                <p className='inline text-slate-50 text-sm'>{ `${ +stats.metrics[collection.name].floorPrice.toFixed(2) }` }</p>
              </span>
            </span>
            <span className='flex h-full basis-1/2 justify-between align-baseline'>
              <p className='flex basis-1/2 text-sm text-slate-500'>Bid:</p>
              <span className='flex justify-end basis-1/2'>
                <img className='w-5 h-5 inline relative bottom-[1px]'src={ collection.wEthImageUrl }/>
                <p className='inline text-slate-50 text-sm'>{ `${ +stats.metrics[collection.name].bid.toFixed(2) }` }</p>
              </span>
            </span>
          </div>
          <div className='flex w-full justify-between gap-x-4'>
            <span className='flex h-full basis-1/2 justify-between align-baseline'>
              <p className='flex basis-1/2 text-sm text-slate-500'>Profit:</p>
              <span className='flex justify-end basis-1/2'>
                <p className='inline text-slate-50 text-sm'>{ +(stats.metrics[collection.name].profitTarget*100).toFixed(2)+'%' }</p>
              </span>
            </span>
            <span className='flex h-full basis-1/2 justify-between align-baseline'>
              <p className='flex basis-1/2 text-sm text-slate-500'>Fees:</p>
              <span className='flex justify-end basis-1/2'>
                <p className='inline text-slate-50 text-sm'>{ +(stats.metrics[collection.name].sellerFees*100).toFixed(2)+'%' }</p>
              </span>
            </span>
          </div>
          <div className='flex w-full justify-between gap-x-4'>
            <span className='flex h-full basis-1/2 justify-between align-baseline'>
              <p className='flex basis-1/2 text-sm text-slate-500'>Gross:</p>
              <span className='flex justify-end basis-1/2'>
                <img className='w-5 h-5 inline relative bottom-[1px]'src={ collection.ethImageUrl }/>
                <p className='inline text-slate-50 text-sm'>{ `${ +stats.metrics[collection.name].grossIncome.toFixed(2) }` }</p>
              </span>
            </span>
            <span className='flex h-full basis-1/2 justify-between align-baseline'>
              <p className='flex basis-1/2 text-sm text-slate-500'>Net:</p>
              <span className='flex justify-end basis-1/2'>
                <img className='w-5 h-5 inline relative bottom-[1px]'src={ collection.ethImageUrl }/>
                <p className='text-slate-50 text-sm'>{ `${ +stats.metrics[collection.name].netIncome.toFixed(2) }` }</p>
              </span>
            </span>
          </div>
          
        </div>
      </li> }
    </>
    )}
    </ul>
    <section key='summary-section' aria-labelledby="summary-heading" className="mt-4">
      <h2 id="summary-heading" className="sr-only">Order summary { `${props.id + 1}` }</h2>
      <div>
        <dl className="space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-base font-medium text-slate-50">Collections</dt>
            <dd className="flex gap-x-2 ml-4 text-base font-medium text-cyan-500">
              <span>{ props.config.watchlistCollections.current.value.filter(collection => collection.active === true).length }</span>
            </dd>
          </div>
        </dl>
        <dl className="space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-base font-medium text-slate-50">Bids</dt>
            <dd className="flex gap-x-2 ml-4 text-base font-medium text-cyan-500">
              <span>{ props.config.assetQty.current.value * props.config.watchlistCollections.current.value.filter(collection => collection.active === true).length }</span>
            </dd>
          </div>
        </dl>
        
        <dl className="space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-base font-medium text-slate-50">Profit potential</dt>
            <dd className="flex gap-x-0.5 ml-4 text-base font-medium text-cyan-500">
              <img className='w-6 h-6 inline relative bottom-[1px]'src={ data.ethImageUrl }/>

              <span>{ +(stats.cumulativeProfit).toFixed(2) }</span>
            </dd>
          </div>
        </dl>
      </div>
    </section> 
    </>
  )
}

const Review = () => {
  const user = useUser();

  return (
    <div className="px-6 py-3 border-b border-slate-700" key='review-collections-wrapper'>
    { <main key='main-review-wrapper'>
        <div key='div-review-collections-wrapper'>
          <p className='text-sm text-slate-50'>
            Please review and confirm that you'd like to sweep the following listings.
          </p>
          {
            user.pendingConfigs.map((config, id) => (
              !id && <DisplayConfigs key={`display-component-${id}`} config={ config } id={ id }/>
            ))
          }
        </div>
      </main> }
    </div>
  )
};

export default Review
