import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type RequestStatus = 'new' | 'in-progress' | 'completed' | 'cancelled';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface Request {
  id: string;
  clientName: string;
  boilerModel: string;
  issue: string;
  status: RequestStatus;
  priority: Priority;
  assignedTo: string;
  createdAt: string;
  scheduledDate?: string;
}

interface Boiler {
  id: string;
  model: string;
  serialNumber: string;
  clientName: string;
  location: string;
  installDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'active' | 'maintenance' | 'warning' | 'critical';
  workHistory: number;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  boilersCount: number;
  requestsCount: number;
  lastContact: string;
}

interface CalendarEvent {
  id: string;
  requestId: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  masterId: string;
  masterName: string;
  priority: Priority;
  status: RequestStatus;
  clientName: string;
}

interface Master {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  color: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'week' | 'day'>('week');
  const [selectedMasterFilter, setSelectedMasterFilter] = useState<string>('all');

  const requests: Request[] = [
    {
      id: 'REQ-001',
      clientName: 'ООО "Теплосеть"',
      boilerModel: 'Buderus Logano G234',
      issue: 'Падение давления в системе',
      status: 'new',
      priority: 'urgent',
      assignedTo: 'Не назначен',
      createdAt: '2026-01-16 09:30',
      scheduledDate: '2026-01-16 14:00'
    },
    {
      id: 'REQ-002',
      clientName: 'АО "Промстрой"',
      boilerModel: 'Viessmann Vitoplex 100',
      issue: 'Плановое ТО',
      status: 'in-progress',
      priority: 'medium',
      assignedTo: 'Иванов П.С.',
      createdAt: '2026-01-15 11:20',
      scheduledDate: '2026-01-16 10:00'
    },
    {
      id: 'REQ-003',
      clientName: 'ТЦ "Центральный"',
      boilerModel: 'Bosch Unimat UT-L',
      issue: 'Замена горелки',
      status: 'completed',
      priority: 'high',
      assignedTo: 'Петров А.М.',
      createdAt: '2026-01-14 14:15'
    },
    {
      id: 'REQ-004',
      clientName: 'Гостиница "Северная"',
      boilerModel: 'De Dietrich GT 320',
      issue: 'Настройка автоматики',
      status: 'new',
      priority: 'low',
      assignedTo: 'Не назначен',
      createdAt: '2026-01-16 08:00'
    }
  ];

  const boilers: Boiler[] = [
    {
      id: 'BLR-001',
      model: 'Buderus Logano G234',
      serialNumber: 'BUD-2023-4521',
      clientName: 'ООО "Теплосеть"',
      location: 'ул. Промышленная, 15',
      installDate: '2023-09-12',
      lastMaintenance: '2025-11-20',
      nextMaintenance: '2026-05-20',
      status: 'warning',
      workHistory: 8
    },
    {
      id: 'BLR-002',
      model: 'Viessmann Vitoplex 100',
      serialNumber: 'VIE-2022-8934',
      clientName: 'АО "Промстрой"',
      location: 'пр. Ленина, 78',
      installDate: '2022-03-25',
      lastMaintenance: '2026-01-10',
      nextMaintenance: '2026-07-10',
      status: 'active',
      workHistory: 12
    },
    {
      id: 'BLR-003',
      model: 'Bosch Unimat UT-L',
      serialNumber: 'BSH-2024-1122',
      clientName: 'ТЦ "Центральный"',
      location: 'ул. Советская, 42',
      installDate: '2024-01-15',
      lastMaintenance: '2025-12-28',
      nextMaintenance: '2026-06-28',
      status: 'active',
      workHistory: 5
    },
    {
      id: 'BLR-004',
      model: 'De Dietrich GT 320',
      serialNumber: 'DDT-2021-6734',
      clientName: 'Гостиница "Северная"',
      location: 'ул. Гагарина, 8',
      installDate: '2021-11-03',
      lastMaintenance: '2025-09-15',
      nextMaintenance: '2026-03-15',
      status: 'critical',
      workHistory: 18
    }
  ];

