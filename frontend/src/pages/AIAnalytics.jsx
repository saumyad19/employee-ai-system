import React, { useState, useEffect } from 'react';
import { employeeAPI, aiAPI, getScoreColor } from '../utils/api';
import toast from 'react-hot-toast';
import './AIAnalytics.css';

const AIAnalytics = () => {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState(null);
  const [rankResult, setRankResult] = useState(null);
  const [activeTab, setActiveTab] = useState('recommend');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    employeeAPI.getAll().then(({ data }) => setEmployees(data.employees));
  }, []);

  const handleRecommend = async () => {
    if (!selected) { toast.error('Please select an employee'); return; }
    setLoading(true); setResult(null);
    try {
      const { data } = await aiAPI.recommend(selected);
      setResult({ type: 'recommendation', text: data.recommendation, employee: data.employee });
      toast.success('AI recommendation generated! 🤖');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI API failed');
    } finally { setLoading(false); }
  };

  const handleTraining = async () => {
    if (!selected) { toast.error('Please select an employee'); return; }
    setLoading(true); setResult(null);
    try {
      const { data } = await aiAPI.training(selected);
      setResult({ type: 'training', text: data.suggestions, employee: data.employee });
      toast.success('Training suggestions ready! 📚');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI API failed');
    } finally { setLoading(false); }
  };

  const handleRank = async () => {
    setLoading(true); setRankResult(null);
    try {
      const { data } = await aiAPI.rank();
      setRankResult({ analysis: data.analysis, employees: data.employees });
      toast.success('AI ranking complete! 🏆');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI API failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="ai-page">
      <div className="page-header">
        <h1>🤖 AI Analytics Center</h1>
        <p>Get AI-powered insights, recommendations, and training plans</p>
      </div>

      {/* Tabs */}
      <div className="ai-tabs">
        {[
          { id: 'recommend', label: '💡 Recommendation', desc: 'Get promotion & feedback advice' },
          { id: 'training', label: '📚 Training Plan', desc: 'Personalized learning suggestions' },
          { id: 'rank', label: '🏆 Team Ranking', desc: 'AI analysis of all employees' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`ai-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setResult(null); setRankResult(null); }}
          >
            <span className="tab-label">{tab.label}</span>
            <span className="tab-desc">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* Individual Employee Actions */}
      {(activeTab === 'recommend' || activeTab === 'training') && (
        <div className="ai-control-panel">
          <div className="form-group">
            <label>Select Employee</label>
            <select value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="">-- Choose an employee --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} — {emp.department} ({emp.performanceScore}%)
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-primary ai-generate-btn"
            onClick={activeTab === 'recommend' ? handleRecommend : handleTraining}
            disabled={loading || !selected}
          >
            {loading ? '⏳ AI is thinking...' : activeTab === 'recommend' ? '🤖 Generate Recommendation' : '📚 Get Training Plan'}
          </button>
        </div>
      )}

      {/* Rank Action */}
      {activeTab === 'rank' && (
        <div className="ai-control-panel">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            This will analyze all {employees.length} employees and provide an AI-powered ranking with insights.
          </p>
          <button className="btn btn-primary ai-generate-btn" onClick={handleRank} disabled={loading}>
            {loading ? '⏳ AI is analyzing...' : `🏆 Analyze & Rank All ${employees.length} Employees`}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="ai-loading">
          <div className="ai-spinner"></div>
          <p>🤖 AI is processing your request...</p>
          <span>This may take 5-15 seconds</span>
        </div>
      )}

      {/* Individual Result */}
      {result && !loading && (
        <div className="ai-result-panel">
          <div className="result-header">
            <div className="result-avatar">{result.employee?.name?.[0]}</div>
            <div>
              <h3>{result.employee?.name}</h3>
              <p>{result.employee?.department} • Score: <span style={{ color: getScoreColor(result.employee?.performanceScore) }}>{result.employee?.performanceScore}%</span></p>
            </div>
            <div className="ai-badge">🤖 AI Generated</div>
          </div>
          <div className="result-content">
            <h4>{result.type === 'recommendation' ? '💡 AI Recommendation' : '📚 Training Plan'}</h4>
            <div className="ai-text">
              {result.text.split('\n').map((line, i) => (
                <p key={i} style={{ marginBottom: line ? '8px' : '0' }}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rank Result */}
      {rankResult && !loading && (
        <div className="rank-result">
          <div className="ai-analysis-box">
            <h4>🤖 AI Analysis</h4>
            <div className="ai-text">
              {rankResult.analysis.split('\n').map((line, i) => (
                <p key={i} style={{ marginBottom: line ? '8px' : '0' }}>{line}</p>
              ))}
            </div>
          </div>
          <h4 style={{ margin: '24px 0 16px', fontWeight: '700' }}>📊 Employee Rankings</h4>
          <div className="rank-list">
            {rankResult.employees.map((emp, i) => (
              <div key={emp._id} className="rank-item">
                <div className={`rank-badge ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div className="rank-avatar">{emp.name[0]}</div>
                <div className="rank-info">
                  <p className="rank-name">{emp.name}</p>
                  <p className="rank-dept">{emp.department} • {emp.experience}yr exp</p>
                </div>
                <div className="rank-score-section">
                  <div className="score-bar" style={{ width: '120px' }}>
                    <div className="score-fill" style={{ width: `${emp.performanceScore}%`, background: getScoreColor(emp.performanceScore) }}></div>
                  </div>
                  <span style={{ color: getScoreColor(emp.performanceScore), fontWeight: '700', fontSize: '15px' }}>
                    {emp.performanceScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalytics;
