import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react'
import { Link, useLocation, Navigate  } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

const AnimatedFooterNavigation = (props) => {
  const [isVisible, setVisible] = useState(true);
  const [scrollPos, setScrollPos] = useState(window.pageYOffset);
  const user = useUser();
  const location = useLocation();

  const handleScroll = () => {
    let prev = scrollPos;
    let current = window.pageYOffset;
    if (current > prev) {
      setVisible(false);
    } else if(current <= prev) {
      setVisible(true);
    }
    setScrollPos(window.pageYOffset);
  }
  
  const handleWalletRegistration =  () => {
    let options = {
      method: 'POST',
      url: '/register',
      headers: {Accept: 'text/json'},
      data: { 
        address: user.currentAccount.address,
        proxy: user.proxy,
        proxyPK: user.proxyPK
      }
    };

    axios.request(options)
    .then(response => {
      console.log(response,'inside of register before response.data')
      if(response.data) {
        user.setRegisteredSweeperWallet(true);
        user.setActiveSweepers({configs: []});    
        console.log(user,'made it in here for /register');
      }
      console.log(response, 'response inside of /register in animatedFooter');
    })
    .catch(error => console.error(error,'post request error to /register in animatedFooter'));
  }

  const handleSweeperFormSubmission = () => {
    console.log(user,'user inside of AnimatedFooter.jsx for /submit route to backend');
    let confirmedConfigs = [];
    console.log(user.pendingConfigs,'PENDING CONFIGSSS');
    user.pendingConfigs.map(config => {
      confirmedConfigs.push({
        start: (new Date()).toLocaleString(),
        assetQty: config.assetQty.current.value,
        profitTarget: config.profitTarget.current.value,
        frequency: config.frequency.current.value,
        duration: config.duration.current.value,
        collections: config.watchlistCollections.current.value.filter(collection => collection.active).map(collection => {
          return { 
            slug: collection.slug, 
            address: collection.address,
            assets: {}
          }
        })
      })
    });
    let options = {
      method: 'POST',
      url: '/submit',
      headers: {Accept: 'text/json'},
      data: {
        address: user.currentAccount.address,
        proxy: user.proxy,
        proxyPK: user.proxyPK,
        configs: confirmedConfigs
      }
    }
    axios.request(options)
    .then(response => console.log(response,'response inside of /submit'))
    .catch(error => console.error(error,'error inside of runSweeper Client side'))
  }

  useEffect(() => {
    setScrollPos(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [scrollPos]);

  
  return (
    <>
    { user.currentAccount.address && <Transition 
      as='nav'
      show={isVisible} 
      className={ `fixed bottom-0 h-14 w-screen bg-slate-300 border-t border-slate-700 opacity-[.99] z-[1000]` }
      id='nav-transition'
      key='nav-transition' 
      enter={ `transition ease-in-out duration-500 transform delay-500` }
      enterFrom={ `translate-y-[calc(100vh)] ` }
      enterTo={ `-translate-y-[0]` }
      leave={ `transition ease-out duration-400 transform delay-100` }
      leaveFrom={ `translate-y-[calc(100vh)]` }
      leaveTo={ `translate-y-[calc(3rem)]` }

    >
      <nav className='flex w-full h-14'>
        <div className='w-full h-full px-4 py-3 justify-center items-center'>
          { (location.pathname === `/collections/:slug` || location.pathname ==='/') && 
          <Link 
            to={ '/sweeper' } 
            className='flex w-full h-full bg-cyan-500 cursor-default rounded-md justify-center'
          >
            <p className='place-self-center'>Sweep Listings</p>
          </Link> }

          { location.pathname ==='/sweeper' && <>
          { !user.registeredSweeperWallet &&
         
          ( <Link 
              to={ '/sweeper' }
              className='flex w-full h-full bg-cyan-500 rounded-md justify-center items-center'
            >
              <button onClick={() => handleWalletRegistration()}>
                <p className='place-self-center'>Register Wallet</p>
              </button>
            </Link> ) }
          </> }

          { location.pathname ==='/sweeper' && <>
          { user.registeredSweeperWallet &&
          <Link 
            to={ '/sweeper/review' } 
            className='flex w-full h-full bg-cyan-500 cursor-default rounded-md justify-center'
          >
            <p className='place-self-center'>Review Setup</p>
          </Link> }
          </> }
          { location.pathname ==='/sweeper/review' && 
          <Link 
            to={ '/sweeper/confirm' } 
            className='flex w-full h-full bg-cyan-500 cursor-default rounded-md justify-center'
          >
            <p className='place-self-center'>Confirm Bids</p>
          </Link> }
          { location.pathname ==='/sweeper/confirm' && 
          <Link 
            to={ '/sweeper/complete' } 
            className='flex w-full h-full bg-cyan-500 cursor-default rounded-md justify-center'
          >
            <button onClick={() => handleSweeperFormSubmission()}>
              <p className='place-self-center'>Run Sweeper</p>
            </button>
          </Link> }
          { location.pathname ==='/sweeper/complete' && 
          <Link 
            to={ '/' } 
            className='flex w-full h-full bg-cyan-500 cursor-default rounded-md justify-center'
          >
            <p className='place-self-center'>Homepage</p>
          </Link> }
        </div>
      </nav>
    </Transition> }
    </>
  )
}

export default AnimatedFooterNavigation;