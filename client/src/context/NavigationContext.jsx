import React, { useState, useContext } from 'react';
const NavigationContext = React.createContext();
const NavigationUpdateContext = React.createContext();

export const useNavigation = () => {
  return useContext(NavigationContext);
};

export const useNavigationUpdate = () => {
    return useContext(NavigationUpdateContext)
}

export const NavigationProvider = (props) => {
  const [isToggled, setToggle] = useState({
    search:false,
    dropdown:false,
    header:true
  });
  const toggleHandler = (state) => {
     setToggle(state)
  };
  return (
    <div key='navigation-context-wrapper'>
      <NavigationContext.Provider value={isToggled}>
        <NavigationUpdateContext.Provider value={toggleHandler}>     
          { props.children }
        </NavigationUpdateContext.Provider>
      </NavigationContext.Provider>
    </div>
  )
};