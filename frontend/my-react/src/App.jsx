import { useEffect, useState } from 'react';
import Navbar from './components/navbar';
import { useAuth } from './context/authContext';
import Routes from './routes';
import './App.css';

const App = () => {
  const { user, isInstructor } = useAuth();
  const [route, setRoute] = useState({ page: 'login', params: {} });

  const navigate = (page, params = {}) => setRoute({ page, params });

  useEffect(() => {
    if (!user) {
      setRoute({ page: 'login', params: {} });
      return;
    }

    setRoute({ page: isInstructor ? 'instructor' : 'student', params: {} });
  }, [isInstructor, user]);

  return (
    <>
      <Navbar page={route.page} navigate={navigate} />
      <main>
        <Routes page={route.page} params={route.params} navigate={navigate} />
      </main>
    </>
  );
};

export default App;
