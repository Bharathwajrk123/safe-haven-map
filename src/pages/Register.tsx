import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle, User, Mail, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, verifyOTP } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({ title: "Name Required", description: "Please enter your full name.", variant: "destructive" });
      return false;
    }

    if (!formData.email.trim()) {
      toast({ title: "Email Required", description: "Please enter your email.", variant: "destructive" });
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return false;
    }

    if (!formData.password) {
      toast({ title: "Password Required", description: "Please enter a password.", variant: "destructive" });
      return false;
    } else if (formData.password.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return false;
    }

    return true;
  };

  const passwordChecks = [
    { check: formData.password.length >= 6, label: 'At least 6 characters' },
    { check: /[A-Z]/.test(formData.password), label: 'One uppercase letter' },
    { check: /[0-9]/.test(formData.password), label: 'One number' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      // Move to OTP step
      setStep('otp');
    } catch (error: any) {
      // Check if message says "User already exists"
      if (error.response?.data?.message === 'User already exists') {
        toast({ title: "Registration Failed", description: "User already exists with this email.", variant: "destructive" });
      } else {
        toast({ title: "Registration Failed", description: "Please try again later.", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast({ title: "Invalid OTP", description: "Please enter a valid 6-digit OTP.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(formData.email, otp);
      navigate('/');
    } catch (error) {
      toast({ title: "Verification Failed", description: "Invalid or expired OTP.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel - Hero Image */}
      <div className="hidden w-3/5 relative lg:flex items-center justify-center overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/assets/chicago-signup.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />

        <div className="relative z-20 max-w-2xl px-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="mb-8 inline-flex items-center justify-center rounded-full bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-md">
            <Shield className="h-12 w-12 text-emerald-400" />
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white leading-tight">
            Travel Safer.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
              Choose Smarter Routes.
            </span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light">
            Join thousands of Chicagoans navigating the city with confidence.
            Real-time safety data, community reports, and protected paths
            at your fingertips.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full flex-col justify-center bg-white px-4 lg:w-2/5 sm:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-sm mx-auto animate-in slide-in-from-right-8 duration-700 fade-in fill-mode-forwards">
          <div className="mb-8 text-center lg:text-left">
            <Link to="/" className="lg:hidden mb-6 inline-flex items-center justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Get Started</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your account to access premium safety features.
            </p>
          </div>

          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-green-600" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 h-11 bg-gray-50 border-gray-200 transition-all duration-200 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-green-600" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-11 bg-gray-50 border-gray-200 transition-all duration-200 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-green-600" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200 transition-all duration-200 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {formData.password && (
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-1">
                    {passwordChecks.map(({ check, label }) => (
                      <div key={label} className="flex items-center gap-2 text-xs">
                        <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${check ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={`transition-colors duration-200 ${check ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-green-600" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 h-11 bg-gray-50 border-gray-200 transition-all duration-200 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold text-base shadow-lg shadow-green-500/25 rounded-lg transition-all duration-300 hover:shadow-green-500/40 hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Free Account'
                  )}
                </Button>
                <p className="mt-4 text-xs text-center text-gray-500">
                  By signing up, you agree to our <a href="#" className="underline hover:text-gray-900">Terms</a> and <a href="#" className="underline hover:text-gray-900">Privacy Policy</a>.
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Verify your email</h3>
                <p className="text-sm text-gray-500 mt-1">
                  We've sent a 6-digit code to <span className="font-medium text-gray-900">{formData.email}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="sr-only">Verification Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-4xl font-mono tracking-[0.5em] h-16 bg-gray-50 border-gray-200 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                  maxLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold text-base shadow-lg shadow-green-500/25 rounded-lg transition-all duration-300 hover:shadow-green-500/40 hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>

              <div className="text-center">
                <Button variant="link" type="button" onClick={() => setStep('form')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  ← Change Email
                </Button>
              </div>
            </form>
          )}

          <div className="mt-10 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
