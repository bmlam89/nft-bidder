
import { useEffect } from 'react';
import { Home, AnimatedFooterNavigation, AnimatedHeaderNavigation, CollectionHomepage } from './index';
//import { AnimatedHeaderNavigation, AnimatedFooterNavigation, Home, CollectionHomepage, SweeperHomepage, Register } from './index';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';
import { useUser } from '../context/UserContext';
const AppContextWrapper = () => {
  const isToggled = useNavigation();
  const user = useUser();
  
  return (
    <div 
      key='app-padding-wrapper'
      id='app-padding-wrapper'
      className={ `pt-14 pb-12` }
    >
      <BrowserRouter>
        <AnimatedHeaderNavigation/>
        { !isToggled.dropdown && <Routes>
          <Route exact path="/" element = { <Home/> } />
          <Route path="/collection/:slug" element = { <CollectionHomepage/> }/>
          {/*<Route exact path='/sweeper' element={ user.currentAccount.address ?  <SweeperHomepage/> : <Navigate to='/'/> }/>
          <Route exact path='/sweeper/review' element={ user.currentAccount.address && user.registeredSweeperWallet ? <SweeperHomepage/> : <Navigate to='/'/> }/>
          <Route exact path='/sweeper/confirm' element={ user.currentAccount.address && user.registeredSweeperWallet ? <SweeperHomepage/> : <Navigate to='/'/> }/>
          <Route exact path='/sweeper/complete' element={ user.currentAccount.address && user.registeredSweeperWallet ? <SweeperHomepage/> : <Navigate to='/'/> }/>
          <Route exact path='/sweeper/register' element={ user.currentAccount.address && !user.registeredSweeperWallet ? <Register/> : <Navigate to='/'/> }/>*/}
        </Routes> }
        { isToggled.dropdown && <AnimatedFooterNavigation/> }
      </BrowserRouter>
    </div>
  )
};

export default AppContextWrapper;