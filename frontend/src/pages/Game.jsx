import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Game() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <main>
      <h1>Hi {user?.username}</h1>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}

export default Game;