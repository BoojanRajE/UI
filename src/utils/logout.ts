import { useDispatch } from 'react-redux';
import { AppDispatch } from '../reduxStore/Store';
import TokenService from '../api/TokenService';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BroadcastChannel } from 'broadcast-channel';

function Session() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const logoutChannel = new BroadcastChannel('logout');

  useEffect(() => {
    // Listen for logout messages from other tabs
    const handleLogoutMessage = (message: any) => {
      if (message === 'logout') {
        logout();
      }
    };

    logoutChannel.addEventListener('message', handleLogoutMessage);

    return () => {
      logoutChannel.removeEventListener('message', handleLogoutMessage);
    };
  }, []);

  const logoutAllTabs = () => {
    logoutChannel.postMessage('logout'); // Broadcast a logout message to all tabs
  };

  const logout = () => {
    TokenService.RemoveAccessToken();
    TokenService.RemoveRefreshToken();
    localStorage.removeItem('role');
    localStorage.removeItem('hasRenderedBefore');
    localStorage.removeItem('hasRenderedBeforeInvite');
    logoutChannel.close();
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return {
    logoutAllTabs,
  };
}

export default Session;
