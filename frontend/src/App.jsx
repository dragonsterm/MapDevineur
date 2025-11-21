import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Test from './components/Test'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Game from './pages/Game';
import Registration from './pages/Registration';
import Loading from './pages/Loading';

function App() {
  useEffect(() => {
    const checkAndClearStorage = () => {
      const cookieSize = document.cookie.length;
      const localStorageSize = JSON.stringify(localStorage).length;
      const totalSize = cookieSize + localStorageSize;
      
      console.log(`Cookie size: ${cookieSize} bytes`);
      console.log(`LocalStorage size: ${localStorageSize} bytes`);
      console.log(`Total size: ${totalSize} bytes`);
      
      // If total size exceeds 8KB, clear everything
      if (totalSize > 8192) {
        console.warn('Storage size exceeded 8KB, clearing...');
        
        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/;domain=localhost");
        });
        
        // Clear storage
        localStorage.clear();
        sessionStorage.clear();
        
        console.log('Storage cleared, reloading...');
        window.location.reload();
      }
    };

    checkAndClearStorage();
    
    // Check every 30 seconds while app is running
    const interval = setInterval(checkAndClearStorage, 30000);
    
    return () => clearInterval(interval);
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
          <Route path="/test" element={<Test />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App