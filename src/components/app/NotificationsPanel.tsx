import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Boiler } from './types';

interface NotificationsPanelProps {
  boilers: Boiler[];
}

interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  boiler: Boiler;
  daysUntil: number;
  createdAt: Date;
}

const NotificationsPanel = ({ boilers }: NotificationsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = useMemo(() => {
    const now = new Date();
    const result: Notification[] = [];

    boilers.forEach(boiler => {
      const nextMaintenanceDate = new Date(boiler.nextMaintenance);
      const diffTime = nextMaintenanceDate.getTime() - now.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysUntil < 0) {
        result.push({
          id: `${boiler.id}-overdue`,
          type: 'critical',
          title: 'Просрочено ТО!',
          message: `${boiler.model} (${boiler.clientName}) - техобслуживание просрочено на ${Math.abs(daysUntil)} дн.`,
          boiler,
          daysUntil,
          createdAt: new Date()
        });
      } else if (daysUntil <= 7) {
        result.push({
          id: `${boiler.id}-urgent`,
          type: 'critical',
          title: 'Срочное ТО!',
          message: `${boiler.model} (${boiler.clientName}) - ТО через ${daysUntil} дн.`,
          boiler,
          daysUntil,
          createdAt: new Date()
        });
      } else if (daysUntil <= 14) {
        result.push({
          id: `${boiler.id}-warning`,
          type: 'warning',
          title: 'Скоро ТО',
          message: `${boiler.model} (${boiler.clientName}) - ТО через ${daysUntil} дн.`,
          boiler,
          daysUntil,
          createdAt: new Date()
        });
      } else if (daysUntil <= 30) {
        result.push({
          id: `${boiler.id}-info`,
          type: 'info',
          title: 'Плановое ТО',
          message: `${boiler.model} (${boiler.clientName}) - ТО через ${daysUntil} дн.`,
          boiler,
          daysUntil,
          createdAt: new Date()
        });
      }
    });

    return result.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [boilers]);

  const criticalCount = notifications.filter(n => n.type === 'critical').length;
  const warningCount = notifications.filter(n => n.type === 'warning').length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return { name: 'AlertCircle', color: 'text-red-500' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'text-orange-500' };
      case 'info':
        return { name: 'Info', color: 'text-blue-500' };
      default:
        return { name: 'Bell', color: 'text-gray-500' };
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Критично</Badge>;
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-800">Внимание</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Инфо</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-white relative">
          <Icon name="Bell" size={18} />
          {(criticalCount > 0 || warningCount > 0) && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {criticalCount + warningCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon name="Bell" size={24} className="text-primary" />
            Уведомления о ТО
          </SheetTitle>
          <SheetDescription>
            Критические сроки техобслуживания котлов
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-red-500">{criticalCount}</div>
                <div className="text-xs text-muted-foreground">Критичных</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-orange-500">{warningCount}</div>
                <div className="text-xs text-muted-foreground">Важных</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-blue-500">{notifications.length}</div>
                <div className="text-xs text-muted-foreground">Всего</div>
              </CardContent>
            </Card>
          </div>

          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-3 pr-4">
              {notifications.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Icon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">Все котлы в порядке! Нет критических уведомлений.</p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map(notification => {
                  const icon = getNotificationIcon(notification.type);
                  return (
                    <Card key={notification.id} className={`hover:shadow-md transition-shadow ${
                      notification.type === 'critical' ? 'border-l-4 border-l-red-500' : 
                      notification.type === 'warning' ? 'border-l-4 border-l-orange-500' : 
                      'border-l-4 border-l-blue-500'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <Icon name={icon.name} size={20} className={icon.color} />
                            <CardTitle className="text-sm">{notification.title}</CardTitle>
                          </div>
                          {getNotificationBadge(notification.type)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">{notification.message}</p>
                        
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Icon name="MapPin" size={14} />
                            <span>{notification.boiler.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Hash" size={14} />
                            <span>{notification.boiler.serialNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Calendar" size={14} />
                            <span>Плановая дата: {new Date(notification.boiler.nextMaintenance).toLocaleDateString('ru-RU')}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1" variant="outline">
                            <Icon name="Phone" size={14} />
                            <span className="ml-1">Позвонить</span>
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Icon name="Calendar" size={14} />
                            <span className="ml-1">Назначить</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsPanel;
