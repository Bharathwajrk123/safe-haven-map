import React from 'react';
import { User, FileText, MapPin, Calendar, Shield, LogOut, Award, TrendingUp, Users, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/layout/Layout';
import IncidentCard from '@/components/incidents/IncidentCard';
import { useAuth } from '@/context/AuthContext';
import { useUserIncidents } from '@/hooks/useIncidents';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: userIncidents, isLoading } = useUserIncidents(user?.id);

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  const reportCount = userIncidents?.length || 0;

  // Calculate trust level
  const getTrustLevel = (count: number) => {
    if (count >= 25) return { level: 'Expert', progress: 100, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' };
    if (count >= 10) return { level: 'Trusted', progress: 75, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (count >= 5) return { level: 'Active', progress: 50, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' };
    return { level: 'New', progress: 25, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
  };

  const trustLevel = getTrustLevel(reportCount);
  const estimatedPeopleHelped = reportCount * 150; // Avg. views per report
  const areasImpacted = Math.min(reportCount, 8); // Estimate based on reports

  // Badges
  const badges = [
    {
      id: 'first-report',
      name: 'First Report',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      earned: reportCount >= 1,
      description: 'Submitted your first safety report',
    },
    {
      id: 'trusted',
      name: 'Trusted Contributor',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      earned: reportCount >= 5,
      description: 'Earned trust through consistent reporting',
    },
    {
      id: 'community-helper',
      name: 'Community Helper',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      earned: reportCount >= 10,
      description: 'Helped shape community safety',
    },
    {
      id: 'safety-advocate',
      name: 'Safety Advocate',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      earned: reportCount >= 25,
      description: 'Dedicated to community protection',
    },
  ];

  // Timeline milestones
  const milestones = [
    {
      title: 'Account Created',
      date: user?.createdAt ? new Date(user.createdAt) : new Date(),
      completed: true,
      icon: User,
    },
    {
      title: 'First Report Submitted',
      date: userIncidents?.[0]?.reportedAt ? new Date(userIncidents[0].reportedAt) : null,
      completed: reportCount >= 1,
      icon: FileText,
    },
    {
      title: 'Trusted Contributor',
      date: reportCount >= 5 && userIncidents?.[4]?.reportedAt ? new Date(userIncidents[4].reportedAt) : null,
      completed: reportCount >= 5,
      icon: Shield,
    },
    {
      title: 'Community Helper',
      date: reportCount >= 10 && userIncidents?.[9]?.reportedAt ? new Date(userIncidents[9].reportedAt) : null,
      completed: reportCount >= 10,
      icon: Users,
    },
  ];

  return (
    <Layout>
      <div className="container py-6 md:py-8 space-y-6">
        {/* Identity Section */}
        <Card className="animate-in fade-in slide-in-from-top-4 duration-500">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <Avatar className="h-24 w-24 border-4 border-emerald-100">
                <AvatarFallback className="bg-emerald-600 text-2xl text-white font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left space-y-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'Tourist'}</h1>
                  <p className="text-gray-600 mt-1">{user?.email}</p>
                </div>
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5">
                    <Shield className="h-3.5 w-3.5" />
                    Verified Contributor
                  </Badge>
                  <Badge variant="secondary" className={cn('gap-1.5', trustLevel.bgColor, trustLevel.color, trustLevel.borderColor)}>
                    <Award className="h-3.5 w-3.5" />
                    {trustLevel.level}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={logout} className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Trust & Impact */}
          <div className="space-y-6 lg:col-span-2">
            {/* Trust Score */}
            <Card className="animate-in fade-in slide-in-from-left-4 duration-500 delay-75">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Contributor Trust Level
                </CardTitle>
                <CardDescription>
                  Trust earned through consistent, accurate reporting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Progress to Next Level</span>
                  <span className={cn('text-sm font-bold', trustLevel.color)}>{trustLevel.level}</span>
                </div>
                <Progress value={trustLevel.progress} className="h-3" />
                <div className="grid grid-cols-4 gap-2 text-xs text-center">
                  <div className={reportCount >= 0 ? 'text-gray-900 font-medium' : 'text-gray-400'}>New</div>
                  <div className={reportCount >= 5 ? 'text-emerald-600 font-medium' : 'text-gray-400'}>Active</div>
                  <div className={reportCount >= 10 ? 'text-blue-600 font-medium' : 'text-gray-400'}>Trusted</div>
                  <div className={reportCount >= 25 ? 'text-amber-600 font-medium' : 'text-gray-400'}>Expert</div>
                </div>
              </CardContent>
            </Card>

            {/* Impact Metrics */}
            <Card className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Community Impact
                </CardTitle>
                <CardDescription>
                  Your contributions to Chicago safety
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Reports Submitted</p>
                        <p className="text-3xl font-bold text-blue-900 mt-1">{reportCount}</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-emerald-700 font-medium">People Helped</p>
                        <p className="text-3xl font-bold text-emerald-900 mt-1">{estimatedPeopleHelped.toLocaleString()}</p>
                      </div>
                      <Users className="h-8 w-8 text-emerald-600" />
                    </div>
                    <p className="text-xs text-emerald-600 mt-2">Estimated reach</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-purple-700 font-medium">Areas Impacted</p>
                        <p className="text-3xl font-bold text-purple-900 mt-1">{areasImpacted}</p>
                      </div>
                      <MapPin className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-xs text-purple-600 mt-2">Neighborhoods</p>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-orange-700 font-medium">Member Since</p>
                        <p className="text-lg font-bold text-orange-900 mt-1">
                          {user?.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : 'Recently'}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Recognition for your contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={cn(
                        'border-2 rounded-lg p-4 transition-all duration-200',
                        badge.earned
                          ? `${badge.bgColor} ${badge.borderColor} hover:shadow-md hover:scale-105`
                          : 'bg-gray-50 border-gray-200 opacity-50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'rounded-full p-2',
                          badge.earned ? badge.bgColor : 'bg-gray-100'
                        )}>
                          <badge.icon className={cn('h-5 w-5', badge.earned ? badge.color : 'text-gray-400')} />
                        </div>
                        <div className="flex-1">
                          <h4 className={cn('font-semibold text-sm', badge.earned ? 'text-gray-900' : 'text-gray-400')}>
                            {badge.name}
                          </h4>
                          <p className={cn('text-xs mt-0.5', badge.earned ? 'text-gray-600' : 'text-gray-400')}>
                            {badge.description}
                          </p>
                          {badge.earned && (
                            <CheckCircle2 className={cn('h-4 w-4 mt-1', badge.color)} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Timeline */}
          <div className="space-y-6">
            <Card className="animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Contribution Timeline
                </CardTitle>
                <CardDescription>
                  Your journey as a contributor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'rounded-full p-2',
                          milestone.completed ? 'bg-emerald-100' : 'bg-gray-100'
                        )}>
                          <milestone.icon className={cn(
                            'h-4 w-4',
                            milestone.completed ? 'text-emerald-600' : 'text-gray-400'
                          )} />
                        </div>
                        {index < milestones.length - 1 && (
                          <div className={cn(
                            'w-0.5 h-full min-h-[40px] mt-2',
                            milestone.completed ? 'bg-emerald-200' : 'bg-gray-200'
                          )} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <h4 className={cn(
                          'font-semibold text-sm',
                          milestone.completed ? 'text-gray-900' : 'text-gray-400'
                        )}>
                          {milestone.title}
                        </h4>
                        {milestone.date && milestone.completed ? (
                          <p className="text-xs text-gray-500 mt-1">
                            {format(milestone.date, 'MMM d, yyyy')}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1">Not yet achieved</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User's Reports */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Your Safety Reports
            </CardTitle>
            <CardDescription>
              Incidents you've reported to help the community stay safe
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : userIncidents && userIncidents.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {userIncidents.map(incident => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="bg-emerald-50 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                  <Shield className="h-12 w-12 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">Start Your Contribution Journey</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Your first report helps fellow travelers make informed decisions and contributes to a safer Chicago for everyone.
                  </p>
                </div>
                <Link to="/report">
                  <Button className="mt-4 gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <FileText className="h-4 w-4" />
                    Submit Your First Report
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
