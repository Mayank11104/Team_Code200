import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, 
  Calendar, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Clock
} from 'lucide-react';
import type { Feature, Stat, WorkflowStep } from '../types';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  // Modal switch functions
  const handleSwitchToSignUp = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const features: Feature[] = [
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Equipment Tracking",
      description: "Centralized database for all company assets with detailed ownership and technical specifications"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Scheduling",
      description: "Plan preventive maintenance and handle corrective repairs with calendar integration"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Management",
      description: "Organize specialized teams and assign technicians efficiently"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Track maintenance metrics, team performance, and equipment health"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automated Workflows",
      description: "Auto-fill maintenance requests with equipment data for faster processing"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Audit Trail",
      description: "Complete maintenance history and compliance tracking for all assets"
    }
  ];

  const stats: Stat[] = [
    {
      icon: <BarChart3 className="w-12 h-12 mx-auto mb-3" />,
      value: "1,500+",
      label: "Assets Tracked",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />,
      value: "98%",
      label: "On-Time Completion",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: <Clock className="w-12 h-12 mx-auto mb-3" />,
      value: "40%",
      label: "Downtime Reduction",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  const benefits: string[] = [
    "Reduce equipment downtime by up to 40%",
    "Streamline maintenance workflows",
    "Improve team productivity and accountability",
    "Prevent costly emergency repairs",
    "Extend asset lifecycle with preventive care",
    "Generate comprehensive maintenance reports"
  ];

  const workflowSteps: WorkflowStep[] = [
    { step: "1", title: "Create Request", desc: "Report equipment issues instantly" },
    { step: "2", title: "Auto-Assign", desc: "System routes to the right team" },
    { step: "3", title: "Track Progress", desc: "Monitor repairs in real-time" },
    { step: "4", title: "Complete & Log", desc: "Record hours and close tickets" }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#EBEEF7]">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-300 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Wrench className="w-8 h-8 text-[#090A0C]" />
                <span className="text-2xl font-bold text-[#090A0C]">GearGuard</span>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-5 py-2 text-[#090A0C] font-medium hover:text-gray-600 transition-all duration-300 hover:scale-105 relative group"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#090A0C] group-hover:w-full transition-all duration-300"></span>
                </button>
                <button 
                  onClick={() => setIsSignUpModalOpen(true)}
                  className="px-6 py-2.5 bg-[#090A0C] text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-0.5"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#EBEEF7]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center animate-fadeInUp">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#090A0C] mb-6">
                GearGuard
              </h1>
              <p className="text-3xl sm:text-4xl font-bold text-[#090A0C] mb-6">
                The Ultimate Maintenance Tracker
              </p>
              <p className="text-xl text-[#090A0C] max-w-3xl mx-auto mb-8 leading-relaxed opacity-90">
                Seamlessly connect Equipment, Teams, and Maintenance Requests. 
                Track assets, manage repairs, and optimize your maintenance operations from one powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => setIsSignUpModalOpen(true)}
                  className="px-8 py-4 bg-[#090A0C] text-white text-lg font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-16 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto border-2 border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className={`text-center p-6 ${stat.bgColor} rounded-lg border border-gray-200`}>
                      <div className={stat.iconColor}>
                        {stat.icon}
                      </div>
                      <h3 className="font-bold text-3xl text-[#090A0C] mb-1">{stat.value}</h3>
                      <p className="text-[#090A0C] opacity-80 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#090A0C] mb-4">
                Powerful Features for Complete Control
              </h2>
              <p className="text-xl text-[#090A0C] opacity-80 max-w-2xl mx-auto font-medium">
                Everything you need to manage maintenance operations efficiently
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 bg-[#EBEEF7] rounded-xl border-2 border-gray-300 hover:border-[#090A0C] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4 text-[#090A0C]">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#090A0C] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#090A0C] opacity-80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#EBEEF7]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-[#090A0C]">
                  Why Choose GearGuard?
                </h2>
                <p className="text-lg text-[#090A0C] opacity-80 mb-8 leading-relaxed">
                  Transform your maintenance operations with intelligent automation, 
                  real-time tracking, and data-driven insights that keep your equipment 
                  running at peak performance.
                </p>
                <button 
                  onClick={() => setIsSignUpModalOpen(true)}
                  className="px-8 py-4 bg-[#090A0C] text-white text-lg font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2 group"
                >
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 bg-white p-4 rounded-lg hover:shadow-md transition-all border-2 border-gray-200"
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-lg text-[#090A0C] font-medium">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#090A0C] mb-4">
                Simple Workflow, Powerful Results
              </h2>
              <p className="text-xl text-[#090A0C] opacity-80 font-medium">
                From breakdown to resolution in just a few clicks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {workflowSteps.map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-16 h-16 bg-[#090A0C] text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-[#090A0C] mb-2">{item.title}</h3>
                  <p className="text-[#090A0C] opacity-80 font-medium">{item.desc}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-400 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#EBEEF7]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#090A0C] mb-6">
              Ready to Optimize Your Maintenance?
            </h2>
            <p className="text-xl text-[#090A0C] opacity-80 mb-8 font-medium">
              Join hundreds of companies already using GearGuard to reduce downtime and maximize efficiency
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsSignUpModalOpen(true)}
                className="px-10 py-4 bg-[#090A0C] text-white text-lg font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl"
              >
                Get Started Now
              </button>
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="px-10 py-4 bg-white text-[#090A0C] text-lg font-semibold rounded-lg border-2 border-[#090A0C] hover:bg-gray-100 transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t-2 border-gray-300 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Wrench className="w-6 h-6 text-[#090A0C]" />
              <span className="text-xl font-bold text-[#090A0C]">GearGuard</span>
            </div>
            <p className="mb-4 text-[#090A0C] opacity-80">The Ultimate Maintenance Tracker</p>
            <p className="text-sm text-[#090A0C] opacity-60">&copy; 2025 GearGuard. Built for hackathon excellence.</p>
          </div>
        </footer>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
      />

      {/* SignUp Modal */}
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default LandingPage;
