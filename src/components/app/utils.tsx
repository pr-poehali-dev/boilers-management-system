import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { RequestStatus, Priority } from './types';

export const getStatusBadge = (status: RequestStatus) => {
  const variants = {
    new: { variant: 'default' as const, label: 'Новая', icon: 'AlertCircle' },
    'in-progress': { variant: 'secondary' as const, label: 'В работе', icon: 'Clock' },
    completed: { variant: 'outline' as const, label: 'Завершена', icon: 'CheckCircle' },
    cancelled: { variant: 'destructive' as const, label: 'Отменена', icon: 'XCircle' }
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon name={config.icon} size={12} />
      {config.label}
    </Badge>
  );
};

export const getPriorityBadge = (priority: Priority) => {
  const variants = {
    low: { className: 'bg-blue-100 text-blue-800', label: 'Низкий' },
    medium: { className: 'bg-yellow-100 text-yellow-800', label: 'Средний' },
    high: { className: 'bg-orange-100 text-orange-800', label: 'Высокий' },
    urgent: { className: 'bg-red-100 text-red-800', label: 'Срочно' }
  };
  const config = variants[priority];
  return <Badge className={config.className}>{config.label}</Badge>;
};

export const getBoilerStatusBadge = (status: string) => {
  const variants = {
    active: { className: 'bg-green-100 text-green-800', label: 'Работает', icon: 'CheckCircle' },
    maintenance: { className: 'bg-blue-100 text-blue-800', label: 'ТО', icon: 'Wrench' },
    warning: { className: 'bg-yellow-100 text-yellow-800', label: 'Требует внимания', icon: 'AlertTriangle' },
    critical: { className: 'bg-red-100 text-red-800', label: 'Критично', icon: 'AlertCircle' }
  };
  const config = variants[status as keyof typeof variants];
  return (
    <Badge className={`${config.className} flex items-center gap-1`}>
      <Icon name={config.icon} size={12} />
      {config.label}
    </Badge>
  );
};
