import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Incident, IncidentSeverity, IncidentCategory } from '@/types';
import { cn } from '@/lib/utils';

interface IncidentCardProps {
  incident: Incident;
  onClick?: () => void;
}

const severityConfig: Record<IncidentSeverity, { label: string; className: string; badgeClass: string }> = {
  low: {
    label: 'Low',
    className: 'bg-green-50 border-green-200 hover:border-green-300',
    badgeClass: 'bg-green-100 text-green-700 border-green-200'
  },
  medium: {
    label: 'Medium',
    className: 'bg-orange-50 border-orange-200 hover:border-orange-300',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  high: {
    label: 'High',
    className: 'bg-red-50 border-red-200 hover:border-red-300',
    badgeClass: 'bg-red-100 text-red-700 border-red-200'
  },
};

const categoryLabels: Record<IncidentCategory, string> = {
  theft: 'Theft',
  assault: 'Assault',
  vandalism: 'Vandalism',
  harassment: 'Harassment',
  scam: 'Scam/Fraud',
  unsafe_area: 'Unsafe Area',
  other: 'Other',
};

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick }) => {
  const severityInfo = severityConfig[incident.severity];
  const categoryLabel = categoryLabels[incident.category];

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2',
        severityInfo.className,
        onClick && 'active:scale-[0.98]'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-bold leading-tight text-gray-900 line-clamp-2">
            {incident.title}
          </CardTitle>
          <Badge className={cn('shrink-0 font-semibold border', severityInfo.badgeClass)}>
            {severityInfo.label}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border border-gray-200 font-medium">
            {categoryLabel}
          </Badge>
          {incident.verified && (
            <Badge variant="secondary" className="gap-1.5 bg-blue-50 text-blue-700 border border-blue-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {incident.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {incident.location}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            {formatDistanceToNow(new Date(incident.reportedAt), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentCard;
