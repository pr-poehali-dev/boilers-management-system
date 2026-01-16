import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Client, Boiler } from './types';
import NotificationsPanel from './NotificationsPanel';

interface HeaderProps {
  clients: Client[];
  boilers: Boiler[];
}

const Header = ({ clients, boilers }: HeaderProps) => {
  return (
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
            <NotificationsPanel boilers={boilers} />
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
  );
};

export default Header;