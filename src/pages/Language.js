import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import axios from 'axios';
import '../styles/Language.css';
import { Link } from 'react-router-dom';

function Language() {
  const { lang, topic: urlTopic, subtopic: urlSubtopic } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [materials, setMaterials] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(decodeURIComponent(urlTopic || ''));
  const [selectedSubtopic, setSelectedSubtopic] = useState(decodeURIComponent(urlSubtopic || ''));
  const [selectedContent, setSelectedContent] = useState('');
  const [error, setError] = useState('');
  const [compilerLang, setCompilerLang] = useState(lang);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/materials/${lang.toLowerCase()}`);
        const validMaterials = res.data.filter(m => m.subtopic && m.subtopic.trim());
        setMaterials(validMaterials);
        if (validMaterials.length > 0) {
          const defaultTopic = decodeURIComponent(urlTopic) || validMaterials[0].topic;
          const defaultSubtopic = decodeURIComponent(urlSubtopic) || validMaterials.find(m => m.topic === defaultTopic)?.subtopic || '';
          setSelectedTopic(defaultTopic);
          setSelectedSubtopic(defaultSubtopic);
          setSelectedContent(validMaterials.find(m => m.topic === defaultTopic && m.subtopic === defaultSubtopic)?.content || '');
        } else {
          setSelectedTopic('');
          setSelectedSubtopic('');
          setSelectedContent('');
        }
        setError('');
      } catch (err) {
        setError(`Failed to load materials: ${err.response?.data?.msg || err.message}`);
      }
    };
    fetchMaterials();
  }, [lang, urlTopic, urlSubtopic]);

  const runCode = async () => {
    setOutput('Running code...');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/compile`, {
        script: code,
        language: compilerLang === 'cpp' ? 'cpp17' : compilerLang === 'java' ? 'java' : 'python3',
        input
      });
      setOutput(res.data.output || 'No output');
    } catch (err) {
      setOutput('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const extensions = {
    cpp: [cpp()],
    java: [java()],
    python: [python()]
  };

  const handleTopicClick = (topic) => {
    const firstSubtopic = materials.find(m => m.topic === topic)?.subtopic || '';
    if (firstSubtopic) {
      setSelectedTopic(topic);
      setSelectedSubtopic(firstSubtopic);
      setSelectedContent(materials.find(m => m.topic === topic && m.subtopic === firstSubtopic)?.content || '');
      navigate(`/language/${lang}/${encodeURIComponent(topic)}/${encodeURIComponent(firstSubtopic)}`);
    }
  };

  const handleSubtopicClick = (subtopic) => {
    if (subtopic) {
      setSelectedSubtopic(subtopic);
      setSelectedContent(materials.find(m => m.topic === selectedTopic && m.subtopic === subtopic)?.content || '');
      navigate(`/language/${lang}/${encodeURIComponent(selectedTopic)}/${encodeURIComponent(subtopic)}`);
    }
  };

  const handleLogoClick = () => {
    if (lang === 'java') {
      navigate('/language/java');
    }
    if (lang === 'cpp') {
      navigate('/language/cpp');
    }
    if (lang === 'python') {
      navigate('/language/python');
    }
    if (lang === 'dsa') {
      navigate('/language/dsa');
    }
  };

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

  const renderContent = () => {
    if (!selectedContent) return <p>No content available</p>;

    const parts = [];
    let currentIndex = 0;

    while (currentIndex < selectedContent.length) {
      const codeStart = selectedContent.indexOf('[code]', currentIndex);
      const imgStart = selectedContent.indexOf('[img]', currentIndex);
      const boldStart = selectedContent.indexOf('[b]', currentIndex);
      const lineBreak = selectedContent.indexOf('<br>', currentIndex);

      const nextMarker = Math.min(
        codeStart !== -1 ? codeStart : Infinity,
        imgStart !== -1 ? imgStart : Infinity,
        boldStart !== -1 ? boldStart : Infinity,
        lineBreak !== -1 ? lineBreak : Infinity
      );

      if (nextMarker === Infinity) {
        parts.push({ type: 'text', content: selectedContent.substring(currentIndex) });
        break;
      }

      if (nextMarker > currentIndex) {
        parts.push({ type: 'text', content: selectedContent.substring(currentIndex, nextMarker) });
      }

      if (nextMarker === codeStart && codeStart !== -1) {
        const codeEnd = selectedContent.indexOf('[/code]', codeStart);
        if (codeEnd !== -1) {
          const codeContent = selectedContent.substring(codeStart + 6, codeEnd).trim();
          parts.push({ type: 'code', content: codeContent });
          currentIndex = codeEnd + 7;
        } else {
          currentIndex = codeStart + 1;
        }
      } else if (nextMarker === imgStart && imgStart !== -1) {
        const imgEnd = selectedContent.indexOf('[/img]', imgStart);
        if (imgEnd !== -1) {
          const imgPath = selectedContent.substring(imgStart + 5, imgEnd).trim();
          parts.push({ type: 'img', content: imgPath });
          currentIndex = imgEnd + 6;
        } else {
          currentIndex = imgStart + 1;
        }
      } else if (nextMarker === boldStart && boldStart !== -1) {
        const boldEnd = selectedContent.indexOf('[/b]', boldStart);
        if (boldEnd !== -1) {
          const boldContent = selectedContent.substring(boldStart + 3, boldEnd).trim();
          parts.push({ type: 'bold', content: boldContent });
          currentIndex = boldEnd + 4;
        } else {
          currentIndex = boldStart + 1;
        }
      } else if (nextMarker === lineBreak && lineBreak !== -1) {
        parts.push({ type: 'linebreak' });
        currentIndex = lineBreak + 4; // '<br>' is 4 characters
      }
    }

    let currentParagraph = [];
    const renderedParts = [];

    parts.forEach((part, index) => {
      if (part.type === 'text' || part.type === 'bold') {
        currentParagraph.push(
          part.type === 'bold' ? (
            <span key={`bold-${index}`} style={{ fontWeight: 'bold' }}>{part.content}</span>
          ) : (
            <span key={`text-${index}`}>{part.content}</span>
          )
        );
      } else if (part.type === 'linebreak') {
        if (currentParagraph.length > 0) {
          renderedParts.push(<p key={`para-${index}`}>{currentParagraph}</p>);
          currentParagraph = [];
        }
      } else if (part.type === 'code') {
        if (currentParagraph.length > 0) {
          renderedParts.push(<p key={`para-${index}`}>{currentParagraph}</p>);
          currentParagraph = [];
        }
        renderedParts.push(
          <pre key={`code-${index}`} className="code-block">
            <code>{part.content}</code>
          </pre>
        );
      } else if (part.type === 'img') {
        if (currentParagraph.length > 0) {
          renderedParts.push(<p key={`para-${index}`}>{currentParagraph}</p>);
          currentParagraph = [];
        }
        renderedParts.push(
          <img
            key={`img-${index}`}
            src={`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}${part.content}`}
            alt={`Image ${index + 1}`}
            className="content-image"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        );
      }
    });

    if (currentParagraph.length > 0) {
      renderedParts.push(<p key="final-para">{currentParagraph}</p>);
    }

    return renderedParts;
  };

  return (
    <div className="language-container">
      <nav className="language-nav">
        <div className="nav-content">
          <a href="/" className="logo" onClick={handleLogoClick}>ALGONIX</a>
          <div className="nav-links">
            <a href="/">Home</a>
            <Link to="/sheet">Sheet</Link>
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
      <div className="language-main">
        <div className="language-header">
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
  onClick={handleLogoClick}
/>
          <div className="topics-list">
            {[...new Set(materials.map(m => m.topic))].map((topic, index) => (
              <div key={index} className={`topic-item ${selectedTopic === topic ? 'open' : ''}`}>
                <button
                  className={`topic-button ${selectedTopic === topic ? 'active' : ''}`}
                  onClick={() => handleTopicClick(topic)}
                >
                  <span>{topic}</span>
                  {selectedTopic === topic ? (
                    <svg className="topic-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z" />
                    </svg>
                  ) : (
                    <svg className="topic-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 16l6-6-1.41-1.41L12 13.17l-4.59-4.58L6 10l6 6z" />
                    </svg>
                  )}
                </button>
                <div className="subtopics-dropdown">
                  {materials
                    .filter(m => m.topic === topic)
                    .map((m, subIndex) => (
                      <button
                        key={subIndex}
                        className={`subtopic-item ${selectedSubtopic === m.subtopic ? 'active' : ''}`}
                        onClick={() => handleSubtopicClick(m.subtopic)}
                      >
                        {m.subtopic}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="languagee-content">
          <div className="tutorial-section">
            <h2>{selectedSubtopic || 'Select a Subtopic'}</h2>
            {renderContent()}
          </div>
          <main className="compiler-section">
            <h1>Algonix Compiler</h1>
            <div className="compiler-container">
              <div className="language-select">
                <label htmlFor="language-select">Select Language:</label>
                <select id="language-select" value={compilerLang} onChange={(e) => setCompilerLang(e.target.value)}>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="python">Python</option>
                </select>
              </div>
              <CodeMirror
                value={code}
                height="250px"
                extensions={extensions[compilerLang]}
                onChange={(value) => setCode(value)}
                className="code-editor"
              />
              <textarea
                placeholder="Enter your input here..."
                rows="3"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input-area"
              />
              <button onClick={runCode} className="run-btn">
                <span>Run Code</span>
              </button>
            </div>
            <div className="output-section">
              <h2>Output</h2>
              <pre className="output-content">{output}</pre>
            </div>
          </main>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Language;