  const clients: Client[] = [
    {
      id: 'CLT-001',
      name: 'ООО "Теплосеть"',
      phone: '+7 (495) 123-45-67',
      email: 'info@teplo.ru',
      address: 'ул. Промышленная, 15',
      boilersCount: 3,
      requestsCount: 12,
      lastContact: '2026-01-16'
    },
    {
      id: 'CLT-002',
      name: 'АО "Промстрой"',
      phone: '+7 (495) 234-56-78',
      email: 'contact@promstroy.ru',
      address: 'пр. Ленина, 78',
      boilersCount: 5,
      requestsCount: 8,
      lastContact: '2026-01-15'
    },
    {
      id: 'CLT-003',
      name: 'ТЦ "Центральный"',
      phone: '+7 (495) 345-67-89',
      email: 'admin@tc-central.ru',
      address: 'ул. Советская, 42',
      boilersCount: 2,
      requestsCount: 15,
      lastContact: '2026-01-14'
    },
    {
      id: 'CLT-004',
      name: 'Гостиница "Северная"',
      phone: '+7 (495) 456-78-90',
      email: 'service@hotel-north.ru',
      address: 'ул. Гагарина, 8',
      boilersCount: 4,
      requestsCount: 22,
      lastContact: '2026-01-16'
    }
  ];

  const masters: Master[] = [
    {
      id: 'MST-001',
      name: 'Иванов П.С.',
      phone: '+7 (495) 111-22-33',
      specialization: 'Buderus, Viessmann',
      color: '#3b82f6'
    },
    {
      id: 'MST-002',
      name: 'Петров А.М.',
      phone: '+7 (495) 222-33-44',
      specialization: 'Bosch, De Dietrich',
      color: '#22c55e'
    },
    {
      id: 'MST-003',
      name: 'Сидоров В.К.',
      phone: '+7 (495) 333-44-55',
      specialization: 'Универсал',
      color: '#f97316'
    },
    {
      id: 'MST-004',
      name: 'Козлов Д.Н.',
      phone: '+7 (495) 444-55-66',
      specialization: 'Электроника, автоматика',
      color: '#a855f7'
    }
  ];

  const calendarEvents: CalendarEvent[] = [
    {
      id: 'EVT-001',
      requestId: 'REQ-002',
      title: 'Плановое ТО - Viessmann',
      date: '2026-01-16',
      time: '10:00',
      duration: 120,
      masterId: 'MST-001',
      masterName: 'Иванов П.С.',
      priority: 'medium',
      status: 'in-progress',
      clientName: 'АО "Промстрой"'
    },
    {
      id: 'EVT-002',
      requestId: 'REQ-001',
      title: 'СРОЧНО: Падение давления',
      date: '2026-01-16',
      time: '14:00',
      duration: 180,
      masterId: 'MST-001',
      masterName: 'Иванов П.С.',
      priority: 'urgent',
      status: 'new',
      clientName: 'ООО "Теплосеть"'
    },
    {
      id: 'EVT-003',
      requestId: 'REQ-003',
      title: 'Диагностика автоматики',
      date: '2026-01-16',
      time: '16:30',
      duration: 90,
      masterId: 'MST-002',
      masterName: 'Петров А.М.',
      priority: 'medium',
      status: 'in-progress',
      clientName: 'ТЦ "Центральный"'
    },
    {
      id: 'EVT-004',
      requestId: 'REQ-005',
      title: 'Замена датчика температуры',
      date: '2026-01-17',
      time: '09:00',
      duration: 60,
      masterId: 'MST-003',
      masterName: 'Сидоров В.К.',
      priority: 'low',
      status: 'new',
      clientName: 'ООО "Теплосеть"'
    },
    {
      id: 'EVT-005',
      requestId: 'REQ-006',
      title: 'Настройка горелки',
      date: '2026-01-17',
      time: '11:00',
      duration: 120,
      masterId: 'MST-002',
      masterName: 'Петров А.М.',
      priority: 'high',
      status: 'new',
      clientName: 'Гостиница "Северная"'
    },
    {
      id: 'EVT-006',
      requestId: 'REQ-007',
      title: 'Чистка теплообменника',
      date: '2026-01-17',
      time: '14:00',
      duration: 150,
      masterId: 'MST-001',
      masterName: 'Иванов П.С.',
      priority: 'medium',
      status: 'new',
      clientName: 'АО "Промстрой"'
    },
    {
      id: 'EVT-007',
      requestId: 'REQ-008',
      title: 'Проверка системы безопасности',
      date: '2026-01-18',
      time: '10:00',
      duration: 90,
      masterId: 'MST-004',
      masterName: 'Козлов Д.Н.',
      priority: 'high',
      status: 'new',
      clientName: 'ТЦ "Центральный"'
    }
  ];

