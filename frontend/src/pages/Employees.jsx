import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI, getScoreColor, getScoreBadge } from '../utils/api';
import toast from 'react-hot-toast';
import './Employees.css';

const DEPARTMENTS = ['All', 'Development', 'Marketing', 'HR', 'Finance', 'Design', 'Sales', 'Operations'];

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [editEmp, setEditEmp] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dept !== 'All') params.department = dept;
      if (search) params.name = search;
      const { data } = dept === 'All' && !search
        ? await employeeAPI.getAll()
        : await employeeAPI.search(params);
      setEmployees(data.employees);
    } catch (err) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 400);
    return () => clearTimeout(timer);
  }, [search, dept]);

  const handleDelete = async (id) => {
    try {
      await employeeAPI.delete(id);
      toast.success('Employee deleted');
      setDeleteId(null);
      fetchEmployees();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        ...editEmp,
        skills: typeof editEmp.skills === 'string' ? editEmp.skills.split(',').map(s => s.trim()) : editEmp.skills,
      };
      await employeeAPI.update(editEmp._id, updated);
      toast.success('Employee updated!');
      setEditEmp(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="employees-page">
      <div className="page-header">
        <h1>👥 Employee Directory</h1>
        <p>{employees.length} employees found</p>
      </div>

      {/* Search & Filter */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍  Search by name..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="dept-filters">
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              className={`dept-btn ${dept === d ? 'active' : ''}`}
              onClick={() => setDept(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add-employee')}>
          ➕ Add Employee
        </button>
      </div>

      {/* Employee Grid */}
      {loading ? (
        <div className="loading"><div className="spinner"></div><p>Loading...</p></div>
      ) : employees.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No Employees Found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="emp-grid">
          {employees.map((emp) => {
            const badge = getScoreBadge(emp.performanceScore);
            return (
              <div key={emp._id} className="emp-card">
                <div className="emp-card-header">
                  <div className="emp-avatar-large">{emp.name[0]}</div>
                  <div>
                    <h3 className="emp-card-name">{emp.name}</h3>
                    <p className="emp-card-dept">{emp.department}</p>
                  </div>
                  <span className={`badge ${badge.cls}`}>{badge.text}</span>
                </div>

                <div className="emp-card-score">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Performance</span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: getScoreColor(emp.performanceScore) }}>
                      {emp.performanceScore}%
                    </span>
                  </div>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${emp.performanceScore}%`, background: getScoreColor(emp.performanceScore) }}></div>
                  </div>
                </div>

                <div className="emp-card-info">
                  <div className="info-item">
                    <span>📧</span>
                    <span>{emp.email}</span>
                  </div>
                  <div className="info-item">
                    <span>⏱️</span>
                    <span>{emp.experience} years exp.</span>
                  </div>
                </div>

                <div className="emp-skills">
                  {emp.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                  {emp.skills.length > 4 && <span className="skill-tag">+{emp.skills.length - 4}</span>}
                </div>

                <div className="emp-card-actions">
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditEmp({ ...emp, skills: emp.skills.join(', ') })}>
                    ✏️ Edit
                  </button>
                  <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => setDeleteId(emp._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editEmp && (
        <div className="modal-overlay" onClick={() => setEditEmp(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Edit Employee</h3>
              <button className="modal-close" onClick={() => setEditEmp(null)}>✕</button>
            </div>
            <form onSubmit={handleUpdate} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input value={editEmp.name} onChange={(e) => setEditEmp({ ...editEmp, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select value={editEmp.department} onChange={(e) => setEditEmp({ ...editEmp, department: e.target.value })}>
                  {DEPARTMENTS.filter(d => d !== 'All').map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input value={editEmp.skills} onChange={(e) => setEditEmp({ ...editEmp, skills: e.target.value })} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Performance Score (0-100)</label>
                  <input type="number" min="0" max="100" value={editEmp.performanceScore} onChange={(e) => setEditEmp({ ...editEmp, performanceScore: Number(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input type="number" min="0" value={editEmp.experience} onChange={(e) => setEditEmp({ ...editEmp, experience: Number(e.target.value) })} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>💾 Save Changes</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditEmp(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3>Delete Employee?</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" style={{ flex: 1, background: 'var(--accent-danger)', color: 'white' }} onClick={() => handleDelete(deleteId)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
