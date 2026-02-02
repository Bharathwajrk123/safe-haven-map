import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, CheckCircle, AlertCircle, Info, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import MapView from '@/components/map/MapView';
import { useCreateIncident } from '@/hooks/useIncidents';
import { useAuth } from '@/context/AuthContext';
import { INCIDENT_CATEGORIES, IncidentCategory, CHICAGO_CENTER } from '@/types';
import { cn } from '@/lib/utils';

type SeverityLevel = 'low' | 'medium' | 'high';

const Report: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const createIncident = useCreateIncident();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as IncidentCategory | '',
    location: '',
    latitude: CHICAGO_CENTER.lat,
    longitude: CHICAGO_CENTER.lng,
    severity: 'medium' as SeverityLevel,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as IncidentCategory }));
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const handleSeverityChange = (severity: SeverityLevel) => {
    setFormData(prev => ({ ...prev, severity }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createIncident.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category as IncidentCategory,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        severity: formData.severity,
      });

      setSuccess(true);

      // Countdown timer
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/map');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      setErrors({ submit: 'Failed to submit report. Please try again.' });
    }
  };

  const getSeverityColor = (severity: SeverityLevel) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] items-center justify-center py-8">
          <Card className="w-full max-w-lg text-center animate-in fade-in zoom-in duration-500">
            <CardContent className="pt-8 pb-6 space-y-6">
              <div className="animate-in zoom-in duration-700 delay-100">
                <CheckCircle className="mx-auto h-20 w-20 text-emerald-600" strokeWidth={1.5} />
              </div>
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <h2 className="text-2xl font-bold text-gray-900">Report Submitted Successfully!</h2>
                <p className="text-gray-600 leading-relaxed">
                  Thank you for contributing to community safety. Your report helps fellow travelers make informed decisions.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <p className="text-sm font-medium text-emerald-900 flex items-center justify-center gap-2">
                  <Info className="h-4 w-4" />
                  What happens next?
                </p>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>✓ Report is under review</li>
                  <li>✓ Will be visible on the map shortly</li>
                  <li>✓ Community members will be notified</li>
                </ul>
              </div>

              <div className="text-sm text-gray-500 animate-in fade-in duration-700 delay-500">
                Redirecting to map in {countdown} second{countdown !== 1 ? 's' : ''}...
              </div>

              <Button
                onClick={() => navigate('/map')}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400"
              >
                View on Map Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <FileText className="h-8 w-8 text-emerald-600" />
            Report an Incident
          </h1>
          <p className="text-gray-600 mt-2">
            Help keep Chicago safe by sharing factual safety information with the community
          </p>
        </div>

        {!isAuthenticated && (
          <Alert className="animate-in fade-in slide-in-from-top-4 duration-500 delay-75">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You can submit reports without logging in, but creating an account helps track your contributions.
            </AlertDescription>
          </Alert>
        )}

        {/* Reporting Guidelines */}
        <Alert className="bg-blue-50 border-blue-200 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-900 font-semibold mb-2">Responsible Reporting Guidelines</AlertTitle>
          <AlertDescription className="text-blue-800 space-y-2">
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Be factual and objective - report what you observed</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Avoid sharing personal information about anyone involved</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Focus on safety-relevant details (time, location, incident type)</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Report recent incidents (within 24-48 hours for accuracy)</span>
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <Card className="animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>
                Provide clear and accurate information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Severity Selector */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Severity Level *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['low', 'medium', 'high'] as SeverityLevel[]).map((severity) => (
                      <button
                        key={severity}
                        type="button"
                        onClick={() => handleSeverityChange(severity)}
                        className={cn(
                          'px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm capitalize',
                          'hover:shadow-md active:scale-95',
                          formData.severity === severity
                            ? getSeverityColor(severity) + ' border-current shadow-md'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        )}
                      >
                        {severity}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 flex items-start gap-1.5">
                    <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    <span>Severity helps users assess risk levels in different areas</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Suspicious activity near Navy Pier"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={100}
                    className={cn(
                      'transition-all duration-200',
                      'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                      errors.title && 'border-red-500 focus:ring-red-500'
                    )}
                  />
                  <div className="flex justify-between items-center">
                    {errors.title ? (
                      <p className="text-sm text-red-600">{errors.title}</p>
                    ) : (
                      <p className="text-xs text-gray-500">Brief, descriptive title</p>
                    )}
                    <span className="text-xs text-gray-400">{formData.title.length}/100</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger
                      className={cn(
                        'transition-all duration-200',
                        'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                        errors.category && 'border-red-500'
                      )}
                    >
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCIDENT_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what happened, when it occurred, and any safety tips for others..."
                    rows={5}
                    value={formData.description}
                    onChange={handleInputChange}
                    maxLength={500}
                    className={cn(
                      'transition-all duration-200 resize-none',
                      'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                      errors.description && 'border-red-500 focus:ring-red-500'
                    )}
                  />
                  <div className="flex justify-between items-center">
                    {errors.description ? (
                      <p className="text-sm text-red-600">{errors.description}</p>
                    ) : (
                      <p className="text-xs text-gray-500">Factual details and context</p>
                    )}
                    <span className="text-xs text-gray-400">{formData.description.length}/500</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location Name *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Millennium Park, Navy Pier, Michigan Avenue"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={cn(
                      'transition-all duration-200',
                      'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                      errors.location && 'border-red-500 focus:ring-red-500'
                    )}
                  />
                  {errors.location ? (
                    <p className="text-sm text-red-600">{errors.location}</p>
                  ) : (
                    <p className="text-xs text-gray-500">Well-known landmark or street name</p>
                  )}
                </div>

                {errors.submit && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold transition-all duration-200 hover:shadow-lg"
                  disabled={createIncident.isPending}
                >
                  {createIncident.isPending ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Submitting Report...
                    </>
                  ) : (
                    'Submit Safety Report'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Select Location
              </CardTitle>
              <CardDescription>
                Click on the map to pinpoint where the incident occurred
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[400px] overflow-hidden rounded-lg border border-gray-200">
                <MapView
                  incidents={[]}
                  clickableMap
                  onMapClick={handleMapClick}
                  center={{ lat: formData.latitude, lng: formData.longitude }}
                  zoom={14}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">Selected:</span>
                <span className="font-mono text-xs">
                  {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Report;
