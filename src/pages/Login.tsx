import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LogIn, Eye, EyeOff, AlertCircle, Mail, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      toast({ title: "Email Required", description: "Please enter your email address.", variant: "destructive" });
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email format.", variant: "destructive" });
      return false;
    }

    if (!formData.password) {
      toast({ title: "Password Required", description: "Please enter your password.", variant: "destructive" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-center bg-white px-4 lg:w-2/5 sm:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-sm mx-auto animate-in slide-in-from-left-8 duration-700 fade-in fill-mode-forwards">
          <div className="mb-8 text-center lg:text-left">
            <Link to="/" className="lg:hidden mb-6 inline-flex items-center justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-green-600" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
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
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold text-base shadow-lg shadow-green-500/25 rounded-lg transition-all duration-300 hover:shadow-green-500/40 hover:-translate-y-0.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Hero Image */}
      <div className="hidden w-3/5 relative lg:flex items-center justify-center overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/assets/chicago-login.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-900/90 via-blue-900/50 to-transparent" />

        <div className="relative z-20 max-w-2xl px-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="mb-8 inline-flex items-center justify-center rounded-full bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-md">
            <Shield className="h-12 w-12 text-emerald-400" />
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white leading-tight">
            Welcome Back.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Travel Safely.
            </span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light">
            Access your personalized safe routes, real-time community reports,
            and safety insights for your journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
