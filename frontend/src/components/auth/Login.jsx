// components/auth/Login.jsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react'; // works with NextAuth.js or use your auth lib
import { Loader } from '@/components/ui/Loader'; // optional loading spinner

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);
    if (res?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/dashboard');
    }
  };

  const handleOAuth = async (provider) => {
    await signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Welcome back to NeuroSync</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? <Loader /> : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500">or</div>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => handleOAuth('google')}
            className="w-full flex items-center justify-center border py-2 rounded-xl hover:bg-gray-50"
          >
            <img src="/icons/google.svg" alt="Google" className="h-5 mr-2" />
            Continue with Google
          </button>
          <button
            onClick={() => handleOAuth('github')}
            className="w-full flex items-center justify-center border py-2 rounded-xl hover:bg-gray-50"
          >
            <img src="/icons/github.svg" alt="GitHub" className="h-5 mr-2" />
            Continue with GitHub
          </button>
        </div>

        <div className="mt-6 text-sm text-center text-gray-500">
          Don't have an account?{' '}
          <a href="/register" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
