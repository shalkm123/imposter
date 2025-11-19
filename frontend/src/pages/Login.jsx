import { useState } from 'react';
import { Users, Lock, LogIn, UserPlus } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (username.trim() && password.trim()) {
      // Handle authentication logic here
      console.log(isLogin ? 'Logging in...' : 'Signing up...', { username, password });
      alert(`${isLogin ? 'Login' : 'Signup'} successful!`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setPassword('');
    setConfirmPassword('');
  };

  const isFormValid = () => {
    if (isLogin) {
      return username.trim() !== '' && password.trim() !== '';
    }
    return username.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '' && password === confirmPassword;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join Us'}
          </h1>
          <p className="text-purple-200 text-lg">
            {isLogin ? 'Login to continue your game' : 'Create an account to get started'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-purple-200 mb-3 text-lg font-medium flex items-center gap-2">
                <Users size={20} />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your username"
                className="w-full px-6 py-4 bg-white/20 border-2 border-purple-300/50 rounded-xl text-white placeholder-purple-300/60 text-lg focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-purple-200 mb-3 text-lg font-medium flex items-center gap-2">
                <Lock size={20} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="w-full px-6 py-4 bg-white/20 border-2 border-purple-300/50 rounded-xl text-white placeholder-purple-300/60 text-lg focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all"
              />
            </div>

            {/* Confirm Password Input (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-purple-200 mb-3 text-lg font-medium flex items-center gap-2">
                  <Lock size={20} />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirm your password"
                  className="w-full px-6 py-4 bg-white/20 border-2 border-purple-300/50 rounded-xl text-white placeholder-purple-300/60 text-lg focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`w-full px-8 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all transform ${
                isFormValid()
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl hover:scale-105 cursor-pointer'
                  : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLogin ? (
                <>
                  <LogIn size={24} />
                  <span>Login</span>
                </>
              ) : (
                <>
                  <UserPlus size={24} />
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </div>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-purple-200 mb-3">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={toggleMode}
              className="text-purple-300 hover:text-white font-semibold text-lg transition-colors underline decoration-2 underline-offset-4"
            >
              {isLogin ? 'Sign up here' : 'Login here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}