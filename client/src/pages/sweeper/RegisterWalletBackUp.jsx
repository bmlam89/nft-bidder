import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [goBack, setGoBack] = useState(false);
  useEffect(() => {
    if(!user.registeredSweeperWallet) {
      window.onpopstate = () => {
        if(window.location.pathname === '/sweeper/register') {
          window.location.href = 'http://localhost:3000';
          setGoBack(true);
        }
      }
    }
  }, [user.registeredSweeperWallet]);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
 
    {( !loading && user.currentAccount.address && 
    <div className="px-6 py-4 border-b border-slate-700" key='review-collections-wrapper'>
      <main className='flex flex-col gap-y-8'>
        <div className='flex flex-col gap-y-5 break-words'>
          <p className='text-xl text-white font-bold underline underline-offset-8'>
            Unregisterred Sweeper Wallet!
          </p>
          <p className='text-base text-slate-50'>
           We couldn't find your wallet address in our system. Please confirm that the following 
           public address is the one you want to use for automating bids.
          </p>
          <div className='flex flex-col gap-y-2'>
            <p className='text-lg text-slate-50 underline underline-offset-4'>
              Your public address: 
            </p>
            <p className='text-base text-cyan-500'>
              { user.currentAccount.address }
            </p>
          </div>
         
        </div>

       {/* <form 
          id='sweeper-register-form' 
          className='flex flex-col w-full p-2 py-5 gap-y-6 border border-slate-300 rounded-md'
        >
           <Input 
            htmlForNameId='proxy-public-address'
            inputType='text'
            wrapperClassname='flex flex-col w-full gap-y-2'
            labelClassName='text-base'
            fieldName='Bid wallet public address'
            inputPlaceholder={ `${user.currentAccount.address ? user.currentAccount.address : ''}` }
            state={ user.currentAccount.address }
            setState={ user.setProxy }
            register={ true }
          />
       </form>*/}
      </main> 
    </div>) }
    </>
  );
};

export default Register;