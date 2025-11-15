import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Test from './components/Test'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Game from './pages/Game';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
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