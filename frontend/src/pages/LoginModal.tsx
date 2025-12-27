import React, { useState } from 'react';
import { X, Mail, Lock, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp?: () => void; // ✅ Add this prop
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: 'technician' as 'admin' | 'manager' | 'technician' | 'employee',
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add login API call here
    console.log('Login:', formData);
    // Navigate to dashboard after successful login
    navigate('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotPassword = () => {
    // TODO: Add forgot password logic
    console.log('Forgot password clicked');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-[#090A0C]">Welcome Back</h2>
            <p className="text-sm text-[#090A0C] opacity-60 mt-1">Sign in to your account</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#EBEEF7] rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#090A0C]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Role Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-[#090A0C] mb-2">
              Select Role
            </label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#090A0C] focus:outline-none transition-colors text-[#090A0C] appearance-none bg-white cursor-pointer hover:border-gray-400"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="technician">Technician</option>
                <option value="employee">Employee</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-[#090A0C] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#090A0C] focus:outline-none transition-colors text-[#090A0C] hover:border-gray-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-[#090A0C] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#090A0C] focus:outline-none transition-colors text-[#090A0C] hover:border-gray-400"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border-2 border-gray-300 rounded cursor-pointer accent-[#090A0C]" 
              />
              <span className="ml-2 text-sm text-[#090A0C] opacity-80 group-hover:opacity-100 transition-opacity">
                Remember me
              </span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#090A0C] hover:underline font-semibold transition-all"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#090A0C] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        {/* Footer - ✅ UPDATED */}
        <div className="p-6 bg-[#EBEEF7] rounded-b-2xl text-center border-t border-gray-200">
          <p className="text-[#090A0C] opacity-80">
            Don't have an account?{' '}
            <button
              onClick={() => {
                if (onSwitchToSignUp) {
                  onSwitchToSignUp(); // ✅ Call the switch function
                }
              }}
              className="font-bold text-[#090A0C] hover:underline transition-all"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
