import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Boiler } from './types';

interface Stats {
  totalRequests: number;
  activeRequests: number;
  completedToday: number;
  totalBoilers: number;
  maintenanceDue: number;
  criticalBoilers: number;
  totalClients: number;
  avgResponseTime: string;
}

interface DashboardTabProps {
  stats: Stats;
  boilers: Boiler[];
}

const DashboardTab = ({ stats, boilers }: DashboardTabProps) => {
  const getMaintenanceUrgency = (nextMaintenance: string) => {
    const now = new Date();
    const maintenanceDate = new Date(nextMaintenance);
    const diffTime = maintenanceDate.getTime() - now.getTime();
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { daysUntil, isOverdue: daysUntil < 0, isUrgent: daysUntil <= 7 };
  };

  const urgentBoilers = boilers
    .map(b => ({ ...b, urgency: getMaintenanceUrgency(b.nextMaintenance) }))
    .filter(b => b.urgency.isOverdue || b.urgency.isUrgent)
    .sort((a, b) => a.urgency.daysUntil - b.urgency.daysUntil)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Активные заявки</CardTitle>
              <Icon name="ClipboardList" size={20} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">из {stats.totalRequests} всего</p>
            <Progress value={(stats.activeRequests / stats.totalRequests) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Завершено сегодня</CardTitle>
              <Icon name="CheckCircle" size={20} className="text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground mt-1">заявок выполнено</p>
            <Progress value={(stats.completedToday / stats.activeRequests) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Котлы на ТО</CardTitle>
              <Icon name="Wrench" size={20} className="text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.maintenanceDue}</div>
            <p className="text-xs text-muted-foreground mt-1">из {stats.totalBoilers} котлов</p>
            <Progress value={(stats.maintenanceDue / stats.totalBoilers) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Критичные</CardTitle>
              <Icon name="AlertCircle" size={20} className="text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{stats.criticalBoilers}</div>
            <p className="text-xs text-muted-foreground mt-1">требуют внимания</p>
            <Progress value={(stats.criticalBoilers / stats.totalBoilers) * 100} className="mt-3 [&>div]:bg-red-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" size={20} className="text-primary" />
              Активность по клиентам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'ООО "Теплосеть"', count: 12, total: 20 },
                { name: 'АО "Промстрой"', count: 8, total: 20 },
                { name: 'ТЦ "Центральный"', count: 15, total: 20 },
                { name: 'Гостиница "Северная"', count: 22, total: 25 }
              ].map((client, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{client.name}</span>
                    <span className="text-muted-foreground">{client.count} заявок</span>
                  </div>
                  <Progress value={(client.count / client.total) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BarChart3" size={20} className="text-accent" />
              Загруженность по дням недели
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => {
                const values = [85, 92, 78, 95, 88, 45, 20];
                const value = values[index];
                return (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <div className="w-full bg-muted rounded-t-lg overflow-hidden h-32 flex items-end">
                      <div 
                        className="w-full bg-primary rounded-t-lg transition-all"
                        style={{ height: `${value}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{day}</span>
                    <span className="text-xs text-muted-foreground">{Math.round(value / 10)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {urgentBoilers.length > 0 && (
        <Card className="border-l-4 border-l-red-500 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="AlertCircle" size={24} className="text-red-500 animate-pulse" />
              Критические сроки ТО
              <Badge className="bg-red-100 text-red-800 ml-2">{urgentBoilers.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentBoilers.map(boiler => (
                <div 
                  key={boiler.id} 
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{boiler.model}</h4>
                      {boiler.urgency.isOverdue ? (
                        <Badge className="bg-red-500 text-white text-xs animate-pulse">
                          Просрочено {Math.abs(boiler.urgency.daysUntil)} дн.!
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-500 text-white text-xs">
                          Через {boiler.urgency.daysUntil} дн.
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Building2" size={12} />
                        {boiler.clientName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="MapPin" size={12} />
                        {boiler.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={12} />
                        {new Date(boiler.nextMaintenance).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Icon name="Phone" size={14} />
                    </Button>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600">
                      <Icon name="Wrench" size={14} />
                      <span className="ml-1">Назначить</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardTab;