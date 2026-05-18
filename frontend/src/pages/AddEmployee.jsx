import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './AddEmployee.css';

const DEPARTMENTS = ['Development', 'Marketing', 'HR', 'Finance', 'Design', 'Sales', 'Operations'];

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: 'Development',
    skills: '',
    performanceScore: '',
    experience: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
    if (skillsArray.length === 0) {
      toast.error('Please enter at least one skill');
      return;
    }
    if (form.performanceScore < 0 || form.performanceScore > 100) {
      toast.error('Performance score must be 0-100');
      return;
    }
    setLoading(true);
    try {
      await employeeAPI.add({
        ...form,
        skills: skillsArray,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      toast.success('Employee added successfully! 🎉');
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-employee-page">
      <div className="page-header">
        <h1>➕ Add New Employee</h1>
        <p>Fill in the details to register a new employee</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-section">
            <h3 className="section-label">Personal Information</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Aman Verma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. aman@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-label">Work Details</h3>
            <div className="form-group">
              <label>Department *</label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              >
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Skills * (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, MongoDB, Python"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                required
              />
              <span className="form-hint">Separate multiple skills with commas</span>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-label">Performance Metrics</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Performance Score * (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 85"
                  value={form.performanceScore}
                  onChange={(e) => setForm({ ...form, performanceScore: e.target.value })}
                  required
                />
                {form.performanceScore && (
                  <div className="score-preview">
                    <div className="score-bar" style={{ marginTop: '8px' }}>
                      <div className="score-fill" style={{
                        width: `${form.performanceScore}%`,
                        background: form.performanceScore >= 80 ? '#10b981' : form.performanceScore >= 60 ? '#f59e0b' : '#ef4444'
                      }}></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Years of Experience *</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 3"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/employees')}>
              ← Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Saving...' : '✅ Add Employee'}
            </button>
          </div>
        </form>

        {/* Preview Card */}
        <div className="preview-panel">
          <h3 className="section-label">Live Preview</h3>
          <div className="preview-card">
            <div className="preview-avatar">{form.name ? form.name[0].toUpperCase() : '?'}</div>
            <h3 className="preview-name">{form.name || 'Employee Name'}</h3>
            <p className="preview-email">{form.email || 'email@example.com'}</p>
            <p className="preview-dept">{form.department}</p>
            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Performance: {form.performanceScore || 0}%</p>
              <div className="score-bar">
                <div className="score-fill" style={{
                  width: `${form.performanceScore || 0}%`,
                  background: form.performanceScore >= 80 ? '#10b981' : form.performanceScore >= 60 ? '#f59e0b' : '#ef4444'
                }}></div>
              </div>
            </div>
            <div className="preview-skills">
              {form.skills.split(',').filter(Boolean).map((s, i) => (
                <span key={i} className="skill-tag">{s.trim()}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
