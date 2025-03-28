// components/auth/Signup.jsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { Loader } from '@/components/ui/Loader'; // Optional loading spinner

export default function Signup() {
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

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      // Auto-login after signup
      await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      router.push('/onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    await signIn(provider, { callbackUrl: '/onboarding' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create your NeuroSync account</h2>

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
            {loading ? <Loader /> : 'Sign Up'}
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
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 font-medium hover:underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}
