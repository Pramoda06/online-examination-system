import { useCallback, useEffect, useMemo, useState } from 'react';
import Questions from '../components/questions';
import { questionService, quizService } from '../services/quizservice';
import { domainCatalog, testTypes } from '../utils/domains';
import { toDateTimeLocal } from '../utils/helpers';

const emptyQuestion = {
  question: '',
  type: 'mcq',
  options: ['', '', '', ''],
  correctAnswer: '',
  correctAnswers: [],
};

const getInitialQuizForm = () => ({
  title: '',
  description: '',
  testType: 'mcq',
  domain: domainCatalog[0].domain,
  subdomain: domainCatalog[0].subdomains[0],
  customDomain: '',
  timeLimit: 15,
  startTime: toDateTimeLocal(new Date()),
  endTime: toDateTimeLocal(new Date(Date.now() + 60 * 60 * 1000)),
  isPublished: true,
});

const CreateQuiz = ({ navigate }) => {
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [quizForm, setQuizForm] = useState(getInitialQuizForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const selectedDomain = useMemo(
    () => domainCatalog.find((item) => item.domain === quizForm.domain),
    [quizForm.domain]
  );

  const loadQuestions = useCallback(async () => {
    setQuestions(await questionService.list());
  }, []);

  useEffect(() => {
    loadQuestions().catch((err) => setError(err.message));
  }, [loadQuestions]);

  const updateQuestionType = (type) => {
    setQuestionForm({
      ...emptyQuestion,
      type,
      question: questionForm.question,
    });
  };

  const updateOption = (index, value) => {
    const options = [...questionForm.options];
    options[index] = value;
    setQuestionForm({
      ...questionForm,
      options,
      correctAnswer: questionForm.correctAnswer || value,
    });
  };

  const toggleCorrectAnswer = (option) => {
    setQuestionForm((current) => ({
      ...current,
      correctAnswers: current.correctAnswers.includes(option)
        ? current.correctAnswers.filter((answer) => answer !== option)
        : [...current.correctAnswers, option],
    }));
  };

  const addQuestion = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await questionService.create(questionForm);
      setQuestionForm(emptyQuestion);
      await loadQuestions();
      setMessage('Question added to bank.');
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleQuestion = (id) => {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));
  };

  const selectAllQuestions = (checked) => {
    setSelectedIds(checked ? questions.map((question) => question._id) : []);
  };

  const updateDomain = (domain) => {
    const nextDomain = domainCatalog.find((item) => item.domain === domain);
    setQuizForm({
      ...quizForm,
      domain,
      subdomain: nextDomain?.subdomains[0] || 'General',
      customDomain: domain === 'Custom' ? quizForm.customDomain : '',
    });
  };

  const createQuiz = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await quizService.create({
        ...quizForm,
        questions: selectedIds,
        timeLimit: Number(quizForm.timeLimit),
      });
      setMessage('Quiz saved successfully.');
      navigate('instructor');
    } catch (err) {
      setError(err.message);
    }
  };

  const isObjectiveQuestion = ['mcq', 'multiple_answer'].includes(questionForm.type);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Question Bank and Quiz Builder</h1>
          <p>Create objective, written, or assessment tests and publish them by domain.</p>
        </div>
      </div>
      {error && <p className="alert">{error}</p>}
      {message && <p className="success">{message}</p>}
      <div className="grid two">
        <form className="card form-card" onSubmit={addQuestion}>
          <h2>Add Question</h2>
          <label>
            Question type
            <select value={questionForm.type} onChange={(e) => updateQuestionType(e.target.value)}>
              {testTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </label>
          <label>
            Question
            <textarea value={questionForm.question} onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })} required />
          </label>
          {isObjectiveQuestion && questionForm.options.map((option, index) => (
            <label key={`option-${index + 1}`}>
              Option {index + 1}
              <input value={option} onChange={(e) => updateOption(index, e.target.value)} required />
            </label>
          ))}
          {questionForm.type === 'mcq' && (
            <label>
              Correct answer
              <select value={questionForm.correctAnswer} onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })} required>
                <option value="">Select correct answer</option>
                {questionForm.options.filter(Boolean).map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          )}
          {questionForm.type === 'multiple_answer' && (
            <div className="stack">
              <strong>Correct answers</strong>
              {questionForm.options.filter(Boolean).map((option) => (
                <label className="check-row" key={option}>
                  <input
                    type="checkbox"
                    checked={questionForm.correctAnswers.includes(option)}
                    onChange={() => toggleCorrectAnswer(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          {!isObjectiveQuestion && (
            <p className="empty">Written and assessment questions collect text answers and are marked for instructor review.</p>
          )}
          <button type="submit">Save Question</button>
        </form>

        <form className="card form-card" onSubmit={createQuiz}>
          <h2>Create Quiz</h2>
          <label>
            Test type
            <select value={quizForm.testType} onChange={(e) => setQuizForm({ ...quizForm, testType: e.target.value })}>
              {testTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </label>
          <label>
            Domain
            <select value={quizForm.domain} onChange={(e) => updateDomain(e.target.value)}>
              {domainCatalog.map((item) => (
                <option key={item.domain} value={item.domain}>{item.domain}</option>
              ))}
              <option value="Custom">Custom domain</option>
            </select>
          </label>
          {quizForm.domain === 'Custom' ? (
            <label>
              Custom domain name
              <input value={quizForm.customDomain} onChange={(e) => setQuizForm({ ...quizForm, customDomain: e.target.value })} required />
            </label>
          ) : (
            <label>
              Subdomain
              <select value={quizForm.subdomain} onChange={(e) => setQuizForm({ ...quizForm, subdomain: e.target.value })}>
                {selectedDomain?.subdomains.map((subdomain) => (
                  <option key={subdomain} value={subdomain}>{subdomain}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            Title
            <input value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} required />
          </label>
          <label>
            Description
            <textarea value={quizForm.description} onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })} />
          </label>
          <label>
            Time limit in minutes
            <input value={quizForm.timeLimit} onChange={(e) => setQuizForm({ ...quizForm, timeLimit: e.target.value })} type="number" min="1" required />
          </label>
          <div className="grid two compact">
            <label>
              Start
              <input value={quizForm.startTime} onChange={(e) => setQuizForm({ ...quizForm, startTime: e.target.value })} type="datetime-local" required />
            </label>
            <label>
              End
              <input value={quizForm.endTime} onChange={(e) => setQuizForm({ ...quizForm, endTime: e.target.value })} type="datetime-local" required />
            </label>
          </div>
          <label className="check-row">
            <input checked={quizForm.isPublished} onChange={(e) => setQuizForm({ ...quizForm, isPublished: e.target.checked })} type="checkbox" />
            Publish immediately
          </label>
          <Questions questions={questions} selectedIds={selectedIds} onToggle={toggleQuestion} onSelectAll={selectAllQuestions} />
          <button type="submit">Save Quiz</button>
        </form>
      </div>
    </section>
  );
};

export default CreateQuiz;
