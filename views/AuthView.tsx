import React, { useState } from 'react';
import { User } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { GitHubIcon } from '../components/icons/GitHubIcon';
import { login, signup, socialLogin } from '../services/authService';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialProvider, setSocialProvider] = useState<'Google' | 'GitHub' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }
    setIsLoading(true);
    setSocialProvider(null);
    setError('');
    try {
      const authFunction = isLogin ? login : signup;
      const user = await authFunction(username, password);
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'Google' | 'GitHub') => {
    setIsLoading(true);
    setSocialProvider(provider);
    setError('');
    try {
        const user = await socialLogin(provider);
        onLogin(user);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
        setIsLoading(false);
        setSocialProvider(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-400 mb-8">{isLogin ? 'Sign in to your account' : 'Get started with Gemini Suite'}</p>
        
        <div className="space-y-4">
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 bg-white text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Continue with Google"
            >
              {isLoading && socialProvider === 'Google' ? <SpinnerIcon /> : <GoogleIcon />}
              <span className="ml-3">{isLoading && socialProvider === 'Google' ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 bg-gray-700 text-white rounded-md font-medium hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Continue with GitHub"
            >
              {isLoading && socialProvider === 'GitHub' ? <SpinnerIcon /> : <GitHubIcon />}
              <span className="ml-3">{isLoading && socialProvider === 'GitHub' ? 'Connecting...' : 'Continue with GitHub'}</span>
            </button>
        </div>

        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username or Email
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., testuser"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g., password123"
              required
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center bg-red-900/30 py-2 rounded-md">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && !socialProvider ? (
                <span className="flex items-center justify-center">
                    <SpinnerIcon className="mr-2" />
                    {isLogin ? 'Logging in...' : 'Signing up...'}
                </span>
            ) : (
                isLogin ? 'Login' : 'Sign Up'
            )}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-400 hover:underline" disabled={isLoading}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;