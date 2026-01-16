import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import Header from '@/components/app/Header';
import DashboardTab from '@/components/app/DashboardTab';
import CalendarTab from '@/components/app/CalendarTab';
import RequestsTab from '@/components/app/RequestsTab';
import BoilersTab from '@/components/app/BoilersTab';
import ClientsTab from '@/components/app/ClientsTab';
import { Request, Boiler, Client, Master, CalendarEvent } from '@/components/app/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
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
      <Header clients={clients} boilers={boilers} />

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
            <DashboardTab stats={stats} />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <CalendarTab
              selectedDate={selectedDate}
              selectedMasterFilter={selectedMasterFilter}
              setSelectedMasterFilter={setSelectedMasterFilter}
              masters={masters}
              calendarEvents={calendarEvents}
              requests={requests}
              weekDays={weekDays}
              goToPreviousWeek={goToPreviousWeek}
              goToToday={goToToday}
              goToNextWeek={goToNextWeek}
            />
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <RequestsTab
              requests={requests}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </TabsContent>

          <TabsContent value="boilers" className="space-y-4">
            <BoilersTab boilers={boilers} />
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <ClientsTab clients={clients} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
