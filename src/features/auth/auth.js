import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import { saveUser, clearUser } from '../config/index';
import { setUser, clearUser as clearUserRedux } from '../models/index';
import { modelLibrary } from '../features/model-library/model-library';

const Auth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      const userData = response.data;
      dispatch(setUser(userData));
      saveUser(userData);
      router.push('/dashboard');
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        password,
      });
      const userData = response.data;
      dispatch(setUser(userData));
      saveUser(userData);
      router.push('/dashboard');
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      dispatch(clearUserRedux());
      clearUser();
      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Authentication</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit" disabled={loading}>
          Login
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit" disabled={loading}>
          Register
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      {user && (
        <button onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Auth;