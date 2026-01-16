import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    </div>
  );
};

export default BoilersTab;
