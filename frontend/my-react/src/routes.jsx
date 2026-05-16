import AttemptQuiz from './pages/attemptQuiz';
import CreateQuiz from './pages/createQuiz';
import InstructorDashboard from './pages/instructordashboard';
import Leaderboard from './pages/leaderboard';
import Login from './pages/login';
import Register from './pages/register';
import Result from './pages/result';
import StudentDashboard from './pages/studentDashboard';

const Routes = ({ page, params, navigate }) => {
  if (page === 'register') return <Register navigate={navigate} />;
  if (page === 'instructor') return <InstructorDashboard navigate={navigate} />;
  if (page === 'createQuiz') return <CreateQuiz navigate={navigate} />;
  if (page === 'student') return <StudentDashboard navigate={navigate} />;
  if (page === 'leaderboard') return <Leaderboard navigate={navigate} />;
  if (page === 'attempt') return <AttemptQuiz quizId={params.quizId} navigate={navigate} />;
  if (page === 'result') return <Result attemptId={params.attemptId} navigate={navigate} />;
  return <Login navigate={navigate} />;
};

export default Routes;
