import { useState, useEffect } from 'react';
import { AppContextWrapper } from './pages';
import { NavigationProvider } from './context/NavigationContext';
import { DataProvider } from './context/DataContext';
import { UserProvider } from './context/UserContext';
function App() {  
  const [newCollections, setNewCollections] = useState(false);
  const [topCollections, setTopCollections] = useState(false);
  const fetchNewCollections = () => {
    fetch('/collection/new')
    .then(response => response.json())
    .then(newCollectionsResponse =>  setNewCollections(newCollectionsResponse.data) )
  }
  const fetchTopCollections = () => {
    fetch('/collection/top')
    .then(response => response.json())
    .then(topCollectionsResponse =>  setTopCollections(topCollectionsResponse.data))
  }

  useEffect(() => {
    fetchNewCollections();
    fetchTopCollections();
  },[]);

  return (
    <NavigationProvider>
      { newCollections &&  <DataProvider newCollections={newCollections} topCollections={topCollections}>
        <UserProvider>
          <AppContextWrapper/>
        </UserProvider>
      </DataProvider> }
    </NavigationProvider>
  );
}

export default App;