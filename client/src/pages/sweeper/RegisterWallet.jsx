import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';
import { Input } from '../index';

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
    <div className="px-6 py-2 border-b border-slate-700 text-justify" key='review-collections-wrapper'>
      <main className='flex flex-col gap-y-8'>
        <div className='flex flex-col gap-y-2 break-words'>
          <p className='text-xl text-black font-bold underline underline-offset-8'>
            Unregisterred Sweeper Wallet! 
          </p>
          <p className='text-base text-slate-500'>
            Unfortunately, there's no way to do any type of automated bidding without sensitive information.
            The process to provide any kind of security is based on the following two wallet system.
          </p>
          <ol className='list-decimal'>
            <li>
              Provide the address and mnemonic of your bid wallet. Since this is very sensitive information, this will have to be a trust based system.
              The mnemonic will be encrypted with a custom hash function.
            </li>
            <li>
              The sweeper will send out offers using your bid wallet.
            </li>
            <li>
              You can choose to have successful purchases automatically listed. If it's bought by another user, the funds will then
              be sent over to your main wallet where we won't have access to any sensitive information.
            </li>
            <li>
              For unsuccessful bids, the amount offered will be automatically sent to your main wallet.
            </li>
          </ol>
        </div>

        <form 
          id='sweeper-setup-form' 
          className='flex flex-col w-full p-2 py-5 gap-y-6 border border-slate-300 rounded-md'
        >
          <Input 
            htmlForNameId='main-public-address'
            inputType='text'
            wrapperClassname='flex flex-col w-full'
            fieldName='Main wallet public address'
            inputPlaceholder={ `${user.currentAccount.address ? user.currentAccount.address : ''}` }
            state={ user.main }
            setState={ user.setMain }
          />
           <Input 
            htmlForNameId='proxy-public-address'
            inputType='text'
            wrapperClassname='flex flex-col w-full'
            fieldName='Bid wallet public address'
            inputPlaceholder={ `${user.currentAccount.address ? user.currentAccount.address : ''}` }
            state={ user.proxy }
            setState={ user.setProxy }
          />
          <Input 
            htmlForNameId='proxy-private-seedphrase'
            inputType='password'
            wrapperClassname='flex flex-col w-full'
            fieldName='Bid wallet private seed phrase'
            state={ user.proxyPK }
            setState={ user.setProxyPK }
          />
        </form>
      </main> 
    </div>) }
    </>
  );
};

export default Register;