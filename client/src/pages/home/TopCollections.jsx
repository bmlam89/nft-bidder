import { Link } from 'react-router-dom';
import { useNavigation } from '../../context/NavigationContext';
import { useData } from '../../context/DataContext';
import { useUser } from '../../context/UserContext';
import { AddToggler } from '../index';

const TopCollections = () => {
  const isToggled = useNavigation();
  const { topCollections } = useData();
  const user = useUser();

  return(
    <div
      id='top-collections-wrapper'
      key='top-collections-wrapper'
      className={ `${isToggled.dropdown ? 'hidden' : ''}` }
    >
      <section 
        className='pt-4 px-4'
      >
        <header className='flex flex-wrap w-full h-auto items-center  mb-1 px-1'>
          <p className='text-xl font-bold basis-full'>Top Collections</p>
          <p className='text-xs text-slate-500'>Browse by floor price, volume, mkt. cap & more</p>
        </header>
      </section>
      { !topCollections ? 'Loading...'
      : <>
      <div className="overflow-auto overscroll-x-contain hSlider mt-4">
        <div className="flex flex-col shadow ring-1 ring-black ring-opacity-5 md:rounded-lg ">
          <table className="overscroll-x-contain ">
            <thead className="w-full h-full">
              <tr className='whitespace-nowrap z-[100] bg-slate-100 opacity-1'>
                { user.currentAccount.address ? <th scope="col" className="sticky left-0 z-[100] w-[32px] text-left text-sm font-normal bg-slate-100 opacity-1"/> : '' }
                <th scope="col" className={ (user.currentAccount.address ? `left-[40px] ` : `left-0 `) +`sticky z-[100] h-full max-w-[50vw] text-left text-sm font-medium bg-slate-100 opacity-1`}>Collection</th>
                <th scope="col" className="px-4 text-right text-sm font-medium">Floor Price</th>
                <th scope="col" className="px-4 text-right text-sm font-medium">Average Price</th>
                <th scope="col" className="px-4 text-right text-sm font-medium">Sales</th>
                <th scope="col" className="px-4 text-right text-sm font-medium">Volume</th>
                <th scope="col" className="px-4 text-right text-sm font-medium">Market Cap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500">
              { topCollections.map((collection,idx) => 
              <tr key={idx} className='px-2 py-3 z-[100] bg-slate-100 opacity-1'>
                <td className={ (user.currentAccount.address ? `min-w-[40px] ` : `w-0 `) + `pl-2 sticky text-center left-0 z-[100] text-sm bg-slate-100 opacity-1` }>
                  { user.currentAccount.address &&
                    <AddToggler 
                      isAdded={ user.currentAccount.watchlist[collection.slug] ? true : false } 
                      collection={ collection }
                    />
                    
                  }
                </td>

                <td className={ (user.currentAccount.address ? `left-[40px] ` : `left-0 `) + `sticky z-[100] text-sm  opacity-1 bg-slate-100 border-r border-slate-500` }>
                  <div className="flex gap-x-4 pr-3 items-center w-[60vw] h-[90px] max-h-[90px] max-w-[60vw] py-2">
                    <Link 
                      to={ `/collections/${ collection.slug }`}
                      className='flex min-h-[40px] min-w-[40px] h-10 w-10 rounded-full outline outline-slate-500 overflow-hidden'
                    >
                      <img className="min-w-[40px] min-h-[40px]" src={ collection.image_url } alt={ collection.name }/>
                    </Link>
                    <div>
                      <span className='inline'>
                        <Link className="font-bold text-md break-words line-clamp-2" 
                          to={ `/collections/${ collection.slug }` }
                          state={ collection }
                        >
                          { `${idx+1}. ${collection.name}` }
                        </Link>
                      </span>
                      <div className="text-xs text-slate-500 line-clamp-1">No. Tokens: { collection.supply }</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 text-sm text-right">
                  <span className='inline-flex items-center text-center'>
                  <img className='w-4 h-4' src={ collection.payment_token[0].image_url }/>
                  { !collection.floor_price ? 0
                    : collection.floor_price > 1000 ? Number((collection.floor_price/1000).toFixed(1))+'K' 
                    : +collection.floor_price.toFixed(1) }
                  </span>
                </td>  
                <td className="px-4 text-sm text-right">
                  <span className='inline-flex items-center text-center'>
                    <img className='w-4 h-4' src={ collection.payment_token[0].image_url }/>
                    { collection.one_day_average_price }
                  </span>
                </td>
                <td className="px-4 text-sm text-right">
                  { collection.seven_day_sales }
                </td>
                <td className="px-4 text-sm text-right">
                  <span className='inline-flex items-center text-center'>
                    <img className='w-4 h-4' src={ collection.payment_token[0].image_url }/>
                    { collection.seven_day_volume }
                  </span>
                </td>
                <td className="px-4 text-sm text-right">
                  <span className='inline-flex items-center text-center'>
                    <img className='w-4 h-4' src={ collection.payment_token[0].image_url }/>
                    { collection.mkt_cap }
                  </span>
                </td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </> }
    </div>
  )
};

export default TopCollections;