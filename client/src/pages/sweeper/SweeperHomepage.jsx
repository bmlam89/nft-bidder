import { useEffect, useState, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { useLocation, Navigate } from 'react-router-dom';
import { Stepper, Setup, Review, Confirm, Complete, Register } from '../index';
import axios from 'axios';
const SweeperHomepage = () => {
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const location = useLocation();
  const fetchUser = async () => {
    
    let options = {
      method: 'POST',
      url: '/login',
      headers: {Accept: 'text/json'},
      data: { address: user.currentAccount.address }
    }
    console.log(options,'inside fetchUser in sweeper homepage')
    axios.request(options)
    .then(response => {
      if(response.data) {
        user.setActiveSweepers(response.data);
        user.setRegisteredSweeperWallet(true);
        console.log('fetch users from inside of sweeper homepage', user.registeredSweeperWallet,response.data);
      } else {
        console.log(response,'response from /login in sweeper homepage');
      }
    }).catch(error => console.error(error,'post request error to /login sweeper homepage'));
  }

  useEffect(() => {
    fetchUser();
    setLoading(false);
  }, [user.registeredSweeperWallet]);

  return (
    <>
    { !user.registeredSweeperWallet ? <Register/>
    : ( !loading && <div 
      key='sweeper-homepage-wrapper'
      className='flex flex-col w-screen h-auto'
    >
      <header className='flex flex-col  shadow-sm shadow-slate-700 pb-6'>
        <div className='flex w-full h-full px-5 pt-4 pb-3'>
          <span className='flex flex-col w-full h-auto'>
            <p className='text-3xl font-bold'>Sweeper</p>
            <p className='text-sm text-slate-500'>Setup bids then review and run sweeper. </p>
          </span>
        </div>
        <Stepper/>
      </header>
      <section 
        key='collections-watchlist-wrapper'
        className=''
      >
        { location.pathname === '/sweeper' && <Setup/> }
        { location.pathname === '/sweeper/review' && <Review/> }
        { location.pathname === '/sweeper/confirm' && <Confirm/> }
        { location.pathname === '/sweeper/complete' && <Complete/> }
      </section>

    </div> )}
    </>
  )
};

export default SweeperHomepage;