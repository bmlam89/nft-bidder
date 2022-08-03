import { useUser } from '../../context/UserContext';
import { NewCollections, TopCollections } from '../index';
//const NewCollections = React.lazy(() => import('../index'));
//const TopCollections = React.lazy(() => import('../index'));
const Home = () => {
  const user = useUser();
  return (
    <div 
      id='home-wrapper'
      key='home-wrapper'
    >
      <NewCollections/>
      <TopCollections/>
    </div>
  );
};

export default Home;