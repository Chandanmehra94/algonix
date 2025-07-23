import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Author from './pages/Author';
import LanguageOverview from './pages/LanguageOverview';
import Language from './pages/Language';
import Sheet from './pages/Sheet';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tutorials from './pages/Tutorials';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/author" element={<Author />} />
          <Route path="/language/:lang" element={<LanguageOverview />} />
          <Route path="/language/:lang/:topic/:subtopic" element={<Language />} />
          <Route path="/sheet" element={<Sheet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tutorials" element={<Tutorials />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;