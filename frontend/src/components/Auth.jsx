import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Calendar, Sparkles, LogIn, UserPlus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    anonymousName: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const generateRandomName = () => {
    const adjectives = ['Mystic', 'Silent', 'Brave', 'Witty', 'Cosmic', 'Gentle', 'Fierce', 'Lunar'];
    const nouns = ['Phoenix', 'Wolf', 'Owl', 'Dragon', 'Traveler', 'Dreamer', 'Guardian', 'Explorer'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 999) + 1;
    return `${randomAdj}${randomNoun}${randomNum}`;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
      
      if (!formData.age) newErrors.age = 'Age is required';
      else if (isNaN(formData.age) || formData.age < 13 || formData.age > 120) {
        newErrors.age = 'Age must be between 13 and 120';
      }
      
      if (formData.anonymousName.trim() && formData.anonymousName.length < 3) {
        newErrors.anonymousName = 'Must be at least 3 characters';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('entered try block')
      if (isLogin) {
        const res=await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
          email: formData.email,
          password: formData.password,
        },{
          headers:{
            "Content-Type": "application/json"
          },
          withCredentials:true
        });
        if(res.data.success){
            navigate('/tracker');
          toast.success(res.data.message);
        }
        else{
          toast.error(res.data.message);
        }
        
      } else {
        console.log('entered register block')
        const finalAnonymousName = formData.anonymousName.trim() || generateRandomName();
        const registrationData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: parseInt(formData.age),
          anonymousName: finalAnonymousName
        };
        
        try{
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, registrationData);
          if(response.data.success){
            setIsLogin(true);
            toast.success(response.data.message);
          }
          else{
            toast.error(response.data.message);
          }
        }
        catch(err){
          toast.error(err.response.data.message || "Something went wrong");
          console.log(err);
        }
      }
      
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        anonymousName: ''
      });
      setErrors({});
      
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    if (isLogin) {
      setFormData(prev => ({
        ...prev,
        anonymousName: ''
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-pink-50 to-rose-100 p-4 md:p-8">
      <div className="w-full max-w-4xl">
        {/* Decorative Background Elements */}
        <div className="fixed top-10 left-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob z-0"></div>
        <div className="fixed bottom-10 right-10 w-64 h-64 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 z-0"></div>
        <div className="fixed top-1/2 left-1/3 w-48 h-48 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 z-0"></div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Left Side - Welcome/Info Section (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col items-center justify-center w-full lg:w-2/5">
              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-sm rounded-3xl p-8 border border-pink-200/50 shadow-2xl w-full">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-lg mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
                    Welcome to Our Community
                  </h2>
                  <p className="text-gray-700">
                    {isLogin 
                      ? "Sign in to continue your journey and access personalized features."
                      : "Join our community today and start your adventure with a unique anonymous identity!"
                    }
                  </p>
                </div>
                
                {/* Benefits List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <User className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Anonymous Identity</h4>
                      <p className="text-sm text-gray-600">Choose a unique display name</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Lock className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Secure & Private</h4>
                      <p className="text-sm text-gray-600">Your data is always protected</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Sparkles className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Personalized Experience</h4>
                      <p className="text-sm text-gray-600">Tailored just for you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-3/5">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-pink-100">
                {/* Mobile Header */}
                <div className="lg:hidden text-center mb-6">
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-lg mb-4">
                    {isLogin ? (
                      <LogIn className="w-6 h-6 text-white" />
                    ) : (
                      <UserPlus className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h1>
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:block text-center mb-6">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    {isLogin ? 'Sign In' : 'Sign Up'}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {isLogin ? 'Enter your credentials to continue' : 'Fill in your details to get started'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  {/* Name and Email Row (Desktop) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {/* Name Field */}
                    {!isLogin && (
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4 mr-2 text-pink-500" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                            errors.name ? 'border-rose-500' : 'border-pink-200'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-rose-600">{errors.name}</p>
                        )}
                      </div>
                    )}

                    {/* Email Field */}
                    <div className={!isLogin ? '' : 'lg:col-span-2'}>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 mr-2 text-pink-500" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                          errors.email ? 'border-rose-500' : 'border-pink-200'
                        }`}
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-rose-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Password Row (Desktop) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {/* Password Field */}
                    <div className={isLogin ? 'lg:col-span-2' : ''}>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Lock className="w-4 h-4 mr-2 text-pink-500" />
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all pr-12 ${
                            errors.password ? 'border-rose-500' : 'border-pink-200'
                          }`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-rose-600">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    {!isLogin && (
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Lock className="w-4 h-4 mr-2 text-pink-500" />
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all pr-12 ${
                              errors.confirmPassword ? 'border-rose-500' : 'border-pink-200'
                            }`}
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-rose-600">{errors.confirmPassword}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Age and Anonymous Name Row (Desktop) */}
                  {!isLogin && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 mr-2 text-pink-500" />
                          Age
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          min="13"
                          max="120"
                          className={`w-full px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                            errors.age ? 'border-rose-500' : 'border-pink-200'
                          }`}
                          placeholder="Age"
                        />
                        {errors.age && (
                          <p className="mt-1 text-sm text-rose-600">{errors.age}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Sparkles className="w-4 h-4 mr-2 text-pink-500" />
                          Anonymous Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="anonymousName"
                            value={formData.anonymousName}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                              errors.anonymousName ? 'border-rose-500' : 'border-pink-200'
                            }`}
                            placeholder="Display name (optional - auto-generated if empty)"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              anonymousName: generateRandomName()
                            }))}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-500 hover:text-rose-600"
                            title="Generate random name"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        </div>
                        {errors.anonymousName && (
                          <p className="mt-1 text-sm text-rose-600">{errors.anonymousName}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Toggle Mode */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-pink-600 hover:text-rose-600 font-medium text-sm md:text-base"
                    >
                      {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 md:py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {isLogin ? 'Signing in...' : 'Creating Account...'}
                      </span>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </button>

                </form>

                {/* Footer Links */}
                <div className="mt-6 pt-4 border-t border-pink-100">
                  <p className="text-center text-gray-500 text-xs md:text-sm">
                    By continuing, you agree to our{' '}
                    <Link to="/terms" className="text-pink-600 hover:text-rose-600 font-medium">Terms</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-pink-600 hover:text-rose-600 font-medium">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;