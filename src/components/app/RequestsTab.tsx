import { Card, CardContent } from '@/components/ui/card';
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
import { Request } from './types';
import { getStatusBadge, getPriorityBadge } from './utils';

interface RequestsTabProps {
  requests: Request[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const RequestsTab = ({ requests, searchTerm, setSearchTerm }: RequestsTabProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default RequestsTab;
