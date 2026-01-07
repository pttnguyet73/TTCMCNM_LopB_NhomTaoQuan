import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get('token');
    const role = params.get('role');
    const userId = params.get('id');

    if (!token || !role) {
      navigate('/login');
      return;
    }

    localStorage.setItem('access_token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user_id', userId || '');

    if (role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return <p>Đang đăng nhập...</p>;
};

export default Callback;
