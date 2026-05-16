import { useCallback, useEffect, useState } from 'react';
import QuizCard from '../components/quizcard';
import { quizService } from '../services/quizservice';

const InstructorDashboard = ({ navigate }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  const loadQuizzes = useCallback(async () => {
    try {
      setQuizzes(await quizService.instructorList());
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const loadAnalytics = async (quiz) => {
    setError('');
    try {
      setAnalytics(await quizService.analytics(quiz._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Instructor Dashboard</h1>
          <p>Build quizzes, publish assessments, and review class performance.</p>
        </div>
        <button type="button" onClick={() => navigate('createQuiz')}>Create Quiz</button>
      </div>
      {error && <p className="alert">{error}</p>}
      <div className="grid two">
        <div>
          <h2>Your quizzes</h2>
          <div className="stack">
            {quizzes.length === 0 ? (
              <p className="empty">No quizzes created yet.</p>
            ) : (
              quizzes.map((quiz) => (
                <QuizCard
                  key={quiz._id}
                  quiz={quiz}
                  actionLabel="Analytics"
                  onAction={loadAnalytics}
                  secondaryLabel={quiz.isPublished ? 'Published' : 'Draft'}
                  onSecondary={() => {}}
                />
              ))
            )}
          </div>
        </div>
        <aside className="card analytics">
          <h2>Class Analytics</h2>
          {!analytics ? (
            <p className="empty">Choose a quiz to view student performance.</p>
          ) : (
            <>
              <div className="stats">
                <div><strong>{analytics.totalAttempts}</strong><span>Attempts</span></div>
                <div><strong>{analytics.averageScore}</strong><span>Avg score</span></div>
                <div><strong>{analytics.highestScore}</strong><span>Highest</span></div>
              </div>
              <h3>{analytics.quiz.title}</h3>
              <div className="question-list">
                {analytics.questionStats.map((item) => (
                  <div className="analysis-row" key={item.questionId}>
                    <strong>{item.question}</strong>
                    <span>{item.accuracy}% correct ({item.correctCount}/{analytics.totalAttempts})</span>
                  </div>
                ))}
              </div>
              <h3>Students</h3>
              <div className="table">
                {analytics.attempts.map((attempt) => (
                  <div className="table-row" key={attempt._id}>
                    <span>{attempt.student?.name}</span>
                    <strong>{attempt.score}/{attempt.totalQuestions}</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
};

export default InstructorDashboard;
