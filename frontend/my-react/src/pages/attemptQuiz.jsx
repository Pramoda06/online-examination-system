import { useCallback, useEffect, useMemo, useState } from 'react';
import useTimer from '../hooks/useTimer';
import { attemptService, quizService } from '../services/quizservice';
import { formatTimer } from '../utils/helpers';

const AttemptQuiz = ({ quizId, navigate }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    quizService.getForAttempt(quizId)
      .then((loadedQuiz) => {
        setQuiz(loadedQuiz);
        setTimerStarted(true);
      })
      .catch((err) => setError(err.message));
  }, [quizId]);

  const initialSeconds = useMemo(() => (quiz && timerStarted ? quiz.timeLimit * 60 : 0), [quiz, timerStarted]);

  const submitQuiz = useCallback(async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const payload = quiz.questions.map((question) => {
        const answer = answers[question._id];
        if (question.type === 'multiple_answer') {
          return { question: question._id, selectedAnswers: answer || [] };
        }
        if (['written', 'assessment'].includes(question.type)) {
          return { question: question._id, writtenAnswer: answer || '' };
        }
        return { question: question._id, selectedAnswer: answer || '' };
      });
      const attempt = await attemptService.submit(quiz._id, payload);
      navigate('result', { attemptId: attempt._id });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }, [answers, navigate, quiz, submitting]);

  const secondsLeft = useTimer(initialSeconds, submitQuiz);

  const toggleMultipleAnswer = (questionId, option) => {
    setAnswers((currentAnswers) => {
      const current = currentAnswers[questionId] || [];
      return {
        ...currentAnswers,
        [questionId]: current.includes(option)
          ? current.filter((answer) => answer !== option)
          : [...current, option],
      };
    });
  };

  const renderAnswerInput = (question) => {
    if (question.type === 'multiple_answer') {
      const selectedAnswers = answers[question._id] || [];
      return question.options.map((option) => (
        <label className="option-row" key={option}>
          <input
            name={question._id}
            type="checkbox"
            value={option}
            checked={selectedAnswers.includes(option)}
            onChange={() => toggleMultipleAnswer(question._id, option)}
          />
          {option}
        </label>
      ));
    }

    if (['written', 'assessment'].includes(question.type)) {
      return (
        <label>
          Your answer
          <textarea
            value={answers[question._id] || ''}
            onChange={(event) =>
              setAnswers((currentAnswers) => ({
                ...currentAnswers,
                [question._id]: event.target.value,
              }))
            }
            placeholder="Write your answer here"
            required
          />
        </label>
      );
    }

    return question.options.map((option) => (
      <label className="option-row" key={option}>
        <input
          name={question._id}
          type="radio"
          value={option}
          checked={answers[question._id] === option}
          onChange={(event) =>
            setAnswers((currentAnswers) => ({
              ...currentAnswers,
              [question._id]: event.target.value,
            }))
          }
        />
        {option}
      </label>
    ));
  };

  if (error) {
    return <section className="page"><p className="alert">{error}</p></section>;
  }

  if (!quiz) {
    return <section className="page"><p className="empty">Loading quiz...</p></section>;
  }

  return (
    <section className="page exam-page">
      <div className="exam-header">
        <div>
          <h1>{quiz.title}</h1>
          <p>{quiz.domain} - {quiz.subdomain} - {quiz.testType?.replace('_', ' ')}</p>
          <p>{quiz.description}</p>
        </div>
        <strong className={secondsLeft < 60 ? 'timer danger' : 'timer'}>{formatTimer(secondsLeft)}</strong>
      </div>
      <form className="stack" onSubmit={(event) => { event.preventDefault(); submitQuiz(); }}>
        {quiz.questions.map((question, index) => (
          <fieldset className="card question-card" key={question._id}>
            <legend>{index + 1}. {question.question}</legend>
            <small>{question.type?.replace('_', ' ') || 'mcq'}</small>
            {renderAnswerInput(question)}
          </fieldset>
        ))}
        <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Quiz'}</button>
      </form>
    </section>
  );
};

export default AttemptQuiz;
