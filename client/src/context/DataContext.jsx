import React, { useContext, useMemo } from 'react';
const DataContext = React.createContext();

export const useData = () => {
  return useContext(DataContext);
}

export const DataProvider = (props) => {
  const data = useMemo(() => (
    {
      newCollections: props.newCollections,
      topCollections: props.topCollections,
      ethImageUrl: 'https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg',
      wEthImageUrl: 'https://openseauserdata.com/files/accae6b6fb3888cbff27a013729c22dc.svg'
    }
  ),[props.topCollections, props.newCollections]);

  return (
    <div key='data-context-wrapper'>
      <DataContext.Provider value={ data }>
        { props.children }
      </DataContext.Provider>
    </div>
  )
};