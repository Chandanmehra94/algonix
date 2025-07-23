import { useState, useEffect, useContext } from 'react'; // Added useContext
import { Link, useNavigate } from 'react-router-dom'; // Added Link
import { AuthContext } from '../context/AuthContext'; // Added AuthContext
import axios from 'axios';
import '../styles/Tutorials.css';

function Tutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [newTutorial, setNewTutorial] = useState({ iframeLink: '', directLink: '', topic: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // Added user and logout from AuthContext

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const res = await axios.get(`https://algonix-backend.onrender.com/api/tutorials`);
      setTutorials(res.data);
    } catch (err) {
      setError('Failed to fetch tutorials');
    }
  };

  
  console.log("API URL is:", `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/tutorials`);


  const handleAddTutorial = async (e) => {
    e.preventDefault();
    if (!newTutorial.iframeLink || !newTutorial.directLink || !newTutorial.topic) {
      setError('All fields are required');
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/tutorials`, newTutorial, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewTutorial({ iframeLink: '', directLink: '', topic: '' });
      fetchTutorials();
      setError('');
    } catch (err) {
      setError('Failed to add tutorial');
    }
  };

  const handleRemoveTutorial = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/tutorials/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTutorials();
    } catch (err) {
      setError('Failed to remove tutorial');
    }
  };

  const handleChangeTutorial = async (id) => {
    const updatedTutorial = { ...tutorials.find(t => t._id === id), iframeLink: prompt('Enter new iframe link:'), directLink: prompt('Enter new direct link:'), topic: prompt('Enter new topic:') };
    try {
      await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/tutorials/${id}`, updatedTutorial, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTutorials();
    } catch (err) {
      setError('Failed to update tutorial');
    }
  };

  const isAdmin = localStorage.getItem('token') && JSON.parse(atob(localStorage.getItem('token').split('.')[1])).email === 'chandandehariya149@gmail.com';

  const toggleDropdown = (e) => {
    const dropdown = e.currentTarget.querySelector('.dropdown-content');
    dropdown.classList.toggle('show');
  };

  return (
    <div className="tutorials-container">
      <nav className="tutorials-nav">
        <div className="nav-content">
          <a href="/" className="logo">ALGONIX</a>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/sheet">Sheet</a>
            <a href="/author">Author</a>
            {user ? (
              <div className="profile-dropdown" onClick={toggleDropdown}>
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
                  <Link to="/profile" className="dropdown-item">My Profile</Link>
                  <button onClick={logout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login">Login/Signup</Link>
            )}
          </div>
        </div>
      </nav>
      <div className="tutorials-header">
        <h2>Video Tutorials</h2>
        <p>Explore our collection of video tutorials to enhance your learning.</p>
      </div>
      <div className="tutorials-content">
        {tutorials.map(tutorial => (
          <div key={tutorial._id} className="tutorials-card">
            <iframe
              src={tutorial.iframeLink}
              title={tutorial.topic}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="tutorials-info">
              <h3>{tutorial.topic}</h3>
              <a href={tutorial.directLink} className="learn-btn">Learn</a>
            </div>
            {isAdmin && (
              <div className="admin-controls">
                <button onClick={() => handleRemoveTutorial(tutorial._id)}>Remove Video</button>
                <button onClick={() => handleChangeTutorial(tutorial._id)}>Change Video</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {isAdmin && (
        <div className="admin-actions">
          <form onSubmit={handleAddTutorial}>
            <input
              type="text"
              placeholder="Iframe Link"
              value={newTutorial.iframeLink}
              onChange={(e) => setNewTutorial({ ...newTutorial, iframeLink: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Direct Link"
              value={newTutorial.directLink}
              onChange={(e) => setNewTutorial({ ...newTutorial, directLink: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Topic"
              value={newTutorial.topic}
              onChange={(e) => setNewTutorial({ ...newTutorial, topic: e.target.value })}
              required
            />
            <button type="submit">Add Video</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default Tutorials;
