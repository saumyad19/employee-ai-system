import axios from 'axios';

// Development: http://localhost:5000
// Production: Set VITE_API_URL in Render environment variables
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


// Employee APIs
export const employeeAPI = {
  add: (data) => axios.post('/api/employees', data),
  getAll: () => axios.get('/api/employees'),
  search: (params) => axios.get('/api/employees/search', { params }),
  getById: (id) => axios.get(`/api/employees/${id}`),
  update: (id, data) => axios.put(`/api/employees/${id}`, data),
  delete: (id) => axios.delete(`/api/employees/${id}`),
};

// AI APIs
export const aiAPI = {
  recommend: (employeeId) => axios.post('/api/ai/recommend', { employeeId }),
  rank: () => axios.post('/api/ai/rank'),
  training: (employeeId) => axios.post('/api/ai/training', { employeeId }),
};

// Helper: Get score color
export const getScoreColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

// Helper: Get score badge
export const getScoreBadge = (score) => {
  if (score >= 80) return { text: 'Excellent', cls: 'badge-success' };
  if (score >= 60) return { text: 'Good', cls: 'badge-warning' };
  return { text: 'Needs Improvement', cls: 'badge-danger' };
};
