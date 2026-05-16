import { apiRequest } from './api';

const toQuery = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : '';
};

export const questionService = {
  list: () => apiRequest('/questions'),
  create: (payload) =>
    apiRequest('/questions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  remove: (id) => apiRequest(`/questions/${id}`, { method: 'DELETE' }),
};

export const quizService = {
  instructorList: () => apiRequest('/quizzes'),
  publishedList: (filters) => apiRequest(`/quizzes/published${toQuery(filters)}`),
  domains: () => apiRequest('/quizzes/domains'),
  create: (payload) =>
    apiRequest('/quizzes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    apiRequest(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  getForAttempt: (id) => apiRequest(`/quizzes/attempt/${id}`),
  analytics: (id) => apiRequest(`/quizzes/${id}/analytics`),
};

export const attemptService = {
  submit: (quizId, answers) =>
    apiRequest(`/attempts/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
  mine: () => apiRequest('/attempts/mine'),
  get: (id) => apiRequest(`/attempts/${id}`),
  leaderboard: (filters) => apiRequest(`/attempts/leaderboard${toQuery(filters)}`),
};