  const getStatusBadge = (status: RequestStatus) => {
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

  const getPriorityBadge = (priority: Priority) => {
    const variants = {
      low: { className: 'bg-blue-100 text-blue-800', label: 'Низкий' },
      medium: { className: 'bg-yellow-100 text-yellow-800', label: 'Средний' },
      high: { className: 'bg-orange-100 text-orange-800', label: 'Высокий' },
      urgent: { className: 'bg-red-100 text-red-800', label: 'Срочно' }
    };
    const config = variants[priority];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getBoilerStatusBadge = (status: string) => {
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

  const stats = {
    totalRequests: 145,
    activeRequests: 23,
    completedToday: 8,
    totalBoilers: 67,
    maintenanceDue: 12,
    criticalBoilers: 3,
    totalClients: 42,
    avgResponseTime: '2.4ч'
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const current = new Date(date);
    current.setDate(current.getDate() - current.getDay() + 1);
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return week;
  };

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  const filteredEvents = useMemo(() => {
    if (selectedMasterFilter === 'all') return calendarEvents;
    return calendarEvents.filter(e => e.masterId === selectedMasterFilter);
  }, [selectedMasterFilter]);

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(e => e.date === dateStr);
  };

  const formatTime = (time: string) => time;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-sidebar">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accent rounded-lg p-2">
                <Icon name="Flame" size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-sidebar-foreground">Котельная Pro</h1>
                <p className="text-sm text-sidebar-foreground/70">Система управления ремонтом котлов</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="bg-white">
                <Icon name="Bell" size={18} />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Icon name="Plus" size={18} />
                    <span className="ml-2">Новая заявка</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создать заявку на ремонт</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Клиент</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите клиента" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Котел</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите котел" />
                        </SelectTrigger>
                        <SelectContent>
                          {boilers.map(boiler => (
                            <SelectItem key={boiler.id} value={boiler.id}>{boiler.model} - {boiler.serialNumber}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Приоритет</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите приоритет" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Низкий</SelectItem>
                          <SelectItem value="medium">Средний</SelectItem>
                          <SelectItem value="high">Высокий</SelectItem>
                          <SelectItem value="urgent">Срочно</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Описание проблемы</Label>
                      <Textarea placeholder="Опишите проблему..." rows={4} />
                    </div>
                    <Button className="w-full">Создать заявку</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Icon name="LayoutDashboard" size={16} />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              Календарь
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Icon name="ClipboardList" size={16} />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="boilers" className="flex items-center gap-2">
              <Icon name="Flame" size={16} />
              Котлы
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Icon name="Users" size={16} />
              Клиенты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
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
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Завершено сегодня</CardTitle>
                    <Icon name="CheckCircle" size={20} className="text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.completedToday}</div>
                  <p className="text-xs text-muted-foreground mt-1">среднее время: {stats.avgResponseTime}</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Требуется ТО</CardTitle>
                    <Icon name="AlertTriangle" size={20} className="text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.maintenanceDue}</div>
                  <p className="text-xs text-muted-foreground mt-1">из {stats.totalBoilers} котлов</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Критические</CardTitle>
                    <Icon name="AlertCircle" size={20} className="text-red-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.criticalBoilers}</div>
                  <p className="text-xs text-muted-foreground mt-1">требуют срочного внимания</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} />
                    Загрузка мастеров
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Иванов П.С.</span>
                      <span className="text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-muted-foreground">5 активных заявок</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Петров А.М.</span>
                      <span className="text-muted-foreground">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                    <p className="text-xs text-muted-foreground">4 активные заявки</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Сидоров В.К.</span>
                      <span className="text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <p className="text-xs text-muted-foreground">2 активные заявки</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Козлов Д.Н.</span>
                      <span className="text-muted-foreground">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    <p className="text-xs text-muted-foreground">1 активная заявка</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Calendar" size={20} />
                    График на сегодня
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="bg-primary text-white rounded px-2 py-1 text-xs font-bold">10:00</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Плановое ТО - Viessmann Vitoplex 100</p>
                      <p className="text-xs text-muted-foreground">Иванов П.С. • АО "Промстрой"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="bg-accent text-white rounded px-2 py-1 text-xs font-bold">14:00</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">СРОЧНО: Падение давления</p>
                      <p className="text-xs text-muted-foreground">Не назначен • ООО "Теплосеть"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="bg-muted-foreground text-white rounded px-2 py-1 text-xs font-bold">16:30</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Диагностика автоматики</p>
                      <p className="text-xs text-muted-foreground">Петров А.М. • ТЦ "Центральный"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BarChart3" size={20} />
                  Статистика работ за неделю
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
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                  <Icon name="ChevronLeft" size={18} />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Сегодня
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextWeek}>
                  <Icon name="ChevronRight" size={18} />
                </Button>
                <h3 className="text-lg font-semibold ml-4">
                  {weekDays[0] && weekDays[6] && (
                    <>
                      {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
                    </>
                  )}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Select value={selectedMasterFilter} onValueChange={setSelectedMasterFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все мастера</SelectItem>
                    {masters.map(master => (
                      <SelectItem key={master.id} value={master.id}>
                        {master.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-accent hover:bg-accent/90">
                      <Icon name="Plus" size={18} />
                      <span className="ml-2">Назначить</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Назначить мастера на работу</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Заявка</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите заявку" />
                          </SelectTrigger>
                          <SelectContent>
                            {requests.filter(r => r.status === 'new').map(request => (
                              <SelectItem key={request.id} value={request.id}>
                                {request.id} - {request.issue}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Мастер</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите мастера" />
                          </SelectTrigger>
                          <SelectContent>
                            {masters.map(master => (
                              <SelectItem key={master.id} value={master.id}>
                                {master.name} - {master.specialization}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Дата</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>Время начала</Label>
                        <Input type="time" defaultValue="09:00" />
                      </div>
                      <div>
                        <Label>Длительность (минуты)</Label>
                        <Input type="number" defaultValue="120" />
                      </div>
                      <Button className="w-full">Назначить</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-8 border-b">
                  <div className="p-4 border-r bg-muted/30">
                    <div className="text-sm font-medium">Мастер</div>
                  </div>
                  {weekDays.map((day, index) => {
                    const isToday = day.toDateString() === new Date().toDateString();
                    return (
                      <div 
                        key={index} 
                        className={`p-4 border-r text-center ${isToday ? 'bg-primary/5' : ''}`}
                      >
                        <div className="text-xs text-muted-foreground">
                          {day.toLocaleDateString('ru-RU', { weekday: 'short' })}
                        </div>
                        <div className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                          {day.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {masters.map((master) => {
                  const masterEvents = filteredEvents.filter(e => e.masterId === master.id);
                  return (
                    <div key={master.id} className="grid grid-cols-8 border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                      <div className="p-4 border-r">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: master.color }}
                          />
                          <div>
                            <div className="text-sm font-medium">{master.name}</div>
                            <div className="text-xs text-muted-foreground">{master.specialization}</div>
                          </div>
                        </div>
                      </div>
                      {weekDays.map((day, dayIndex) => {
                        const dayEvents = getEventsForDay(day).filter(e => e.masterId === master.id);
                        const isToday = day.toDateString() === new Date().toDateString();
                        return (
                          <div 
                            key={dayIndex} 
                            className={`p-2 border-r min-h-[120px] ${isToday ? 'bg-primary/5' : ''}`}
                          >
                            <div className="space-y-1">
                              {dayEvents.map((event) => (
                                <div
                                  key={event.id}
                                  className="text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-opacity"
                                  style={{ 
                                    backgroundColor: `${master.color}20`,
                                    borderLeft: `3px solid ${master.color}`
                                  }}
                                >
                                  <div className="font-medium text-foreground">
                                    {formatTime(event.time)}
                                  </div>
                                  <div className="text-foreground/80 line-clamp-2">
                                    {event.title}
                                  </div>
                                  <div className="text-muted-foreground mt-1">
                                    {event.clientName}
                                  </div>
                                  <div className="mt-1">
                                    {getPriorityBadge(event.priority)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-4">
              {masters.map(master => {
                const masterEvents = calendarEvents.filter(e => e.masterId === master.id);
                const totalHours = masterEvents.reduce((sum, e) => sum + e.duration, 0) / 60;
                return (
                  <Card key={master.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: master.color }}
                        />
                        <CardTitle className="text-base">{master.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Заявок на неделе:</span>
                          <span className="font-medium">{masterEvents.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Часов работы:</span>
                          <span className="font-medium">{totalHours.toFixed(1)}ч</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Специализация:</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{master.specialization}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Поиск по заявкам..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все заявки</SelectItem>
                  <SelectItem value="new">Новые</SelectItem>
                  <SelectItem value="in-progress">В работе</SelectItem>
                  <SelectItem value="completed">Завершенные</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {requests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">{request.id}</h3>
                          {getStatusBadge(request.status)}
                          {getPriorityBadge(request.priority)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="Building2" size={16} className="text-muted-foreground" />
                            <span className="font-medium">{request.clientName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon name="Flame" size={16} />
                            <span>{request.boilerModel}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="AlertCircle" size={16} className="text-muted-foreground" />
                            <span>{request.issue}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Icon name="User" size={14} />
                            <span>{request.assignedTo}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            <span>{request.createdAt}</span>
                          </div>
                          {request.scheduledDate && (
                            <div className="flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              <span>{request.scheduledDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Icon name="Eye" size={16} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Icon name="Edit" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="boilers" className="space-y-4">
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
              {boilers.map((boiler) => (
                <Card key={boiler.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{boiler.model}</CardTitle>
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

                    <div className="pt-3 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Последнее ТО:</span>
                        <span className="font-medium">{new Date(boiler.lastMaintenance).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Следующее ТО:</span>
                        <span className="font-medium text-accent">{new Date(boiler.nextMaintenance).toLocaleDateString('ru-RU')}</span>
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
                      <Button variant="outline" size="sm" className="flex-1">
                        <Icon name="Wrench" size={16} />
                        <span className="ml-2">ТО</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Поиск по клиентам..." 
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {clients.map((client) => (
                <Card key={client.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 rounded-full p-3">
                            <Icon name="Building2" size={24} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{client.name}</h3>
                            <p className="text-sm text-muted-foreground">{client.id}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Icon name="Phone" size={16} className="text-muted-foreground" />
                            <span>{client.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Mail" size={16} className="text-muted-foreground" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2 md:col-span-2">
                            <Icon name="MapPin" size={16} className="text-muted-foreground" />
                            <span>{client.address}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 pt-2 border-t text-sm">
                          <div className="flex items-center gap-2">
                            <Icon name="Flame" size={16} className="text-accent" />
                            <span className="font-medium">{client.boilersCount}</span>
                            <span className="text-muted-foreground">котлов</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="ClipboardList" size={16} className="text-primary" />
                            <span className="font-medium">{client.requestsCount}</span>
                            <span className="text-muted-foreground">заявок</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Clock" size={16} className="text-muted-foreground" />
                            <span className="text-muted-foreground">Последний контакт: {new Date(client.lastContact).toLocaleDateString('ru-RU')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Icon name="Eye" size={16} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Icon name="Edit" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;