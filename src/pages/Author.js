import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Author.css';
import { Link } from 'react-router-dom';

function Author() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="author-container">
      <nav className="author-nav">
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
      <div className="author-content">
        <h2>Meet Your Mentor</h2>
        <div className="author-details">
          <img src="/assets/mentor.png" alt="Chandan Dehariya" className="author-photo" />
          <h3>Chandan Dehariya</h3>
          <p>
            Chandan Dehariya is the founder of Algonix, a passionate coder, and a machine learning enthusiast.
            With a mission to empower Indian coders and entrepreneurs, he started Algonix to build a vibrant
            community where anyone can learn to code, compete, and grow. Chandan believes in making quality
            education accessible to all, offering 100% free content and 24/7 support to learners.
          </p>
          <p>
            His expertise spans multiple programming languages, data structures, algorithms, and ML. Through
            Algonix, he provides comprehensive resources, including tutorials, coding sheets, and a compiler,
            to help beginners and advanced coders alike. Follow him on social media to stay updated on his
            latest initiatives!
          </p>
          <div className="author-links">
            <a href="https://www.linkedin.com/in/chandandehariya">LinkedIn</a>
            <a href="https://github.com/chandandehariya">GitHub</a>
            <a href="https://chandandehariya.vercel.app/">Portfolio</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Author;
