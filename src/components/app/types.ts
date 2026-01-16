export type RequestStatus = 'new' | 'in-progress' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Request {
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

export interface Boiler {
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

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  boilersCount: number;
  requestsCount: number;
  lastContact: string;
}

export interface CalendarEvent {
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

export interface Master {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  color: string;
}

export type PartCategory = 'burner' | 'pump' | 'valve' | 'sensor' | 'filter' | 'gasket' | 'electrode' | 'other';
export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  category: PartCategory;
  manufacturer: string;
  compatibleModels: string[];
  quantity: number;
  minQuantity: number;
  unit: string;
  price: number;
  supplier: string;
  location: string;
  status: StockStatus;
  lastRestocked: string;
  notes?: string;
}

export interface PartUsageHistory {
  id: string;
  partId: string;
  partName: string;
  quantity: number;
  requestId: string;
  boilerId: string;
  clientName: string;
  masterId: string;
  masterName: string;
  usedAt: string;
  notes?: string;
}