import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Boiler } from './types';
import { getBoilerStatusBadge } from './utils';

interface BoilersTabProps {
  boilers: Boiler[];
}

const BoilersTab = ({ boilers }: BoilersTabProps) => {
  const getMaintenanceAlert = (nextMaintenance: string) => {
    const now = new Date();
    const maintenanceDate = new Date(nextMaintenance);
    const diffTime = maintenanceDate.getTime() - now.getTime();
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) {
      return {
        type: 'overdue',
        color: 'bg-red-500',
        text: `Просрочено на ${Math.abs(daysUntil)} дн.`,
        icon: 'AlertCircle',
        badge: <Badge className="bg-red-100 text-red-800 animate-pulse">Просрочено!</Badge>,
        progress: 100
      };
    } else if (daysUntil <= 7) {
      return {
        type: 'urgent',
        color: 'bg-red-500',
        text: `Через ${daysUntil} дн.`,
        icon: 'AlertCircle',
        badge: <Badge className="bg-red-100 text-red-800">Срочно!</Badge>,
        progress: ((7 - daysUntil) / 7) * 100
      };
    } else if (daysUntil <= 14) {
      return {
        type: 'warning',
        color: 'bg-orange-500',
        text: `Через ${daysUntil} дн.`,
        icon: 'AlertTriangle',
        badge: <Badge className="bg-orange-100 text-orange-800">Скоро</Badge>,
        progress: ((14 - daysUntil) / 14) * 100
      };
    } else if (daysUntil <= 30) {
      return {
        type: 'info',
        color: 'bg-blue-500',
        text: `Через ${daysUntil} дн.`,
        icon: 'Info',
        badge: <Badge className="bg-blue-100 text-blue-800">Планово</Badge>,
        progress: ((30 - daysUntil) / 30) * 100
      };
    } else {
      return {
        type: 'ok',
        color: 'bg-green-500',
        text: `Через ${daysUntil} дн.`,
        icon: 'CheckCircle',
        badge: null,
        progress: 0
      };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Поиск по котлам..." 
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все котлы</SelectItem>
            <SelectItem value="active">Работают</SelectItem>
            <SelectItem value="warning">Требуют внимания</SelectItem>
            <SelectItem value="critical">Критичные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {boilers.map((boiler) => {
          const maintenanceAlert = getMaintenanceAlert(boiler.nextMaintenance);
          const isUrgent = maintenanceAlert.type === 'overdue' || maintenanceAlert.type === 'urgent';
          
          return (
            <Card 
              key={boiler.id} 
              className={`hover:shadow-md transition-shadow ${
                isUrgent ? 'border-l-4 border-l-red-500 shadow-sm' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{boiler.model}</CardTitle>
                      {maintenanceAlert.badge}
                    </div>
                    <p className="text-sm text-muted-foreground">{boiler.serialNumber}</p>
                  </div>
                  {getBoilerStatusBadge(boiler.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="Building2" size={16} className="text-muted-foreground" />
                    <span className="font-medium">{boiler.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="MapPin" size={16} />
                    <span>{boiler.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Calendar" size={16} />
                    <span>Установлен: {new Date(boiler.installDate).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${
                  isUrgent ? 'bg-red-50 border border-red-200' : 'bg-muted'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon 
                        name={maintenanceAlert.icon} 
                        size={16} 
                        className={isUrgent ? 'text-red-600' : 'text-muted-foreground'}
                      />
                      <span className={`text-sm font-medium ${
                        isUrgent ? 'text-red-700' : 'text-muted-foreground'
                      }`}>
                        Следующее ТО:
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${
                      isUrgent ? 'text-red-600' : 'text-accent'
                    }`}>
                      {maintenanceAlert.text}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Дата: {new Date(boiler.nextMaintenance).toLocaleDateString('ru-RU')}
                  </div>
                  {maintenanceAlert.progress > 0 && (
                    <Progress 
                      value={maintenanceAlert.progress} 
                      className={`h-2 ${
                        maintenanceAlert.type === 'overdue' || maintenanceAlert.type === 'urgent' 
                          ? '[&>div]:bg-red-500' 
                          : maintenanceAlert.type === 'warning'
                          ? '[&>div]:bg-orange-500'
                          : '[&>div]:bg-blue-500'
                      }`}
                    />
                  )}
                </div>

                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Последнее ТО:</span>
                    <span className="font-medium">{new Date(boiler.lastMaintenance).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">История работ:</span>
                    <span className="font-medium">{boiler.workHistory} записей</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Icon name="History" size={16} />
                    <span className="ml-2">История</span>
                  </Button>
                  <Button 
                    size="sm" 
                    className={`flex-1 ${
                      isUrgent ? 'bg-red-500 hover:bg-red-600' : ''
                    }`}
                  >
                    <Icon name="Wrench" size={16} />
                    <span className="ml-2">Назначить ТО</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BoilersTab;