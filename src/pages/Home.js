import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Home.css';

function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

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

  const scrollToLanguages = () => {
    document.querySelector('.languages').scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const subject = encodeURIComponent(`Contact Form Submission from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
    const mailtoLink = `mailto:chandandehariya149@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    setSubmitStatus('success');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div>
      <header className="header">
        <div className="logo">ALGONIX</div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/tutorials">Tutorials</Link>
          <a href="https://www.linkedin.com/company/algonix">Events</a>
         <Link to="/sheet">Author</Link>
          <Link to="/author">Author</Link>
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
        </nav>
      </header>
      <div className="main-content">
        <section className="welcome-section">
          <div className="welcome-content">
            <img
              src="/assets/logogo.png" // Replace with your actual logo path
              alt="Algonix Logo"
              className="welcome-logo"
              data-animate="fade-scale"
              data-delay="0.1s"
            />
            <h1 data-animate="fade-slide">CODE, COMPETE, WIN!</h1>
            <p data-animate="fade-slide" data-delay="0.2s">
              Hey folks, Welcome to Algonix. Algonix is an effort to build a community of coders and entrepreneurs in India...
            </p>
            <button className="get-started-btn" onClick={scrollToLanguages} data-animate="fade-scale" data-delay="0.4s">
              Get Started
            </button>
            <div className="social-links" data-animate="fade-slide" data-delay="0.6s">
              <a href="https://www.facebook.com/profile.php?id=61566377129881">
                <img src="/assets/fb.png" alt="Facebook" className="iconn" />
              </a>
              <a href="https://www.instagram.com">
                <img src="/assets/ig.jpeg" alt="Instagram" className="iconn" />
              </a>
              <a href="https://www.instagram.com">
                <img src="/assets/x.png" alt="Twitter" className="iconn" />
              </a>
              <a href="https://www.linkedin.com/company/algonix">
                <img src="/assets/linkedin.png" alt="LinkedIn" className="iconn" />
              </a>
              <a href="https://www.youtube.com/@chandanmehra94">
                <img src="/assets/yt.png" alt="YouTube" className="iconn" />
              </a>
              <a href="https://www.instagram.com">
                <img src="/assets/mail.png" alt="Email" className="iconn" />
              </a>
            </div>
          </div>
          <img src="/assets/lapp2.jpg" alt="Hero Image" className="welcome-image" />
        </section>
        <section className="intro-image" data-animate="fade">
          <p className="video-caption">Explore Algonix: Your journey to mastering coding starts here!</p>
          <iframe
            className="intro-video"
            src="https://www.youtube.com/embed/zPPsXRqM3g0?si=_RfCpkj8X8uSKs2F"
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </section>
        <section className="languages">
          <h2 data-animate="fade-slide">Languages & Resources</h2>
          <div className="language-cards">
            <Link to="/language/cpp" className="language-card" data-animate="fade-slide" data-delay="0.2s">
              <img src="/assets/cpp1.png" alt="C++ Programming" />
              <h3>C++ PROGRAMMING</h3>
            </Link>
            <Link to="/language/java" className="language-card" data-animate="fade-slide" data-delay="0.3s">
              <img src="/assets/java.jpeg" alt="Java Programming" />
              <h3>JAVA PROGRAMMING</h3>
            </Link>
            <Link to="/language/python" className="language-card" data-animate="fade-slide" data-delay="0.4s">
              <img src="/assets/python.png" alt="Python Programming" />
              <h3>PYTHON PROGRAMMING</h3>
            </Link>
            <Link to="/language/dsa" className="language-card" data-animate="fade-slide" data-delay="0.5s">
              <img src="/assets/dssa.png" alt="DSA Programming" />
              <h3>DATA STRUCTURES & ALGORITHMS</h3>
            </Link>
          </div>
          <div className="sheet-section">
            <div className="sheet-containerr">
              <Link to="/sheet" className="sheet-card" data-animate="fade-slide" data-delay="0.6s">
                <img src="/assets/sheet-icon.png" alt="Coding Sheet" />
                <h3>ALGONIX CODING SHEET</h3>
              </Link>
              <div className="sheet-description" data-animate="fade-slide" data-delay="0.7s">
                <h3>Master Coding with Our Sheet</h3>
                <p>
                  Algonix Coding Sheet is your ultimate resource to practice and master data structures and algorithms.
                  Curated by experts, it includes 149 hand-picked problems with solutions, YouTube explanations, and code snippets.
                  Track your progress and level up your coding skills!
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="tutorial-video-sec">
          <h2 data-animate="fade-slide">Learn with Video Tutorials</h2>
          <div className="tutorial-video-card" onClick={() => navigate('/tutorials')}>
            <img
              src="/assets/tuto.jpg"
              alt="Tutorial"
              style={{ width: '8cm', height: '5cm', mixBlendMode: 'multiply' }}
            />
            <button className="tutorial-btn">Explore Tutorials</button>
          </div>
          <div className="tutorial-info">
            <h3>Master Coding with Expert-Led Videos</h3>
            <p>
              Our video tutorials are designed to help you master coding concepts with ease. Whether you're a beginner or an advanced learner, 
              Algonix offers step-by-step guidance through real-world examples, practical tips, and hands-on coding challenges.
            </p>
            <p>
              From data structures to algorithms, programming languages to problem-solving techniques, our tutorials cover it all. 
              Learn at your own pace, revisit concepts anytime, and build your skills with engaging video content curated by experts.
            </p>
            <ul className="tutorial-highlights">
              <li>🎥 High-quality, easy-to-follow videos</li>
              <li>💻 Practical coding examples</li>
              <li>⏰ Learn anytime, anywhere</li>
            </ul>
            <button 
              className="secondary-tutorial-btn" 
              onClick={() => navigate('/tutorials')}
            >
              Start Learning Now!
            </button>
          </div>
        </section>
        <section className="features">
          <h2 data-animate="fade-slide">Why Choose Algonix?</h2>
          <div className="feature-cards">
            <div className="feature-card" data-animate="fade-scale" data-delay="0.2s">
              <div className="icon">🛒</div>
              <h3>100% Free Content</h3>
              <p>Don't let your pockets stop you again! We really mean that.</p>
            </div>
            <div className="feature-card" data-animate="fade-scale" data-delay="0.3s">
              <div className="icon">🕒</div>
              <h3>24/7 Availability</h3>
              <p>Our team is available day and night to fulfill your queries.</p>
            </div>
            <div className="feature-card" data-animate="fade-scale" data-delay="0.4s">
              <div className="icon">⬆️</div>
              <h3>Be Zero to Hero</h3>
              <p>Our content is prepared for anyone to start coding without experience.</p>
            </div>
            <div className="feature-card" data-animate="fade-scale" data-delay="0.5s">
              <div className="icon">♾️</div>
              <h3>Learn Without Limits</h3>
              <p>We don't limit your creativity. Ask for any study material!</p>
            </div>
          </div>
        </section>
        <section className="contact-us" data-animate="fade">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="message">Message*</label>
            <textarea
              id="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>
            <button type="submit">Submit</button>
          </form>
          {submitStatus === 'success' && (
            <p className="success-message">Thank you, {formData.name}! Your email client has been opened to send the message.</p>
          )}
          {submitStatus === 'error' && (
            <p className="error-message">Oops! No email client found. Please try again or contact us manually.</p>
          )}
        </section>
      </div>
      <footer className="footer" data-animate="fade">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Algonix</h3>
            <p>Empowering coders and entrepreneurs in India with free, high-quality resources.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <a href="https://www.linkedin.com/company/algonix">About Us</a>
              <a href="https://www.linkedin.com/company/algonix">Events</a>
              <Link to="/sheet">Sheet</Link>
              <Link to="/tutorials">Tutorials</Link>
            </div>
          </div>
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="footer-links">
              <a href="https://www.linkedin.com/company/algonix">LinkedIn</a>
              <a href="https://www.instagram.com">Instagram</a>
              <a href="https://www.facebook.com/profile.php?id=61566377129881">Facebook</a>
              <a href="tel:+919827228241">Phone: +91 9827228241</a>
              <a href="mailto:chandandehariya149@gmail.com">Email: contact@algonix.com</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Algonix. All rights reserved. Designed and developed by Chandan Dehariya.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
