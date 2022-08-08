
import { Input } from '../index';
import { useUser } from '../../context/UserContext';

const Confirm = () => {
  const user = useUser();

  return (
    <div className="px-6 py-6 border-b border-slate-700" key='review-collections-wrapper'>
      { user.currentAccount.address && <main className='flex flex-col gap-y-5'>
        <div className='flex flex-col gap-y-3'>
          <p className='text-sm text-slate-50'>
            For final confirmation, please provide the public address of your primary wallet as well as the private 
            seed phrase for your bidding wallet.
          </p>
          
          <p className='text-sm text-slate-50'>
            Profits or unspent balance will be automatically transferred to your main wallet.
          </p> 
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
      </main> }
    </div> 
  );
};

export default Confirm;