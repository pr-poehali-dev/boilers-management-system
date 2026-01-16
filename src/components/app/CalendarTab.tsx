import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { Master, CalendarEvent, Request } from './types';
import { getPriorityBadge } from './utils';

interface CalendarTabProps {
  selectedDate: Date;
  selectedMasterFilter: string;
  setSelectedMasterFilter: (value: string) => void;
  masters: Master[];
  calendarEvents: CalendarEvent[];
  requests: Request[];
  weekDays: Date[];
  goToPreviousWeek: () => void;
  goToToday: () => void;
  goToNextWeek: () => void;
}

const CalendarTab = ({
  selectedDate,
  selectedMasterFilter,
  setSelectedMasterFilter,
  masters,
  calendarEvents,
  requests,
  weekDays,
  goToPreviousWeek,
  goToToday,
  goToNextWeek
}: CalendarTabProps) => {
  const filteredEvents = useMemo(() => {
    if (selectedMasterFilter === 'all') return calendarEvents;
    return calendarEvents.filter(e => e.masterId === selectedMasterFilter);
  }, [selectedMasterFilter, calendarEvents]);

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(e => e.date === dateStr);
  };

  const formatTime = (time: string) => time;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default CalendarTab;
