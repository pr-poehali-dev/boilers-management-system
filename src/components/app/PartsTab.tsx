import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SparePart, PartUsageHistory } from './types';

interface PartsTabProps {
  parts: SparePart[];
  usageHistory: PartUsageHistory[];
}

const PartsTab = ({ parts, usageHistory }: PartsTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUsageDialog, setShowUsageDialog] = useState(false);

  const filteredParts = parts.filter((part) => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || part.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || part.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'burner': return 'Flame';
      case 'pump': return 'Droplet';
      case 'valve': return 'Settings';
      case 'sensor': return 'Gauge';
      case 'filter': return 'Filter';
      case 'gasket': return 'Circle';
      case 'electrode': return 'Zap';
      default: return 'Box';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      burner: 'Горелка',
      pump: 'Насос',
      valve: 'Клапан',
      sensor: 'Датчик',
      filter: 'Фильтр',
      gasket: 'Прокладка',
      electrode: 'Электрод',
      other: 'Другое'
    };
    return labels[category] || category;
  };

  const getStatusBadge = (status: string, quantity: number, minQuantity: number) => {
    if (status === 'out-of-stock' || quantity === 0) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <Icon name="AlertTriangle" size={12} />
        Нет на складе
      </Badge>;
    }
    if (status === 'low-stock' || quantity <= minQuantity) {
      return <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 flex items-center gap-1">
        <Icon name="AlertCircle" size={12} />
        Заканчивается
      </Badge>;
    }
    return <Badge variant="secondary" className="bg-green-500/10 text-green-600 flex items-center gap-1">
      <Icon name="CheckCircle" size={12} />
      В наличии
    </Badge>;
  };

  const lowStockCount = parts.filter(p => p.status === 'low-stock' || p.quantity <= p.minQuantity).length;
  const outOfStockCount = parts.filter(p => p.status === 'out-of-stock' || p.quantity === 0).length;
  const totalValue = parts.reduce((sum, p) => sum + (p.quantity * p.price), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего позиций</CardTitle>
            <Icon name="Package" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заканчивается</CardTitle>
            <Icon name="AlertCircle" className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Нет на складе</CardTitle>
            <Icon name="AlertTriangle" className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{outOfStockCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Стоимость склада</CardTitle>
            <Icon name="DollarSign" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue.toLocaleString('ru-RU')} ₽</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Управление складом</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Dialog open={showUsageDialog} onOpenChange={setShowUsageDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Icon name="History" size={16} className="mr-2" />
                    История использования
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>История использования запчастей</DialogTitle>
                    <DialogDescription>
                      Полная история списания запчастей по заявкам
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {usageHistory.map((history) => (
                      <Card key={history.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Icon name="Package" size={16} className="text-primary" />
                                <span className="font-semibold">{history.partName}</span>
                                <Badge variant="outline">{history.quantity} шт.</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Icon name="User" size={14} />
                                  <span>Клиент: {history.clientName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="Wrench" size={14} />
                                  <span>Мастер: {history.masterName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="FileText" size={14} />
                                  <span>Заявка: {history.requestId}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="Calendar" size={14} />
                                  <span>{new Date(history.usedAt).toLocaleDateString('ru-RU')}</span>
                                </div>
                              </div>
                              {history.notes && (
                                <p className="text-sm text-muted-foreground italic">
                                  {history.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить запчасть
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Новая запчасть</DialogTitle>
                    <DialogDescription>
                      Добавьте новую позицию на склад
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Название</Label>
                      <Input placeholder="Циркуляционный насос" />
                    </div>
                    <div className="space-y-2">
                      <Label>Артикул</Label>
                      <Input placeholder="WL-25/6-130" />
                    </div>
                    <div className="space-y-2">
                      <Label>Категория</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="burner">Горелка</SelectItem>
                          <SelectItem value="pump">Насос</SelectItem>
                          <SelectItem value="valve">Клапан</SelectItem>
                          <SelectItem value="sensor">Датчик</SelectItem>
                          <SelectItem value="filter">Фильтр</SelectItem>
                          <SelectItem value="gasket">Прокладка</SelectItem>
                          <SelectItem value="electrode">Электрод</SelectItem>
                          <SelectItem value="other">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Производитель</Label>
                      <Input placeholder="Wilo" />
                    </div>
                    <div className="space-y-2">
                      <Label>Количество</Label>
                      <Input type="number" placeholder="10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Минимальный остаток</Label>
                      <Input type="number" placeholder="3" />
                    </div>
                    <div className="space-y-2">
                      <Label>Единица измерения</Label>
                      <Input placeholder="шт" />
                    </div>
                    <div className="space-y-2">
                      <Label>Цена, ₽</Label>
                      <Input type="number" placeholder="12500" />
                    </div>
                    <div className="space-y-2">
                      <Label>Поставщик</Label>
                      <Input placeholder="ООО Теплотехника" />
                    </div>
                    <div className="space-y-2">
                      <Label>Место хранения</Label>
                      <Input placeholder="Склад А, полка 3" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Совместимые модели (через запятую)</Label>
                      <Input placeholder="Buderus Logano G234, Viessmann Vitoplex 100" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Примечания</Label>
                      <Textarea placeholder="Дополнительная информация о запчасти" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Отмена
                    </Button>
                    <Button onClick={() => setShowAddDialog(false)}>
                      Добавить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon
                  name="Search"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  placeholder="Поиск по названию, артикулу, производителю..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="burner">Горелки</SelectItem>
                <SelectItem value="pump">Насосы</SelectItem>
                <SelectItem value="valve">Клапаны</SelectItem>
                <SelectItem value="sensor">Датчики</SelectItem>
                <SelectItem value="filter">Фильтры</SelectItem>
                <SelectItem value="gasket">Прокладки</SelectItem>
                <SelectItem value="electrode">Электроды</SelectItem>
                <SelectItem value="other">Другое</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="in-stock">В наличии</SelectItem>
                <SelectItem value="low-stock">Заканчивается</SelectItem>
                <SelectItem value="out-of-stock">Нет на складе</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredParts.map((part) => (
              <Card
                key={part.id}
                className={`transition-all hover:shadow-md ${
                  part.quantity === 0 ? 'border-red-500' : 
                  part.quantity <= part.minQuantity ? 'border-orange-500' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon name={getCategoryIcon(part.category)} size={24} className="text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg">{part.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">
                              Артикул: {part.partNumber}
                            </span>
                            <Badge variant="outline">{getCategoryLabel(part.category)}</Badge>
                            {getStatusBadge(part.status, part.quantity, part.minQuantity)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {part.quantity} <span className="text-sm font-normal text-muted-foreground">{part.unit}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            мин: {part.minQuantity} {part.unit}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Производитель</div>
                          <div className="font-medium">{part.manufacturer}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Поставщик</div>
                          <div className="font-medium">{part.supplier}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Место хранения</div>
                          <div className="font-medium">{part.location}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Цена</div>
                          <div className="font-medium">{part.price.toLocaleString('ru-RU')} ₽</div>
                        </div>
                      </div>

                      {part.compatibleModels.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                          <Icon name="Info" size={14} className="text-muted-foreground mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">Совместимость: </span>
                            <span className="font-medium">{part.compatibleModels.join(', ')}</span>
                          </div>
                        </div>
                      )}

                      {part.notes && (
                        <div className="flex items-start gap-2 text-sm">
                          <Icon name="MessageSquare" size={14} className="text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground italic">{part.notes}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          <Icon name="Plus" size={14} className="mr-1" />
                          Пополнить
                        </Button>
                        <Button size="sm" variant="outline">
                          <Icon name="Minus" size={14} className="mr-1" />
                          Списать
                        </Button>
                        <Button size="sm" variant="outline">
                          <Icon name="Edit" size={14} className="mr-1" />
                          Изменить
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600">
                          <Icon name="Trash2" size={14} className="mr-1" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredParts.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Запчасти не найдены</h3>
              <p className="text-muted-foreground">
                Попробуйте изменить параметры поиска или добавьте новую запчасть
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartsTab;
