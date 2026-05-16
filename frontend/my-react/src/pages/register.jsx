import { useState } from 'react';
import { useAuth } from '../context/authContext';

const Register = ({ navigate }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const user = await register(form);
      navigate(user.role === 'instructor' ? 'instructor' : 'student');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-panel">
      <h1>Create Account</h1>
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="alert">{error}</p>}
        <label>
          Name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label>
          Email
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required />
        </label>
        <label>
          Password
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" minLength="6" required />
        </label>
        <label>
          Role
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </label>
        <button type="submit">Register</button>
      </form>
    </section>
  );
};

export default Register;
