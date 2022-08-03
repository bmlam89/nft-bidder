import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { RiAddBoxFill, RiAddBoxLine } from 'react-icons/ri'

const AddToggler = (props) => {
  const [isToggled, setToggle] = useState(props.isAdded);
  const user = useUser();
  const toggleHandler = () => {
    let watchlist = user.currentAccount.watchlist;
    if(isToggled) delete watchlist[props.collection.slug];
    else {
      watchlist[props.collection.slug] = {
        slug: props.collection.slug,
        name: props.collection.name,
        image_url: props.collection.image_url,
        one_day_sales: props.collection.one_day_sales,
        floor_price: props.collection.floor_price,
        seller_fees: props.collection.seller_fees,
        address: props.collection.address
      };
    }
    user.addCollectionToWatchlist({ address: user.currentAccount.address, ethBalance: user.currentAccount.ethBalance, watchlist: watchlist });
    setToggle(!isToggled);
  }
 
  return (
    <button 
      className={ `flex focus:outline-none cursor-default p-.5 items-center rounded` }
      onClick={ () => toggleHandler() }
    >
      { isToggled ? <RiAddBoxFill className='rounded w-6 h-6 text-cyan-500'/> : <RiAddBoxLine className='rounded w-6 h-6 text-slate-500'/> }
    </button>
  )
};

export default AddToggler;