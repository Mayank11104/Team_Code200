import React, { useState } from 'react';
import { X, Mail, Lock, User, UserCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void; // ✅ Add this prop
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    role: 'technician' as 'admin' | 'manager' | 'technician' | 'employee',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: 'Passwords do not match',
      });
      return;
    }

    // TODO: Add signup API call here
    console.log('Sign Up:', formData);
    // Navigate to dashboard after successful signup
    navigate('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user types
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setErrors({ password: '', confirmPassword: '' });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slideUp max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#090A0C]">Create Account</h2>
            <p className="text-sm text-[#090A0C] opacity-60 mt-1">Join GearGuard today</p>
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
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-[#090A0C] mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#090A0C] focus:outline-none transition-colors text-[#090A0C] hover:border-gray-400"
              />
            </div>
          </div>

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
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-[#090A0C] focus:outline-none transition-colors text-[#090A0C] hover:border-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#090A0C] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-[#090A0C] opacity-60 mt-1">
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-semibold text-[#090A0C] mb-2">
              Re-enter Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={8}
                className={`w-full pl-10 pr-12 py-3 border-2 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:border-[#090A0C] focus:outline-none transition-colors text-[#090A0C] hover:border-gray-400`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#090A0C] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start">
            <input 
              type="checkbox" 
              required 
              className="w-4 h-4 border-2 border-gray-300 rounded cursor-pointer accent-[#090A0C] mt-1" 
            />
            <span className="ml-2 text-sm text-[#090A0C] opacity-80">
              I agree to the{' '}
              <button type="button" className="font-semibold hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="font-semibold hover:underline">
                Privacy Policy
              </button>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#090A0C] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        {/* Footer - ✅ UPDATED */}
        <div className="p-6 bg-[#EBEEF7] rounded-b-2xl text-center border-t border-gray-200">
          <p className="text-[#090A0C] opacity-80">
            Already have an account?{' '}
            <button
              onClick={() => {
                if (onSwitchToLogin) {
                  onSwitchToLogin(); // ✅ Call the switch function
                }
              }}
              className="font-bold text-[#090A0C] hover:underline transition-all"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
