import { useCallback, useEffect, useState } from 'react';
import { attemptService } from '../services/quizservice';
import { domainCatalog } from '../utils/domains';

const TrophyIcon = () => (
  <svg className="trophy-icon" viewBox="0 0 64 64" role="img" aria-label="Trophy">
    <path d="M20 8h24v10c0 10.5-4.7 18-12 18s-12-7.5-12-18V8Z" />
    <path d="M20 14H9v5c0 7 4.8 12 12 12M44 14h11v5c0 7-4.8 12-12 12" />
    <path d="M32 36v10M23 54h18M27 46h10l3 8H24l3-8Z" />
  </svg>
);

const Leaderboard = ({ navigate }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedSubdomain, setSelectedSubdomain] = useState('');
  const [error, setError] = useState('');

  const loadLeaderboard = useCallback(async () => {
    try {
      const ranks = await attemptService.leaderboard({
        domain: selectedDomain,
        subdomain: selectedSubdomain,
      });
      setLeaderboard(ranks);
    } catch (err) {
      setError(err.message);
    }
  }, [selectedDomain, selectedSubdomain]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const activeDomain = domainCatalog.find((item) => item.domain === selectedDomain);

  const selectDomain = (domain) => {
    const nextDomain = domainCatalog.find((item) => item.domain === domain);
    setSelectedDomain(domain);
    setSelectedSubdomain(nextDomain?.subdomains[0] || '');
  };

  return (
    <section className="page leaderboard-page">
      <div className="leaderboard-hero">
        <TrophyIcon />
        <div>
          <h1>Leaderboard</h1>
          <p>Top student scores across quizzes and domains.</p>
        </div>
        <button className="ghost" type="button" onClick={() => navigate('student')}>
          Back to Dashboard
        </button>
      </div>

      {error && <p className="alert">{error}</p>}

      <section className="card leaderboard-filters">
        <div>
          <h2>Rankings Filter</h2>
          <p>View all ranks or narrow the board by domain and subdomain.</p>
        </div>
        <div className="filter-grid">
          <button className={!selectedDomain ? 'active-filter' : 'ghost'} type="button" onClick={() => { setSelectedDomain(''); setSelectedSubdomain(''); }}>
            All Domains
          </button>
          {domainCatalog.map((item) => (
            <button
              className={selectedDomain === item.domain ? 'active-filter' : 'ghost'}
              key={item.domain}
              type="button"
              onClick={() => selectDomain(item.domain)}
            >
              {item.domain}
            </button>
          ))}
        </div>
        {activeDomain && (
          <div className="filter-grid">
            {activeDomain.subdomains.map((subdomain) => (
              <button
                className={selectedSubdomain === subdomain ? 'active-filter' : 'ghost'}
                key={subdomain}
                type="button"
                onClick={() => setSelectedSubdomain(subdomain)}
              >
                {subdomain}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="leaderboard-board">
        {leaderboard.length === 0 ? (
          <p className="empty">No leaderboard attempts yet.</p>
        ) : (
          leaderboard.map((rank, index) => (
            <article className={`rank-card rank-${index + 1}`} key={`${rank.student}-${rank.quiz}-${rank.submittedAt}`}>
              <div className="rank-number">{index + 1}</div>
              <div>
                <h2>{rank.student}</h2>
                <p>{rank.quiz}</p>
                <small>{rank.domain} - {rank.subdomain}</small>
              </div>
              <strong>{rank.percentage}%</strong>
            </article>
          ))
        )}
      </section>
    </section>
  );
};

export default Leaderboard;
