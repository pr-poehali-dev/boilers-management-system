import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Client } from './types';

interface ClientsTabProps {
  clients: Client[];
}

const ClientsTab = ({ clients }: ClientsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Поиск по клиентам..." 
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="Building2" size={20} className="text-primary" />
                {client.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Phone" size={16} />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Mail" size={16} />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="MapPin" size={16} />
                  <span>{client.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{client.boilersCount}</div>
                  <div className="text-xs text-muted-foreground">Котлов</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{client.requestsCount}</div>
                  <div className="text-xs text-muted-foreground">Заявок</div>
                </div>
                <div>
                  <div className="text-xs font-medium">{new Date(client.lastContact).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}</div>
                  <div className="text-xs text-muted-foreground">Контакт</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="Phone" size={16} />
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="Mail" size={16} />
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="Eye" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientsTab;
