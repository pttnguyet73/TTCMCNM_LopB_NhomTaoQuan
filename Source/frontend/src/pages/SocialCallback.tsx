import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SocialCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const role = params.get('role');
    const id = params.get('id');

    if (token && id) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_role', role || 'user');
      localStorage.setItem('user_id', id);
        navigate('/', { replace: true });
      
    } else {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="loader-container">
        <p>Đang xác thực thông tin tài khoản...</p>
      </div>
    </div>
  );
};

export default SocialCallback;