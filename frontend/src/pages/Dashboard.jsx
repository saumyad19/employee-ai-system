import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI, getScoreColor } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import './Dashboard.css';

const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f43f5e'];

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await employeeAPI.getAll();
      setEmployees(data.employees);
    } catch (err) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  // Compute stats
  const totalEmployees = employees.length;
  const avgScore = totalEmployees ? Math.round(employees.reduce((s, e) => s + e.performanceScore, 0) / totalEmployees) : 0;
  const topPerformer = employees[0];
  const promotionReady = employees.filter(e => e.performanceScore >= 80).length;

  // Department breakdown for pie chart
  const deptData = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(deptData).map(([name, value]) => ({ name, value }));

  // Score distribution for bar chart
  const scoreRanges = [
    { range: '0-20', count: employees.filter(e => e.performanceScore <= 20).length },
    { range: '21-40', count: employees.filter(e => e.performanceScore > 20 && e.performanceScore <= 40).length },
    { range: '41-60', count: employees.filter(e => e.performanceScore > 40 && e.performanceScore <= 60).length },
    { range: '61-80', count: employees.filter(e => e.performanceScore > 60 && e.performanceScore <= 80).length },
    { range: '81-100', count: employees.filter(e => e.performanceScore > 80).length },
  ];

  if (loading) return <div className="loading"><div className="spinner"></div><p>Loading Dashboard...</p></div>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>📊 Analytics Dashboard</h1>
        <p>Overview of your employee performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div className="stat-info">
            <p className="stat-label">Total Employees</p>
            <p className="stat-value">{totalEmployees}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📈</div>
          <div className="stat-info">
            <p className="stat-label">Avg Performance</p>
            <p className="stat-value" style={{ color: getScoreColor(avgScore) }}>{avgScore}%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🏆</div>
          <div className="stat-info">
            <p className="stat-label">Promotion Ready</p>
            <p className="stat-value">{promotionReady}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⭐</div>
          <div className="stat-info">
            <p className="stat-label">Top Performer</p>
            <p className="stat-value" style={{ fontSize: '16px' }}>{topPerformer?.name || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <h3 className="chart-title">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreRanges}>
              <XAxis dataKey="range" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1a2235', border: '1px solid #2d3748', borderRadius: '8px', color: '#f1f5f9' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="chart-title">Employees by Department</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a2235', border: '1px solid #2d3748', borderRadius: '8px', color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>No data yet</p></div>
          )}
        </div>
      </div>

      {/* Top 5 Employees */}
      <div className="card">
        <div className="section-header">
          <h3 className="chart-title">🏆 Top Performers</h3>
          <button className="btn btn-secondary" onClick={() => navigate('/employees')}>View All →</button>
        </div>
        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👥</div>
            <h3>No Employees Yet</h3>
            <p>Add employees to see rankings</p>
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/add-employee')}>
              ➕ Add First Employee
            </button>
          </div>
        ) : (
          <div className="top-list">
            {employees.slice(0, 5).map((emp, i) => (
              <div key={emp._id} className="top-item">
                <div className="rank">#{i + 1}</div>
                <div className="emp-avatar">{emp.name[0]}</div>
                <div className="emp-details">
                  <p className="emp-name">{emp.name}</p>
                  <p className="emp-dept">{emp.department}</p>
                </div>
                <div className="score-section">
                  <div className="score-bar" style={{ width: '100px' }}>
                    <div className="score-fill" style={{ width: `${emp.performanceScore}%`, background: getScoreColor(emp.performanceScore) }}></div>
                  </div>
                  <span className="score-text" style={{ color: getScoreColor(emp.performanceScore) }}>
                    {emp.performanceScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
