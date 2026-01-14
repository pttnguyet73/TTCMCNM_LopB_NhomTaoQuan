import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SocialCallback = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      navigate('/login');
      return;
    }

    loginWithToken(token)
      .then(user => {
        if (user.role === 'admin' || user.role === 'saler') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      })
      .catch(() => navigate('/login'));
  }, [navigate, loginWithToken]);

  return <p>Đang đăng nhập...</p>;
};

export default SocialCallback;
