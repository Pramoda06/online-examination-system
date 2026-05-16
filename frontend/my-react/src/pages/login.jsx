import { useState } from 'react';
import { useAuth } from '../context/authContext';

const Login = ({ navigate }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const user = await login(form);
      navigate(user.role === 'instructor' ? 'instructor' : 'student');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-panel">
      <h1>Online Examination System</h1>
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="alert">{error}</p>}
        <label>
          Email
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required />
        </label>
        <label>
          Password
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required />
        </label>
        <button type="submit">Login</button>
        <button className="link-button" type="button" onClick={() => navigate('register')}>
          Create an account
        </button>
      </form>
    </section>
  );
};

export default Login;
