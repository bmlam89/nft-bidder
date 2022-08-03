import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HorizontalSlider } from '../index';
import { useData } from '../../context/DataContext';

const NewCollections = () => {
  const [visibleIdx, setVisibleIdx] = useState(0);
  let { newCollections } = useData();
  
  let intersectionObserverCallback = (entries) => {
    entries.map((entry) => {
      if(entry.isIntersecting) setVisibleIdx(+entry.target.id+1);
    })
  };
  let observers = new IntersectionObserver(entries => intersectionObserverCallback(entries), { threshold: .65 });
  useEffect(() => {
    let htmlEles = document.querySelectorAll('.sliderEle')
    htmlEles.forEach(ele => observers.observe(ele))
  }, []);

  return (
    <div key='new-collections-wrapper'>
      <header className='flex w-full h-auto items-center justify-between mb-1 pt-4  px-5'>
        <p className='text-xl font-bold'>Recently Listed</p>
        <p className='text-sm place-self-end'>{ `View More >` }</p>
      </header>
      <section 
        id='new-nfts-section'
        
      >
        <HorizontalSlider >
          { newCollections && newCollections.map((data,idx) => 
            <div
              id={ `${idx}` }
              key={ `new-nft-card-wrapper${idx}` }
              className='flex flex-col min-w-full h-[40vh] py-1 sliderEle snap-center snap-always snap-mandatory'
            >
              <div className='flex w-full h-3/4'>
                <Link to={ `/collections/${ data.slug }`} >
                { data.banner_src ? (
                  <img
                    className='object-cover w-screen h-full'
                    alt={ data.slug }
                    src={ data.banner_src }
                  /> 
                ) : ( 
                  <div className = 
                    { `outline outline-gray-500 ${ idx % 2 === 0 
                      ? 'w-full h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500'
                      : 'w-full h-full bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500'
                    }`
                  }
                  />
                )}
                </Link>
              </div>
              
              <footer className='h-1/4 flex w-full justify-between px-3 py-1 overflow-hidden outline outline-slate-500'>
                <div 
                  id='footer-logo-and-text-wrapper'
                  className='items-center gap-x-2 h-full flex max-w-[70vw]'
                >
                  <Link to={ `/collections/${ data.slug }`} href={ `/${ data.slug }`}>
                    <img src = { data.image_url } alt={ data.slug } className='min-h-[40px] min-w-[40px] h-10 w-10 rounded-full outline outline-gray-500 object-cover'/>
                  </Link>
                  <ul>
                    <Link to={ `/collections/${ data.slug }`} href={ `/${ data.slug }`}>
                      <li className='text-base font-semibold line-clamp-2'>{ data.name }</li>
                    </Link>
                    <li className='flex text-xs text-gray-500 font-base line-clamp-1'>
                      { `${data.supply} tks | ${data.owners} owners | ${data.elapsed_time}` }
                    </li>
                  </ul>
                </div>
                <div 
                  id='footer-floor-price-wrapper'
                  className='flex max-w-[30vw] items-center'
                >
                  {/*<p className='relative top-[5px] text-xs text-gray-500'>floor:</p>*/}
                  <img src={data.payment_token[0].image_url} className='h-6 w-6'/>
                  <p className='font-medium text-2xl'>
                    { data.floor_price > 1000 ? Number((data.floor_price/1000).toFixed(1))+'K' : +data.floor_price.toFixed(1) }
                  </p>
                </div>
              </footer>
            </div>
          )}
          { newCollections && <div 
            id='banner-pageNumber-wrapper'
            className='py-2 px-3 border text-xs border-gray-500 bg-gray-900 opacity-[.9] rounded-lg absolute top-[114px] right-6'
          >
            {`${visibleIdx} / ${newCollections.length}`}
          </div> }
        </HorizontalSlider>
      </section>
    </div>
  )
}

export default NewCollections;