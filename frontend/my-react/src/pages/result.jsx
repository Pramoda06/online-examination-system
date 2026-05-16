import { useEffect, useState } from 'react';
import { attemptService } from '../services/quizservice';

const Result = ({ attemptId, navigate }) => {
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    attemptService.get(attemptId)
      .then(setAttempt)
      .catch((err) => setError(err.message));
  }, [attemptId]);

  if (error) {
    return <section className="page"><p className="alert">{error}</p></section>;
  }

  if (!attempt) {
    return <section className="page"><p className="empty">Loading result...</p></section>;
  }

  const showAnswer = (answer) => {
    if (answer.question.type === 'multiple_answer') {
      return answer.selectedAnswers?.length ? answer.selectedAnswers.join(', ') : 'Not answered';
    }
    if (['written', 'assessment'].includes(answer.question.type)) {
      return answer.writtenAnswer || 'Not answered';
    }
    return answer.selectedAnswer || 'Not answered';
  };

  const showCorrectAnswer = (answer) => {
    if (answer.needsReview) return 'Instructor review required';
    if (answer.question.type === 'multiple_answer') return answer.correctAnswers?.join(', ') || 'Not set';
    return answer.correctAnswer || 'Not set';
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>{attempt.quiz?.title} Result</h1>
          <p>{attempt.quiz?.domain} - {attempt.quiz?.subdomain}</p>
          <p>Auto-graded score: {attempt.score} out of {attempt.totalQuestions}</p>
        </div>
        <button type="button" onClick={() => navigate('student')}>Back to dashboard</button>
      </div>
      <div className="stack">
        {attempt.answers.map((answer, index) => (
          <article className={`card review-card ${answer.isCorrect ? 'correct' : 'wrong'}`} key={answer.question._id}>
            <h3>{index + 1}. {answer.question.question}</h3>
            <small>{answer.question.type?.replace('_', ' ')}</small>
            <p>Your answer: <strong>{showAnswer(answer)}</strong></p>
            <p>Correct answer: <strong>{showCorrectAnswer(answer)}</strong></p>
            <span>{answer.needsReview ? 'Needs Review' : answer.isCorrect ? 'Correct' : 'Incorrect'}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Result;
