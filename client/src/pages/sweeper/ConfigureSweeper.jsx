import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useUser } from '../../context/UserContext';
import { Select, MultiComboSelect } from '../index';
import { GrFormAdd } from 'react-icons/gr';
const SWEEPER_SETUP_LIMIT = 3;
const MAX_RUNNING_SWEEPERS = 10;
const Form = (props) => {
  return (
    <form 
      id={ `sweeper-setup-form-${props.id}` }
      className='flex flex-col p-5 gap-y-6 border border-slate-300 rounded-md'
    >
      <div className='flex justify-between gap-x-4'>
        <span className='flex flex-col basis-2/4 h-auto'>
          <Select
            config={ props.config.assetQty }
            configs={ props.configs }
            stateHandler={ props.stateHandler }
            id={ props.id }

            wrapperClassname='flex flex-col w-full justify-end items-end'
            innerWrapperClassname='w-full'
            inputPlaceholder=''
          />
        </span>
        <span className='flex flex-col basis-2/4 h-auto'>
          <Select
            config={ props.config.profitTarget }
            configs={ props.configs }
            stateHandler={ props.stateHandler }
            id={ props.id }

            wrapperClassname='flex flex-col w-full justify-end items-end'
            inputPlaceholder=''
            inputClassname='focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500'
          />
        </span>         
      </div>
      <div className='flex justify-between gap-x-4'>
        <span className='flex flex-col basis-2/4 h-auto'>
          <Select
            config={ props.config.frequency }
            configs={ props.configs }
            stateHandler={ props.stateHandler }
            id={ props.id }

            wrapperClassname='flex flex-col w-full justify-end items-end'
            inputPlaceholder=''

          />
        </span>   
        <span className='flex flex-col basis-2/4 h-auto'>
          <Select
            config={ props.config.duration }
            configs={ props.configs }
            stateHandler={ props.stateHandler }
            id={ props.id }  

            wrapperClassname='flex flex-col w-full justify-end items-end'
            inputPlaceholder=''
          />
        </span>
      </div>
      <div className='flex justify-between gap-x-4'>
        <span className='flex flex-col w-full h-auto'>
          <MultiComboSelect
            config={ props.config.watchlistCollections }
            configs={ props.configs }
            stateHandler={ props.stateHandler }
            id={ props.id }

            options={ props.config.watchlistCollections } 
            wrapperClassname='flex flex-col w-full justify-end items-end'
            innerWrapperClassname='w-full'
            inputPlaceholder=''
            inputClassname='focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500'
          />
        </span>
        
      </div>
      <p className='text-xs text-slate-50'>*You can select your own values.</p>
    </form>
  )
}

const Setup = () => {
  const [configs, setConfigs] = useState([]);
  const [count, setCount] = useState(1);
  const { ethImageUrl, wEthImageUrl } = useData();
  const user = useUser();
  
  let remainingSweepersAllowed = MAX_RUNNING_SWEEPERS - user.activeSweepers.configs.length + count;
  
  const config = (id) => {
    let watchlist = Object.values(user.currentAccount.watchlist).sort((c1, c2) => c1.floor_price - c2.floor_price);
    watchlist = watchlist.map((data,idx) => 
      ({ 
        name: data.name, 
        imageUrl: data.image_url, 
        floorPrice: data.floor_price,
        sellerFees: data.seller_fees,
        slug: data.slug,
        address: data.address,
        ethImageUrl: ethImageUrl,
        wEthImageUrl: wEthImageUrl,
        active: !idx ? true : false,
      })
    );

    let currentConfig = {
      assetQty: {
        field: 'assetQty',
        label: 'Bids per collection',
        current: {name: '10 nfts', value: 10},
        selectOptions: [ { name: '10 nfts', value: 10, active: true}, { name: '9 nfts', value: 9}, { name: '8 nfts', value: 8}, { name: '7 nfts', value: 7}, { name: '6 nfts', value: 6}, { name: '5 nfts', value: 5}, { name: '4 nfts', value: 4}, { name: '3 nfts', value: 3}, { name: '2 nfts', value: 2}, { name: '1 nft', value: 1} ],
      },
      profitTarget: {
        field: 'profitTarget',
        label: '*Profit target %',
        current: {name: '10%', value: .1},
        selectOptions: [ {name: '10%', value: .1}, {name: '15%', value: .15}, {name: '20%', value: .2}, {name: '25%', value: .25}, {name: '30%', value: .3}, {name: '40%', value: .4}, {name: '50%', value: .5}, {name: '75%', value: .75} ],
      },
      frequency: {
        field: 'frequency',
        label: 'Frequency',
        current: {name: '2 hours', value: 2},
        selectOptions: [ {name: '2 hours', value: 2}, {name: '4 hours', value: 4}, {name: '6 hours', value: 6}, {name: '8 hours', value: 8}, {name: '10 hours', value: 10}, {name: '12 hours', value: 12} ],
      },
      duration: {
        field: 'duration',
        label: 'Duration',
        current: {name: '1 day', value: 24},
        selectOptions: [ {name: '1 day', value: 24}, {name: '2 days', value: 48}, {name: '3 days', value: 72}, {name: '1 week', value: 24*7}, {name: '2 weeks', value: 24*14}, {name: '1 month', value: 24*30} ],
      },
      watchlistCollections: {
        field: 'watchlistCollections',
        label: 'Collections',
        current: {name: watchlist.filter(collection => collection.active === true).map(collection => collection.name).join(', '), value: watchlist },
      }
    }
    return currentConfig;
  };
 
  const handleAddConfig = () => {
    if(remainingSweepersAllowed > 0 && count < SWEEPER_SETUP_LIMIT) {
      console.log('in here');
      let newConfig = config(configs.length);
      let currentConfigs = configs;
      currentConfigs.push(newConfig);
      user.setPendingConfigs(currentConfigs);
      setConfigs(currentConfigs);
      setCount(currentConfigs.length);
    } 
  };

  useEffect(() => {
   if(!configs.length) {
     let configs = [config(0)];
     setConfigs(configs);
     user.setPendingConfigs(configs);
   }
  }, [configs]);

  return (
    <div 
      className="px-5 pb-10 border-b border-slate-700" 
      key='sweeper-setup-wrapper'
    >
      <div className='flex flex-col h-full w-full gap-y-2'>
        <header className="flex w-full justify-between items-baseline py-2 pt-5">
          <p className='font-bold text-xl'>Configurations</p>
          <div className='flex items-baseline gap-x-2'>
            <p className='text-slate-400 text-xs'>add. config</p>
            <button 
              className='flex relative top-1'
              onClick={() => handleAddConfig()}
            >
              <GrFormAdd className='w-6 h-6 bg-cyan-500 rounded-full'/>
            </button>
          </div>
        </header>

        { configs.length && configs.map((config,id) => (
          <Form 
            config={ config }
            configs={ configs }
            id={ id }
            stateHandler={ setConfigs }
            key={ `form-config-${id}` }
          />
        )) }
      </div>
    </div>
  )
};

export default Setup;