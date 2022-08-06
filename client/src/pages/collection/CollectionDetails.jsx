const CollectionDetails = (props) => {
  const collection = {
    name: props.collection.name,
    image_url: props.collection.image_url,
    description: props.collection.description,
    token_image_url: props.collection.payment_token[0].image_url,
    banner_image_url: props.collection.banner_image_url,
    info: {
      'No. tokens': props.collection.stats.total_supply > 1000 ? +(props.collection.stats.total_supply / 1000).toFixed(2)+'K' : props.collection.stats.total_supply,
      'Avg tkns/owner': +(props.collection.stats.total_supply / props.collection.stats.num_owners).toFixed(1),
      'Daily volume': props.collection.stats.one_day_volume > 1000 ? +(props.collection.stats.one_day_volume / 1000).toFixed(2)+'K' : +props.collection.stats.one_day_volume.toFixed(2),
      'Unique owners': props.collection.stats.num_owners > 1000 ? +(props.collection.stats.num_owners / 1000).toFixed(2)+'K' : props.collection.stats.num_owners,
      '1d avg sale price': props.collection.stats.one_day_average_price > 1000 ? +(props.collection.stats.one_day_average_price / 1000).toFixed(2)+'K' : +props.collection.stats.one_day_average_price.toFixed(2),
      '1w avg sale price': props.collection.stats.seven_day_average_price > 1000 ? +(props.collection.stats.seven_day_average_price / 1000).toFixed(2)+'K' : +props.collection.stats.seven_day_average_price.toFixed(2),
      '1M avg sale price': props.collection.stats.thirty_day_average_price > 1000 ? +(props.collection.stats.thirty_day_average_price / 1000).toFixed(2)+'K' : +props.collection.stats.thirty_day_average_price.toFixed(2),
      'Mkt cap': props.collection.stats.total_supply === 1 && props.collection.stats.seven_day_average_price * props.collection.stats.num_owners > 1000
      ? +(props.collection.stats.seven_day_average_price * props.collection.stats.num_owners / 1000).toFixed(2)+'K'
      : props.collection.stats.total_supply === 1
      ? +(props.collection.stats.seven_day_average_price * props.collection.stats.num_owners).toFixed(2)
      : props.collection.stats.market_cap > 1000 
      ? +(props.collection.stats.market_cap / 1000).toFixed(2)+'K' 
      : +props.collection.stats.market_cap.toFixed(2)
    },
    eth_idx:[2,3,7]
  };
  return (
    <section key='collection-details' className='flex flex-col pt-4 pb-4'>
      <div className='flex overflow-hidden max-h-[80px] items-center'>
        <img src={ collection.banner_image_url } className='w-full h-full'/>
      </div>
      <div key='collection-details-padding-div' className='px-5'>
        <header className='flex justify-between pb-.5 pt-3'>
          <p className='text-xl font-semibold bg-blend-darken'>{ props.collection.name }</p>
        </header>
        <div className='flex pb-4'>
          <p className='text-left text-sm font-light line-clamp-4'>
            { collection.description }
          </p>
        </div>
        <label key='collection-details-stats' className='text-xl'>Stats</label>
        <div className='grid grid-rows-4 grid-flow-col gap-x-4 gap-y-3'>
          { Object.entries(collection.info).map(([label, data],idx) => 
            <div 
              key={ `collection-info-${idx}` }
              className='flex basis-1/2 justify-between border-b border-gray-500 text-sm font-light'
            >
              <p className='text-gray-500'> { label } </p>
              { 
                collection.eth_idx.includes(idx) ? 
                  <span className='inline-flex'>
                    <img className='w-4 h-4' src={ collection.token_image_url }/>
                    <p>{ data }</p> 
                  </span>
                : <p>{ data }</p> 
              }
            </div>
          )}
        </div>
      </div>
    </section>
  )
};

export default CollectionDetails;