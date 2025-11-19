import { useState } from 'react';
import { Users, Lock, Mail, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (username.trim() && email.trim() && password.trim() && confirmPassword.trim()) {
      // Handle signup logic here
      console.log('Signing up...', { username, email, password });
      alert('Signup successful!');
      
      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  const isFormValid = () => {
    return (
      username.trim() !== '' && 
      email.trim() !== '' && 
      password.trim() !== '' && 
      confirmPassword.trim() !== '' && 
      password === confirmPassword
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Create Account
          </h1>
          <p className="text-purple-200 text-lg">
            Join us and start your gaming journey
          </p>
        </div>

        {/* Signup Form */}
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
                placeholder="Choose a username"
                className="w-full px-6 py-4 bg-white/20 border-2 border-purple-300/50 rounded-xl text-white placeholder-purple-300/60 text-lg focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-purple-200 mb-3 text-lg font-medium flex items-center gap-2">
                <Mail size={20} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
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
                placeholder="Create a password"
                className="w-full px-6 py-4 bg-white/20 border-2 border-purple-300/50 rounded-xl text-white placeholder-purple-300/60 text-lg focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all"
              />
            </div>

            {/* Confirm Password Input */}
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
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-300 text-sm mt-2 ml-2">Passwords do not match</p>
              )}
            </div>

            {/* Signup Button */}
            <button
              onClick={handleSignup}
              disabled={!isFormValid()}
              className={`w-full px-8 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all transform ${
                isFormValid()
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl hover:scale-105 cursor-pointer'
                  : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <UserPlus size={24} />
              <span>Create Account</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-purple-200 mb-3">
              Already have an account?
            </p>
            <button
              onClick={() => console.log('Navigate to login')}
              className="text-purple-300 hover:text-white font-semibold text-lg transition-colors underline decoration-2 underline-offset-4"
            >
              Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}