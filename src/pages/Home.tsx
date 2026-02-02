import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, FileText, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/layout/Layout';
import IncidentCard from '@/components/incidents/IncidentCard';
import { useIncidents } from '@/hooks/useIncidents';
import { useBackgroundMode } from '@/context/BackgroundModeContext';

// Counter animation hook
const useCounter = (end: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

const Home: React.FC = () => {
  const { data: incidents, isLoading } = useIncidents();
  const { enableRiskMode, disableRiskMode } = useBackgroundMode();

  const highSeverityCount = incidents?.filter(i => i.severity === 'high').length || 0;
  const totalIncidents = incidents?.length || 0;

  // Enable risk mode when high-severity incidents are present
  useEffect(() => {
    if (highSeverityCount > 0) {
      enableRiskMode();
    } else {
      disableRiskMode();
    }

    return () => {
      disableRiskMode();
    };
  }, [highSeverityCount]);

  const stats = [
    {
      title: 'Total Reports',
      value: totalIncidents,
      icon: FileText,
      description: 'Active incident reports',
      color: 'text-blue-600',
    },
    {
      title: 'High Priority',
      value: highSeverityCount,
      icon: AlertTriangle,
      description: 'Require caution',
      color: 'text-red-600',
    },
    {
      title: 'Safe Zones',
      value: 12,
      icon: Shield,
      description: 'Verified safe areas',
      color: 'text-emerald-600',
    },
    {
      title: 'Community',
      value: 2500,
      icon: Users,
      description: 'Active contributors',
      color: 'text-purple-600',
    },
  ];

  return (
    <Layout>
      <div className="container py-6 md:py-8 space-y-8">
        {/* Hero Section */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 text-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="max-w-2xl">
            <h1 className="mb-3 text-3xl font-bold md:text-4xl tracking-tight">
              Welcome to SafeRoute Chicago
            </h1>
            <p className="mb-6 text-white/90 text-lg leading-relaxed">
              Your trusted companion for safe travel in the Windy City. View real-time safety reports from fellow tourists and locals.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/map" state={{ fromUi: true }} className="flex-1">
                <div className="group relative h-full overflow-hidden rounded-xl bg-white/10 backdrop-blur-md p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:-translate-y-1 border border-white/20 cursor-pointer">
                  <div className="flex h-full items-start justify-between">
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">Safety Map</h3>
                        <p className="mt-2 text-sm text-white/80">
                          View real-time safety incidents and safe zones.
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full bg-white/20 p-3 text-white transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                      <MapPin className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/report" state={{ fromUi: true }} className="flex-1">
                <div className="group relative h-full overflow-hidden rounded-xl bg-white/10 backdrop-blur-md p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:-translate-y-1 border border-white/20 cursor-pointer">
                  <div className="flex h-full items-start justify-between">
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">Report Incident</h3>
                        <p className="mt-2 text-sm text-white/80">
                          Submit a new report to alert others.
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full bg-white/20 p-3 text-white transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                      <FileText className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          {stats.map(({ title, value, icon: Icon, description, color }) => (
            <StatCard
              key={title}
              title={title}
              value={value}
              icon={Icon}
              description={description}
              color={color}
            />
          ))}
        </div>

        {/* Recent Incidents */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Reports</h2>
              <p className="text-sm text-gray-600 mt-1">
                Latest safety incidents reported in Chicago
              </p>
            </div>
            <Link to="/map" state={{ fromUi: true }}>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-all duration-200"
              >
                View All
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {incidents
                ?.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
                .slice(0, 4)
                .map(incident => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
            </div>
          )}
        </div>

        {/* Safety Tips */}
        <Card className="mt-8 border-emerald-100 hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <div className="rounded-full bg-emerald-100 p-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              Safety Tips for Tourists
            </CardTitle>
            <CardDescription className="text-gray-600">
              Stay safe while exploring Chicago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-50/50 transition-colors duration-200">
                <div className="rounded-full bg-emerald-100 p-1.5 mt-0.5">
                  <Shield className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-700">Stay in well-lit, populated areas at night</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-50/50 transition-colors duration-200">
                <div className="rounded-full bg-emerald-100 p-1.5 mt-0.5">
                  <Shield className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-700">Keep valuables secure and out of sight</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-50/50 transition-colors duration-200">
                <div className="rounded-full bg-emerald-100 p-1.5 mt-0.5">
                  <Shield className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-700">Use official transportation services</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-50/50 transition-colors duration-200">
                <div className="rounded-full bg-emerald-100 p-1.5 mt-0.5">
                  <Shield className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-700">Check safety map before visiting new areas</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

// Stat Card Component with counter animation
const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ElementType;
  description: string;
  color: string;
}> = ({ title, value, icon: Icon, description, color }) => {
  const numericValue = typeof value === 'number' ? value : parseInt(value.replace(/\D/g, '')) || 0;
  const animatedValue = useCounter(numericValue, 1500);
  const suffix = typeof value === 'string' ? value.replace(/\d/g, '') : '';

  return (
    <Card className="group hover:shadow-lg hover:border-emerald-200 transition-all duration-300 cursor-default">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={`rounded-full bg-gray-50 p-2 transition-all duration-300 group-hover:bg-emerald-50 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">
          {animatedValue}{suffix}
        </div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Home;
