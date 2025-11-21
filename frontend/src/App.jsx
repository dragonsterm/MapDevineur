import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Test from './components/Test'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Game from './pages/Game';
import Session from './pages/Session';
import Registration from './pages/Registration';
import Loading from './pages/Loading';
import ResetPassword from './pages/ResetPassword';

function App() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      const logStorageSize = () => {
        const cookieSize = document.cookie.length;
        const localStorageSize = JSON.stringify(localStorage).length;
        const totalSize = cookieSize + localStorageSize;
        
        if (totalSize > 8192) {
          console.warn(`⚠️ Storage size: ${totalSize} bytes (Cookie: ${cookieSize}, LocalStorage: ${localStorageSize})`);
        }
      };

      logStorageSize();
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/loading" element={<Loading />} />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session"
            element={
              <ProtectedRoute>
                <Session />
              </ProtectedRoute>
            }
          />
          <Route path="/test" element={<Test />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App