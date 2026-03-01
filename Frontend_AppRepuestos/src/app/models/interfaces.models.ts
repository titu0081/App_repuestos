export interface Client {
  id?: number;
  name: string;
  identifier: string | null;
}

export interface LaravelResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  total: number;
}

export interface Device {
  id?: number;
  serial_number: string;
  model: string;
  received_at: string;
  received_by_user_id: number;
  client_id: number;
  reported_issue: string;
  status: string;
}

export interface Part {
  id?: number;
  sku: string;
  name: string;
  description: string;
}

export interface Repairs {
  id?: number;
  device_id: number;
  technician_user_id: number;
  started_at: string;
  finished_at: string | null;
  actions_performed: string;
}

export interface RepairConsuming {
  id?: number;
  part_id: number;
  repair_id: number;
  quantity: number;
  created_by_user_id: number;
}
