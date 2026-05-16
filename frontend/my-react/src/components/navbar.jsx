import { useAuth } from '../context/authContext';

const Navbar = ({ page, navigate }) => {
  const { user, logout, isInstructor } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('login');
  };

  return (
    <header className="topbar">
      <nav>
        {user && isInstructor && (
          <>
            <button className={page === 'instructor' ? 'active' : ''} type="button" onClick={() => navigate('instructor')}>
              Dashboard
            </button>
            <button className={page === 'createQuiz' ? 'active' : ''} type="button" onClick={() => navigate('createQuiz')}>
              Builder
            </button>
          </>
        )}
        {user && !isInstructor && (
          <>
            <button className={page === 'student' ? 'active' : ''} type="button" onClick={() => navigate('student')}>
              My Quizzes
            </button>
            <button className={page === 'leaderboard' ? 'active' : ''} type="button" onClick={() => navigate('leaderboard')}>
              Leaderboard
            </button>
          </>
        )}
        {!user && (
          <>
            <button className={page === 'login' ? 'active' : ''} type="button" onClick={() => navigate('login')}>
              Login
            </button>
            <button className={page === 'register' ? 'active' : ''} type="button" onClick={() => navigate('register')}>
              Register
            </button>
          </>
        )}
        {user && (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
