import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/LanguageOverview.css';

function LanguageOverview() {
  const { lang } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState('');
  const [addForm, setAddForm] = useState({ topic: '', subtopic: '', content: '' });
  const [changeForm, setChangeForm] = useState({ id: '', topic: '', subtopic: '', content: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [showRemoveForm, setShowRemoveForm] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL'}/api/materials/${lang.toLowerCase()}`);
        setMaterials(res.data);
        setError('');
      } catch (err) {
        setError(`Failed to load materials: ${err.response?.data?.msg || err.message}`);
      }
    };
    fetchMaterials();
  }, [lang]);

  const handleAddContent = async (e) => {
    e.preventDefault();
    if (!addForm.subtopic.trim()) {
      setError('Subtopic is required');
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL'}/api/materials`,
        { language: lang.toLowerCase(), ...addForm },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMaterials([...materials, res.data]);
      setAddForm({ topic: '', subtopic: '', content: '' });
      setShowAddForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add content');
    }
  };

  const handleChangeContent = async (e) => {
    e.preventDefault();
    if (!changeForm.id) {
      setError('Please select a material to update');
      return;
    }
    if (!changeForm.subtopic.trim()) {
      setError('Subtopic is required');
      return;
    }
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/materials/${changeForm.id}`,
        { topic: changeForm.topic, subtopic: changeForm.subtopic, content: changeForm.content },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMaterials(materials.map(m => m._id === changeForm.id ? res.data : m));
      setChangeForm({ id: '', topic: '', subtopic: '', content: '' });
      setShowChangeForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update content');
    }
  };

  const handleRemoveContent = async (e) => {
    e.preventDefault();
    if (!changeForm.id) {
      setError('Please select a material to remove');
      return;
    }
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/materials/${changeForm.id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMaterials(materials.filter(m => m._id !== changeForm.id));
      setChangeForm({ id: '', topic: '', subtopic: '', content: '' });
      setShowRemoveForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to remove content');
    }
  };

  const handleImageUpload = async (e, isAddForm) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/upload-material-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const imageId = res.data.imageId;
      const updatedContent = isAddForm
        ? `${addForm.content}[img]${imageId}[/img]`
        : `${changeForm.content}[img]${imageId}[/img]`;
      isAddForm
        ? setAddForm({ ...addForm, content: updatedContent })
        : setChangeForm({ ...changeForm, content: updatedContent });
    } catch (err) {
      console.error('Upload error:', err.response ? err.response.data : err.message);
      setError('Image upload failed: ' + (err.response?.data?.msg || err.message));
    }
  };

  const isAdmin = user?.email === 'chandandehariya149@gmail.com';

  const toggleDropdown = (e) => {
    const dropdown = e.currentTarget.querySelector('.dropdown-content');
    dropdown.classList.toggle('show');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdowns = document.querySelectorAll('.dropdown-content');
      dropdowns.forEach(dropdown => {
        if (!dropdown.parentElement.contains(e.target)) {
          dropdown.classList.remove('show');
        }
      });
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="language-overview-container">
      <nav className="language-nav">
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
      {/* <div className="language-overview-header">
        <img src={`https://www.vectorlogo.zone/logos/${lang}/${lang}-icon.svg`} alt={`${lang} Logo`} className="language-logo" />
        <h2>Learn {lang.toUpperCase()} Programming</h2>
        <p>{lang} is a powerful programming language used for various applications. Our tutorial will guide you step by step.</p>
      </div> */}
      <div className="language-overview-header">
  <img
    src={
      lang === 'cpp'
        ? `/assets/cpp1.png`
        : lang === 'dsa'
        ? `/assets/dssa.png`
        : `https://www.vectorlogo.zone/logos/${lang}/${lang}-icon.svg`
    }
    alt={`${lang} Logo`}
    className="language-logo"
  />
  <h2>Learn {lang.toUpperCase()} Programming</h2>
  <p>
    {lang === 'dsa'
      ? 'DSA (Data Structures and Algorithms) is a core concept in computer science that teaches you how to organize and process data efficiently. Our tutorial will guide you step by step.'
      : `${lang} is a powerful programming language used for various applications. Our tutorial will guide you step by step.`}
  </p>
</div>
      <div className="language-content">
        {[...new Set(materials.map(m => m.topic))].map((topic, index) => (
          <div key={index} className="content-card">
            <h3>{topic}</h3>
            <ul>
              {materials.filter(m => m.topic === topic).map(m => (
                <li key={m._id} onClick={() => navigate(`/language/${lang}/${encodeURIComponent(m.topic)}/${encodeURIComponent(m.subtopic)}`)}>
                  {m.subtopic}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {isAdmin && (
        <div className="admin-actions">
          <button onClick={() => setShowAddForm(true)}>Add Content</button>
          <button onClick={() => setShowChangeForm(true)}>Change Content</button>
          <button onClick={() => setShowRemoveForm(true)}>Remove Content</button>
        </div>
      )}
      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowAddForm(false)}>✖</button>
            <h3>Add Content</h3>
            <form onSubmit={handleAddContent}>
              <label>Topic</label>
              <input value={addForm.topic} onChange={(e) => setAddForm({ ...addForm, topic: e.target.value })} required />
              <label>Subtopic</label>
              <input value={addForm.subtopic} onChange={(e) => setAddForm({ ...addForm, subtopic: e.target.value })} required />
              <label>Content</label>
              <textarea value={addForm.content} onChange={(e) => setAddForm({ ...addForm, content: e.target.value })} required />
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
              <button type="submit">Add</button>
            </form>
          </div>
        </div>
      )}
      {showChangeForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowChangeForm(false)}>✖</button>
            <h3>Change Content</h3>
            <form onSubmit={handleChangeContent}>
              <label>Select Material</label>
              <select value={changeForm.id} onChange={(e) => {
                const selected = materials.find(m => m._id === e.target.value);
                setChangeForm({ id: e.target.value, topic: selected?.topic || '', subtopic: selected?.subtopic || '', content: selected?.content || '' });
              }} required>
                <option value="">Select a material</option>
                {materials.map(m => <option key={m._id} value={m._id}>{m.topic} - {m.subtopic}</option>)}
              </select>
              <label>Topic</label>
              <input value={changeForm.topic} onChange={(e) => setChangeForm({ ...changeForm, topic: e.target.value })} required />
              <label>Subtopic</label>
              <input value={changeForm.subtopic} onChange={(e) => setChangeForm({ ...changeForm, subtopic: e.target.value })} required />
              <label>Content</label>
              <textarea value={changeForm.content} onChange={(e) => setChangeForm({ ...changeForm, content: e.target.value })} required />
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      )}
      {showRemoveForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowRemoveForm(false)}>✖</button>
            <h3>Remove Content</h3>
            <form onSubmit={handleRemoveContent}>
              <label>Select Material</label>
              <select value={changeForm.id} onChange={(e) => {
                const selected = materials.find(m => m._id === e.target.value);
                setChangeForm({ id: e.target.value, topic: selected?.topic || '', subtopic: selected?.subtopic || '', content: selected?.content || '' });
              }} required>
                <option value="">Select a material</option>
                {materials.map(m => <option key={m._id} value={m._id}>{m.topic} - {m.subtopic}</option>)}
              </select>
              <button type="submit">Remove</button>
            </form>
          </div>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default LanguageOverview;
