import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react'
import { AnimatedDropdownMenu } from '../index';
const AnimatedHeaderNavigation = (props) => {
  const [isVisible, setVisible] = useState(true);
  const [scrollPos, setScrollPos] = useState(window.pageYOffset);
  const handleScroll = () => {
    let prev = scrollPos;
    let current = window.pageYOffset;
    
    if(current < prev || window.pageYOffset <= 65) setVisible(true);
    else if (current > prev ) setVisible(false);

    setScrollPos(window.pageYOffset);
  }

  useEffect(() => {  
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  },[handleScroll])

  return (
    <Transition 
      as='nav'
      show={isVisible} 
      className={ `w-full h-14 fixed top-0 flex flex-auto flex-col bg-slate-300 shadow opacity-[.99] z-[1000]` }
      key='header-nav-transition'
      enter={ `transition-transform ease-in-out duration-600 delay-500` }
      enterFrom={ `-translate-y-14` }
      enterTo={ `translate-y-0` }
      leave={ `transition ease-in duration-400 transform` }
      leaveFrom={ `translate-y-0` }
      leaveTo={ `-translate-y-14` }
    >
      <AnimatedDropdownMenu/>
    </Transition>
  )
}

export default AnimatedHeaderNavigation;





