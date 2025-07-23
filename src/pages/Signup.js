import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password, whatsapp);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <nav className="auth-nav">
        <div className="nav-content">
          <a href="/" className="logo">ALGONIX</a>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/sheet">Sheet</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </nav>
      <div className="auth-box">
        <h2>Signup</h2>
        {error && <p className="error">{error}</p>}
        <form>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="whatsapp">WhatsApp Number</label>
          <input
            type="text"
            id="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <button type="button" onClick={handleSubmit}>Signup</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;