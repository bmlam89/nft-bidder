import { useState, useEffect } from 'react';
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5';
import { VscEllipsis, VscChevronLeft } from 'react-icons/vsc';
import { BsFillGridFill, BsFillSquareFill } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import { LineChart, MyPositions, CollectionDetails, Listings } from '../index';
import { useParams, Link } from "react-router-dom";
import { cyrb53 } from '../../utils/helpers';
import { useNavigation } from '../../context/NavigationContext';
import { useUser } from '../../context/UserContext';

const tabs = ['History', 'Orders', 'Listings'];
const CollectionHomepage = () => {
  const [collection, setCollection] = useState(false);
  const [activeIdx, setActiveIdx] = useState(2);
  const { slug } = useParams();
  const isToggled = useNavigation();
  const user = useUser();
  const fetchCollection = () => {
    fetch(`/collection/${slug}`)
    .then(response => response.json())
    .then(collection => setCollection(collection.data))
  }
  /*const toggleHandler = () => {
    if(toggle) {
      let hashAddress = cyrb53( currentAccount.address, currentAccount.address.slice(-4));
      let watchlistStorage = watchlist
      delete watchlistStorage[slug]
      localStorage.setItem(hashAddress, JSON.stringify(watchlistStorage));
      setWatchlist(watchlistStorage);
      setToggle(false);
    }else if(currentAccount.address) {
      let hashAddress = cyrb53( currentAccount.address, currentAccount.address.slice(-4));
      let watchlistStorage = watchlist
      watchlistStorage[slug] = slug;
      localStorage.setItem(hashAddress, JSON.stringify(watchlistStorage));
      setWatchlist(watchlistStorage);
      setToggle(true);
    }
  }*/
  useEffect(() => {
    fetchCollection();
  },[]);

  /*useEffect(() => {
    console.log(assets,'assets')
    if(currentAccount.address) {
      let hashAddress = cyrb53( currentAccount.address, currentAccount.address.slice(-4));
      let watchlistStorage = JSON.parse(localStorage.getItem(hashAddress));
      if(watchlistStorage) {
        if(slug in watchlistStorage) setToggle(true);
        setWatchlist(watchlistStorage);
      } 
    };

  }, [currentAccount, collection]);*/

  return (
    <div 
      id='collection-homepage-wrapper'
      key='collection-homepage-wrapper'
      className={ `flex flex-col gap-y-3 ${isToggled.dropdown ? 'hidden' : ''}` }
    >
      { collection && <>
        <header className='flex flex-wrap justify-between items-center gap-y-1 px-5 pt-4'>
          <div className='flex flex-col'> 
            <p className='font-bold max-w-[70vw] text-xl break-words line-clamp-2'>{ collection.name }</p>
            <div className='flex'>
              <img className='mt-1 mr-[.5] w-6 h-6' src={ collection.payment_token[0].image_url }/>
              <span className='text-2xl font-semibold text-center'>{ +collection.stats.floor_price.toFixed(2) }</span>
              <span
                className={`place-self-center ml-1 text-sm font-medium
                  ${collection.dailyChange > 0 ? ' text-green-500' : 
                    collection.dailyChange < 0 ? ' text-red-500' : ' text-gray-500'}`
                } 
              >
                { collection.dailyChange > 0 
                  ? '(+'+collection.dailyChange.toFixed(2)+'%)'
                  : '('+collection.dailyChange.toFixed(2)+'%)' }
              </span>
            </div>
          </div>
          <img className='w-12 h-12 place-self-center rounded-full outline outline-slate-500' src={ collection.image_url}/>
        </header>
        <LineChart collection={collection}/>
        { user.currentAccount.address && <MyPositions collection={collection}/> }
        <CollectionDetails collection={collection}/>
        <Listings collection={collection}/>
      </> }
    </div>
  );
};

export default CollectionHomepage;