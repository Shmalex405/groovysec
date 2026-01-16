import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DocPage } from './pages/DocPage';
import { HomePage } from './pages/HomePage';

function App() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Handle GitHub Pages SPA redirect
  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      navigate(redirect, { replace: true });
    }
  }, [navigate]);

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-guides" element={<Navigate to="/admin-guides/overview" replace />} />
        <Route path="/admin-guides/:category/:slug" element={<DocPage />} />
        <Route path="/admin-guides/:slug" element={<DocPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
