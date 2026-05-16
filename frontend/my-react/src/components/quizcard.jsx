import { formatDateTime } from '../utils/helpers';

const QuizCard = ({ quiz, actionLabel, onAction, secondaryLabel, onSecondary }) => (
  <article className="card quiz-card">
    <div>
      <h3>{quiz.title}</h3>
      <p>{quiz.description || 'No description added.'}</p>
    </div>
    <dl className="meta-grid">
      <div>
        <dt>Questions</dt>
        <dd>{quiz.questions?.length || quiz.totalQuestions || 0}</dd>
      </div>
      <div>
        <dt>Time</dt>
        <dd>{quiz.timeLimit} min</dd>
      </div>
      <div>
        <dt>Type</dt>
        <dd>{quiz.testType?.replace('_', ' ') || 'mcq'}</dd>
      </div>
      <div>
        <dt>Domain</dt>
        <dd>{quiz.domain || 'General'}</dd>
      </div>
      <div>
        <dt>Opens</dt>
        <dd>{formatDateTime(quiz.startTime)}</dd>
      </div>
      <div>
        <dt>Closes</dt>
        <dd>{formatDateTime(quiz.endTime)}</dd>
      </div>
    </dl>
    <div className="actions">
      {secondaryLabel && (
        <button className="ghost" type="button" onClick={() => onSecondary(quiz)}>
          {secondaryLabel}
        </button>
      )}
      {actionLabel && (
        <button type="button" onClick={() => onAction(quiz)}>
          {actionLabel}
        </button>
      )}
    </div>
  </article>
);

export default QuizCard;
