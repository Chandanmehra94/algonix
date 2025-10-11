import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/Sheet.css';
import { Link } from 'react-router-dom';

function Sheet() {
  const { user, logout } = useContext(AuthContext);
  const [sheets, setSheets] = useState([]);
  const [progress, setProgress] = useState([]);
  const [form, setForm] = useState({ question: '', solution: '', websiteLink: '', code: '' });
  const [editingId, setEditingId] = useState(null);
  const [visibleCode, setVisibleCode] = useState({});
  const [selectedCode, setSelectedCode] = useState(null); // For modal

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/sheet`)
      .then(res => setSheets(res.data));
    if (user) {
      axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/sheet/progress`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => setProgress(res.data));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/sheet/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setEditingId(null);
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/sheet`,
          form,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      }
      setForm({ question: '', solution: '', websiteLink: '', code: '' });
      const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/sheet`);
      setSheets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (sheet) => {
    setForm(sheet);
    setEditingId(sheet._id);
  };

  const handleDelete = async (sheetId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/sheet/${sheetId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/sheet`);
        setSheets(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleCode = (id, code) => {
    setSelectedCode(selectedCode && selectedCode.id === id ? null : { id, code });
  };

  const toggleSolved = async (sheetId, solved) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/sheet/progress`,
        { sheetId, solved },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setProgress((prev) => {
        const updated = prev.filter((p) => p.sheetId.toString() !== sheetId);
        return [...updated, res.data];
      });
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = user?.email === 'chandandehariya149@gmail.com';

  return (
    <div className="sheet-container">
      <nav className="sheet-nav">
        <div className="nav-content">
          <a href="/" className="logo">ALGONIX</a>
          <div className="nav-links">
            <a href="/">Home</a>
            <Link to="/sheet">Sheet</Link>
            <Link to="/author">Author</Link>
           
            {user ? (
              <div className="profile-dropdown">
               <img
      src={
        user.profilePhoto &&
        user.profilePhoto !== '/assets/default-profile.png' &&
        user.profilePhoto !== ''
          ? `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/profile/photo/${user._id}`
          : '/assets/default-profile.png'
      }
      alt="Profile"
      className="profile-photo"
    />
                <div className="dropdown-content">
                  <a href="/profile">My Profile</a>
                  <button onClick={logout}>Logout</button>
                </div>
              </div>
            ) : (
              <a href="/login">Login</a>
            )}
          </div>
        </div>
      </nav>
      <h2>Chandan's 149 Sheet</h2>
      {isAdmin && (
        <div className="sheet-form">
          <h3>{editingId ? 'Edit' : 'Add'} Question</h3>
          <form>
            <input
              type="text"
              placeholder="Question"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
            <input
              type="text"
              placeholder="Solution (YouTube Link)"
              value={form.solution}
              onChange={(e) => setForm({ ...form, solution: e.target.value })}
            />
            <input
              type="text"
              placeholder="Website Link"
              value={form.websiteLink}
              onChange={(e) => setForm({ ...form, websiteLink: e.target.value })}
            />
            <textarea
              placeholder="Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            ></textarea>
            <button type="button" onClick={handleSubmit}>
              {editingId ? 'Update' : 'Add'}
            </button>
          </form>
        </div>
      )}
      <table className="sheet-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Solution</th>
            <th>Website</th>
            <th>Code</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sheets.map((sheet) => {
            const progressEntry = progress.find((p) => p.sheetId.toString() === sheet._id.toString());
            const isSolved = progressEntry?.solved || false;
            return (
              <tr key={sheet._id}>
                <td>{sheet.question}</td>
                <td>
                  {sheet.solution && (
                    <a href={sheet.solution} target="_blank" rel="noopener noreferrer">
                      <img src="/assets/yt.png" alt="YouTube" className="yt-icon" />
                    </a>
                  )}
                </td>
                <td>
                  {sheet.websiteLink && (
                    <a href={sheet.websiteLink} target="_blank" rel="noopener noreferrer">
                      <img src="/assets/website.png" alt="Website" className="website-icon" />
                    </a>
                  )}
                </td>
                <td>
                  {sheet.code && (
                    <button onClick={() => toggleCode(sheet._id, sheet.code)} className="see-code-btn">
                      {selectedCode?.id === sheet._id ? 'Hide Code' : 'See Code'}
                    </button>
                  )}
                </td>
                <td>
                  {isAdmin ? (
                    <div className="admin-actions">
                      <button onClick={() => handleEdit(sheet)}>Edit</button>
                      <button onClick={() => handleDelete(sheet._id)} className="delete-btn">Delete</button>
                    </div>
                  ) : (
                    <button
                      className={`status-btn ${isSolved ? 'solved' : 'not-solved'}`}
                      onClick={() => toggleSolved(sheet._id, !isSolved)}
                    >
                      {isSolved ? 'Solved' : 'Not Solved'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedCode && (
        <div className="code-modal">
          <div className="code-modal-content">
            <button className="code-modal-close" onClick={() => setSelectedCode(null)}>✖</button>
            <h3>Code</h3>
            <pre>{selectedCode.code}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sheet;
