import { useCallback, useEffect, useMemo, useState } from 'react';
import QuizCard from '../components/quizcard';
import { attemptService, quizService } from '../services/quizservice';
import { domainCatalog } from '../utils/domains';
import { formatDateTime } from '../utils/helpers';

const studentPages = [
  { key: 'domains', label: 'Domains' },
  { key: 'quizzes', label: 'Quizzes' },
  { key: 'results', label: 'My Results' },
];

const StudentDashboard = ({ navigate }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedSubdomain, setSelectedSubdomain] = useState('');
  const [publishedDomains, setPublishedDomains] = useState([]);
  const [activePage, setActivePage] = useState('domains');
  const [error, setError] = useState('');

  const activeCatalogDomain = useMemo(
    () => domainCatalog.find((item) => item.domain === selectedDomain),
    [selectedDomain]
  );

  const loadData = useCallback(async () => {
    try {
      const filters = { domain: selectedDomain, subdomain: selectedSubdomain };
      const [publishedQuizzes, myAttempts, domains] = await Promise.all([
        quizService.publishedList(filters),
        attemptService.mine(),
        quizService.domains(),
      ]);
      setQuizzes(publishedQuizzes);
      setAttempts(myAttempts);
      setPublishedDomains(domains);
    } catch (err) {
      setError(err.message);
    }
  }, [selectedDomain, selectedSubdomain]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const clearDomain = () => {
    setSelectedDomain('');
    setSelectedSubdomain('');
  };

  const domainTitle = selectedDomain
    ? `${selectedDomain}${selectedSubdomain ? ` - ${selectedSubdomain}` : ''}`
    : 'All Domains';

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Student Dashboard</h1>
          <p>{domainTitle}</p>
        </div>
      </div>
      {error && <p className="alert">{error}</p>}

      <nav className="page-tabs">
        {studentPages.map((page) => (
          <button
            className={activePage === page.key ? 'active-filter' : 'ghost'}
            key={page.key}
            type="button"
            onClick={() => setActivePage(page.key)}
          >
            {page.label}
          </button>
        ))}
        <button className="ghost" type="button" onClick={() => navigate('leaderboard')}>
          Open Leaderboard
        </button>
      </nav>

      {activePage === 'domains' && (
        <section className="card compact-page">
          <div className="section-heading">
            <div>
              <h2>Choose Domain</h2>
              <p>Pick a field first, then move to quizzes or sample questions.</p>
            </div>
            <button className="ghost" type="button" onClick={clearDomain}>Show All</button>
          </div>
          <div className="domain-grid">
            {domainCatalog.map((item) => (
              <button
                className={selectedDomain === item.domain ? 'domain-card selected-domain-card' : 'domain-card'}
                key={item.domain}
                type="button"
                onClick={() => {
                  setSelectedDomain(item.domain);
                  setSelectedSubdomain('');
                }}
              >
                <h3>{item.domain}</h3>
                <p>{item.subdomains.length} subdomains</p>
              </button>
            ))}
            {publishedDomains
              .filter((item) => !domainCatalog.some((catalog) => catalog.domain === item.domain))
              .map((item) => (
                <button
                  className={selectedDomain === item.domain ? 'domain-card selected-domain-card' : 'domain-card'}
                  key={`${item.domain}-${item.subdomain}`}
                  type="button"
                  onClick={() => { setSelectedDomain(item.domain); setSelectedSubdomain(item.subdomain); }}
                >
                  <h3>{item.domain}</h3>
                  <p>{item.subdomain}</p>
                </button>
              ))}
          </div>
          {activeCatalogDomain && (
            <div className="subdomain-nav">
              <h3>{selectedDomain} Subdomains</h3>
              <div className="filter-grid">
                {activeCatalogDomain.subdomains.map((subdomain) => (
                  <button
                    className={selectedSubdomain === subdomain ? 'active-filter' : 'ghost'}
                    key={subdomain}
                    type="button"
                    onClick={() => {
                      setSelectedSubdomain(subdomain);
                      setActivePage('quizzes');
                    }}
                  >
                    {subdomain}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {activePage === 'quizzes' && (
        <section className="compact-page">
          <div className="section-heading">
            <div>
              <h2>Available Quizzes</h2>
              <p>{domainTitle}</p>
            </div>
            {activeCatalogDomain && (
              <select value={selectedSubdomain} onChange={(event) => setSelectedSubdomain(event.target.value)}>
                {activeCatalogDomain.subdomains.map((subdomain) => (
                  <option key={subdomain} value={subdomain}>{subdomain}</option>
                ))}
              </select>
            )}
          </div>
          <div className="quiz-grid">
            {quizzes.length === 0 ? (
              <p className="empty">No available quizzes for this selection yet.</p>
            ) : (
              quizzes.map((quiz) => (
                <QuizCard
                  key={quiz._id}
                  quiz={quiz}
                  actionLabel="Attempt"
                  onAction={() => navigate('attempt', { quizId: quiz._id })}
                />
              ))
            )}
          </div>
        </section>
      )}

      {activePage === 'results' && (
        <section className="card compact-page">
          <h2>My Results</h2>
          <div className="table spacious-table">
            {attempts.length === 0 ? (
              <p className="empty">No submitted attempts yet.</p>
            ) : (
              attempts.map((attempt) => (
                <button className="table-row result-row" type="button" key={attempt._id} onClick={() => navigate('result', { attemptId: attempt._id })}>
                  <span>
                    <strong>{attempt.quiz?.title}</strong>
                    <small>{attempt.quiz?.domain} - {formatDateTime(attempt.submittedAt)}</small>
                  </span>
                  <b>{attempt.score}/{attempt.totalQuestions}</b>
                </button>
              ))
            )}
          </div>
        </section>
      )}
    </section>
  );
};

export default StudentDashboard;
