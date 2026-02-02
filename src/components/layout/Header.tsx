import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, MapPin, FileText, User, LogIn, Menu, X, LogOut, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/map', label: 'Safety Map' },
    { to: '/report', label: 'Report' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-105"
        >
          <div className="rounded-full bg-emerald-50 p-2 transition-colors duration-200 group-hover:bg-emerald-100">
            <Shield className="h-7 w-7 text-emerald-600" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            SafeRoute <span className="text-emerald-600">Chicago</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              state={{ fromUi: true }}
              className={cn(
                'relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg',
                isActive(to)
                  ? 'text-emerald-600'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50'
              )}
            >
              {label}
              {isActive(to) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Auth Section - Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <UserCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="hidden lg:inline">{user?.name || 'User'}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-200"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="container mx-auto flex flex-col gap-1 py-4 px-4">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                state={{ fromUi: true }}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive(to)
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                )}
              >
                {label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <div className="my-2 border-t border-gray-100" />
                <Link
                  to="/profile"
                  state={{ fromUi: true }}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive('/profile')
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                  )}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <Button
                  variant="outline"
                  className="mt-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
