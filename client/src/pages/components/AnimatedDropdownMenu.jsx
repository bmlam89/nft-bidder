import { useEffect } from 'react';
import { useNavigation, useNavigationUpdate } from '../../context/NavigationContext';
import { useUser } from '../../context/UserContext';
import { Transition } from '@headlessui/react';
import Hamburger from 'hamburger-react';
import { IoWalletOutline } from 'react-icons/io5'
import { VscAccount, VscBookmark, VscChevronRight, VscSearch } from 'react-icons/vsc'
import { FiTrendingUp } from 'react-icons/fi'
import { HiMoon } from 'react-icons/hi'
import { MdFiberNew, MdOutlineSaveAlt } from 'react-icons/md'
const guestNavigation = [
  { name: 'All Collections', href: '#', icon: <VscChevronRight key={'All Collections'}/> },
  { name: 'Watchlist', href: '#', icon: <VscBookmark/> },
  { name: 'New listings', href: '#', icon: <MdFiberNew/> },
  { name: 'Top movers', href: '#', icon: <FiTrendingUp/> },
  { name: 'Night mode', href: '#', icon: <HiMoon/> },
]

const userNavigation = [
  { name: 'My positions', href: '#', icon: <VscAccount key='My positions'/> },
  { name: 'Floor & auction sweeper', href: '#', icon: <MdOutlineSaveAlt key='Floor'/> },
]

const AnimatedDropdownMenu = () => {
  const isToggled = useNavigation();
  const toggleHandler = useNavigationUpdate();
  const user = useUser();
  
  return (
    <div key='dropwdown-menu-wrapper' className='flex z-[9000] overflow-none overscroll-y-none'>
      <Transition
        as='div'
        show={isToggled.dropdown}
        className='absolute h-[calc(100vh)] w-screen bg-slate-300 overscroll-none pt-14'
        enter='transition-transform ease-in duration-300 delay-100'
        enterFrom='-translate-y-[calc(100vh-56px)]'
        enterTo='translate-y-0'
        leave='transition-transform ease-in duration-300'
        leaveFrom='translate-y-[100vh]'
        leaveTo='-translate-y-[calc(100vh-56px)]'
      >
        <div className="border-b border-gray-200 py-3">
          <div className='flex items-center justify-center'>
            {!user.currentAccount.address ? (
              <button className='mx-6 my-2 w-full border text-slate-50 font-bold border-blue-900 rounded bg-blue-700 py-2 px-4'
                onClick={user.connectWallet}
              >
                Connect wallet
              </button>
            ) : (
              <div className='flex items-center pt-6'>
                <p className='justify-self-start text-xl font-bold text-slate-50 mr-2'>Wallet balance:</p>
                {/*<img src={ `../../assets/ETH.svg` }/>*/}
                <p className='flex text-3xl font-bold text-slate-50'>
                  {user.currentAccount.ethBalance}
                </p>
              </div>
            )}
          </div>
        </div>
        { user.currentAccount.address && 
          <div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4 border-b border-white">
            { userNavigation.map(item => 
              <a key={ item.name }
                href={item.href}
                className='text-slate-300 flex items-center gap-x-2  py-2 px-1 mx-3 border-b border-slate-500'
              >
                {item.icon}
                {item.name}
              </a>
            )}
          </div> }
        <div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4 justify-between">
          { guestNavigation.map((item,idx) => 
            <div key={item.name} >
              { idx === guestNavigation.length-1 && 
              <div className='flex justify-between items-center  pr-4'>
                <a
                  href={item.href}
                  className='text-slate-300 flex items-center gap-x-2  py-2 px-1 mx-3'
                >
                  {item.icon}
                  {item.name}
                </a>
              </div> }
            { idx !== guestNavigation.length - 1 && 
              <a
                key={item.name}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className='text-slate-300 flex items-center gap-x-2  py-2 px-1 mx-3 border-b border-slate-500'
              >
                { idx!==0 && item.icon }
                { item.name}
                { idx===0 && item.icon }
              </a> }
          </div>) }
        </div>
      </Transition>
      <header 
        key='navigation-header'
        className='relative top-0 inset-x-0 flex w-full h-14 justify-between items-center shadow-sm shadow-slate-700 px-2'
      >
        <span className='flex h-12 w-12 items-center justify-center'>
          <img
            className="h-6 w-6"
            src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
            alt="Workflow"
          />
        </span>
        <span className='flex w-full h-full items-center justify-center'>
          <a 
            className={ `w-3/4 h-auto place-self-center text-center border rounded text-md font-light` }
            onClick={() => toggleHandler( { search: !isToggled.search, dropdown: isToggled.dropdown } )}
          >
            <span className='inline-flex gap-x-1'>             
              <VscSearch className='place-self-center rotate-[270deg]'/>
              search
            </span>
          </a>
        </span>
        <span className='flex justify-center'>
          <button className="rounded-md p-1 inline-flex items-center justify-center 
            text-gray-100 focus:outline-none"
            onClick={user.connectWallet}
          >
            <span className='sr-only'>Connect crypto wallet</span>
            { !user.currentAccount.address ? (
              <IoWalletOutline className='block h-6 w-6' aria-hidden='true'/>
            ) : (
              <span className="flex">
                <IoWalletOutline className='block h-6 w-6 text-blue-500' aria-hidden='true'/>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
            )}
          </button>
          <Hamburger 
            hideOutline={true}
            size={24}
            toggle={() => toggleHandler( { search: isToggled.search, dropdown: !isToggled.dropdown, header: !isToggled.dropdown && isToggled.header} )}
            toggled={isToggled.dropdown}
          />
        </span>
      </header>
    </div>
  )
}

export default AnimatedDropdownMenu;