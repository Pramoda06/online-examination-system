const Questions = ({ questions, selectedIds, onToggle, onSelectAll }) => (
  <div className="question-list">
    {questions.length === 0 ? (
      <p className="empty">Create questions first, then assemble a quiz.</p>
    ) : (
      <>
        <label className="question-row select-all-row">
          <input
            type="checkbox"
            checked={selectedIds.length === questions.length}
            onChange={(event) => onSelectAll(event.target.checked)}
          />
          <span>
            <strong>Select all questions</strong>
            <small>{selectedIds.length} of {questions.length} selected</small>
          </span>
        </label>
        {questions.map((question) => (
          <label className="question-row" key={question._id}>
            <input
              type="checkbox"
              checked={selectedIds.includes(question._id)}
              onChange={() => onToggle(question._id)}
            />
            <span>
              <strong>{question.question}</strong>
              <small>{question.type?.replace('_', ' ') || 'mcq'} {question.options?.length ? `- ${question.options.join(' / ')}` : '- written response'}</small>
            </span>
          </label>
        ))}
      </>
    )}
  </div>
);

export default Questions;
