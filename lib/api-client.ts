import AsyncStorage from '@react-native-async-storage/async-storage';

const API_CONFIG = {
  baseUrl: 'https://pdms.tayana.in/v1',
  stagingUrl: 'https://staging.pdms.tayana.in/v1',
  timeout: 30000,
};

export interface Application {
  id?: number;
  helpdesk_id: string;
  user_id?: string;
  name?: string;
  voter_id?: string;
  aadhaar_number?: string;
  mobile_number?: string;
  email?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  religion?: string;
  caste?: string;
  address_line1?: string;
  address_line2?: string;
  district?: string;
  assembly_mandalam?: string;
  panchayat?: string;
  municipalitie?: string;
  corporation?: string;
  ward?: string;
  pincode?: string;
  occupation?: string;
  marital_status?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  income_range?: string;
  benefited_scheme?: string;
  scheme_id?: string;
  scheme_details?: string;
  required_help?: string;
  status?: 'Pending' | 'In_Progress' | 'Approved' | 'Rejected';
  created_at?: string;
  updated_at?: string;
  state_id?: string;
  district_id?: string;
  mandal_id?: string;
  ward_id?: string;
  panchayath_id?: string;
  municipalitie_id?: string;
  corporation_id?: string;
  sync_status?: 'Pending' | 'Synced' | 'Failed';
  created_by?: number;
  updated_by?: number;
}

export interface Voter {
  id?: number;
  serial_no?: number;
  name?: string;
  guardian_name?: string;
  house_name?: string;
  id_card_no?: string;
  district_id?: number;
  assembly_id?: number;
  local_body_id?: number;
  ward_id?: number;
  polling_station_id?: number;
  old_ward_no?: string;
  house_no?: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  dob?: string;
  address_line1?: string;
  address_line2?: string;
  pincode?: string;
  lat_long?: string;
  email?: string;
  occupation?: string;
  marital_status?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  religion?: string;
  caste?: string;
  income_range?: string;
  aadhaar_number?: string;
  mobile_number?: string;
  political_inclination?: string;
  note?: string;
  status?: 'Active' | 'Inactive' | 'Deceased';
  created_at?: string;
  updated_at?: string;
  updated_by?: number;
  last_sync_at?: string;
}

export interface Scheme {
  id: string;
  name: string;
  category?: string;
  min_age?: number;
  max_age?: number;
  gender?: string;
  marital_status?: string;
  community?: string;
  differently_abled?: boolean;
  occupation?: string;
  student_status?: boolean;
  bpl_status?: boolean;
  official_site?: string;
  start_date?: string;
  end_date?: string;
  status?: 'Active' | 'Inactive' | 'Expired';
  beneficiaries?: string;
  budget?: number;
  description?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Karyakarta {
  id?: number;
  name: string;
  mobile_number: string;
  email?: string;
  address?: string;
  state_id?: number;
  district_id?: number;
  assembly_id?: number;
  local_body_id?: number;
  ward_id?: number;
  polling_station_id?: number;
  saral_id?: string;
  role?: string;
  status?: 'Active' | 'Inactive' | 'Suspended';
  apns_token?: string;
  last_login_at?: string;
  last_activity_at?: string;
  created_at?: string;
  updated_at?: string;
  last_sync_at?: string;
}

export interface OrganisationalState {
  id?: number;
  name: string;
}

export interface OrganisationalDistrict {
  id?: number;
  state_id: number;
  name: string;
}

export interface AssemblyConstituency {
  id?: number;
  district_id: number;
  name: string;
}

export interface LocalBody {
  id?: number;
  assembly_id: number;
  name: string;
}

export interface Ward {
  id?: number;
  local_body_id: number;
  ward_number: number;
  name?: string;
}

export interface PollingStation {
  id?: number;
  ward_id: number;
  name: string;
  address?: string;
  lat_long?: string;
}

export interface Communication {
  id?: number;
  type: 1 | 2 | 3 | 4 | 5 | 6;
  category: 1 | 2 | 3 | 4;
  broadcast_id?: number;
  message: string;
  content_url?: string;
  status?: number;
  created_at?: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  error: string;
  message: string;
  code: number;
}

export interface LoginRequest {
  mobile_number: string;
  otp: string;
}

export interface LoginResponse {
  token: string;
  expires_at: string;
  karyakarta: Karyakarta;
  permissions: string[];
}

export interface OtpRequest {
  mobile_number: string;
}

export interface OtpResponse {
  message: string;
  expires_at: string;
}

export interface VoterSearchParams {
  page?: number;
  limit?: number;
  name?: string;
  epic_id?: string;
  district_id?: number;
  assembly_id?: number;
  ward_id?: number;
  polling_station_id?: number;
  status?: 'Active' | 'Inactive' | 'Deceased';
  gender?: 'Male' | 'Female' | 'Other';
  age_min?: number;
  age_max?: number;
  exact_match?: boolean;
  sort_by?: 'name' | 'age' | 'serial_no' | 'created_at';
  sort?: 'asc' | 'desc';
}

export interface AdvancedVoterSearchRequest {
  search_criteria?: {
    name?: {
      value: string;
      match_type?: 'exact' | 'partial' | 'fuzzy' | 'starts_with' | 'ends_with';
      case_sensitive?: boolean;
    };
    epic_ids?: string[];
    age_range?: {
      min?: number;
      max?: number;
    };
    date_range?: {
      field: 'created_at' | 'updated_at' | 'dob';
      from: string;
      to: string;
    };
    geographic_filter?: {
      district_ids?: number[];
      assembly_ids?: number[];
      ward_ids?: number[];
      polling_station_ids?: number[];
    };
    boolean_operator?: 'AND' | 'OR';
  };
  pagination?: {
    page?: number;
    limit?: number;
  };
  sorting?: {
    sort_by?: 'name' | 'age' | 'serial_no' | 'created_at' | 'relevance_score';
    sort_order?: 'asc' | 'desc';
  };
  options?: {
    include_inactive?: boolean;
    include_aggregations?: boolean;
    highlight_matches?: boolean;
  };
}

export interface DashboardAnalytics {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  total_voters: number;
  active_karyakartas: number;
  total_schemes: number;
  applications_by_status: Array<{
    status: string;
    count: number;
  }>;
  applications_by_district: Array<{
    district_name: string;
    count: number;
  }>;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function paginate<T>(items: T[], page = 1, limit = 10): ApiResponse<T[]> {
  const total = items.length;
  const total_pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: items.slice(start, end),
    meta: { page, per_page: limit, total, total_pages },
  };
}

const todayIso = new Date().toISOString();

const mockStates: OrganisationalState[] = [
  { id: 1, name: 'Kerala' },
  { id: 2, name: 'Karnataka' },
];

const mockDistricts: OrganisationalDistrict[] = [
  { id: 101, state_id: 1, name: 'Thiruvananthapuram' },
  { id: 102, state_id: 1, name: 'Kollam' },
  { id: 201, state_id: 2, name: 'Bengaluru Urban' },
];

const mockAssemblies: AssemblyConstituency[] = [
  { id: 1001, district_id: 101, name: 'Vattiyoorkavu' },
  { id: 1002, district_id: 101, name: 'Nemom' },
  { id: 2001, district_id: 201, name: 'Shanti Nagar' },
];

const mockLocalBodies: LocalBody[] = [
  { id: 5001, assembly_id: 1001, name: 'TVC Corporation' },
  { id: 5002, assembly_id: 1002, name: 'Nemom Panchayat' },
];

const mockWards: Ward[] = [
  { id: 7001, local_body_id: 5001, ward_number: 1, name: 'Museum' },
  { id: 7002, local_body_id: 5001, ward_number: 2, name: 'Vazhuthacaud' },
  { id: 7003, local_body_id: 5002, ward_number: 1, name: 'Nemom-1' },
];

const mockPollingStations: PollingStation[] = [
  { id: 9001, ward_id: 7001, name: 'Govt. School Museum', address: 'Museum Rd' },
  { id: 9002, ward_id: 7002, name: 'St. Marys School', address: 'VC Road' },
];

const mockSchemes: Scheme[] = [
  {
    id: 'S001',
    name: 'Student Scholarship',
    category: 'Education',
    min_age: 16,
    max_age: 25,
    status: 'Active',
    beneficiaries: 'Students',
    budget: 10000000,
    description: 'Scholarship for meritorious students',
    official_site: 'https://example.com/scholarship',
    created_at: todayIso,
    updated_at: todayIso,
  },
  {
    id: 'S002',
    name: 'Senior Citizen Pension',
    category: 'Welfare',
    min_age: 60,
    status: 'Active',
    beneficiaries: 'Elderly',
    budget: 5000000,
    description: 'Monthly pension for senior citizens',
    official_site: 'https://example.com/pension',
    created_at: todayIso,
    updated_at: todayIso,
  },
];

const mockVoters: Voter[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  serial_no: i + 100,
  name: `Voter ${i + 1}`,
  guardian_name: `Parent ${i + 1}`,
  house_name: `House ${i + 1}`,
  id_card_no: `EPIC${100000 + i}`,
  district_id: 101,
  assembly_id: i % 2 === 0 ? 1001 : 1002,
  local_body_id: 5001,
  ward_id: i % 3 === 0 ? 7001 : 7002,
  polling_station_id: i % 2 === 0 ? 9001 : 9002,
  gender: i % 2 === 0 ? 'Male' : 'Female',
  age: 18 + (i % 60),
  dob: '1990-01-01',
  address_line1: '123 Street',
  pincode: '695001',
  mobile_number: `99999${(10000 + i).toString().slice(-5)}`,
  status: 'Active',
  created_at: todayIso,
  updated_at: todayIso,
}));

const mockApplications: Application[] = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  helpdesk_id: `HD-${1000 + i}`,
  user_id: '42',
  name: `Applicant ${i + 1}`,
  voter_id: `${i + 1}`,
  aadhaar_number: `XXXX-XXXX-${(1000 + i).toString()}`,
  mobile_number: `88888${(10000 + i).toString().slice(-5)}`,
  email: `applicant${i + 1}@mail.com`,
  dob: '1992-02-02',
  gender: i % 2 === 0 ? 'Male' : 'Female',
  address_line1: '456 Avenue',
  district: 'Thiruvananthapuram',
  ward: i % 2 === 0 ? 'Museum' : 'Vazhuthacaud',
  pincode: '695002',
  occupation: 'Worker',
  marital_status: 'Single',
  income_range: '0-2L',
  benefited_scheme: i % 2 === 0 ? 'Student Scholarship' : 'Senior Citizen Pension',
  scheme_id: i % 2 === 0 ? 'S001' : 'S002',
  required_help: 'Document verification',
  status: i % 3 === 0 ? 'Approved' : i % 3 === 1 ? 'Pending' : 'In_Progress',
  created_at: todayIso,
  updated_at: todayIso,
  state_id: '1',
  district_id: '101',
  mandal_id: '1001',
  ward_id: '7001',
  sync_status: 'Synced',
  created_by: 1,
  updated_by: 1,
}));

const mockKaryakartas: Karyakarta[] = [
  { id: 1, name: 'Anil Kumar', mobile_number: '9999912345', role: 'Booth Worker', status: 'Active' },
  { id: 2, name: 'Divya Nair', mobile_number: '9999923456', role: 'Ward Coordinator', status: 'Active' },
];

const mockCommunications: Communication[] = [
  { id: 1, type: 6, category: 4, message: 'State-wide meeting on Friday', status: 1, created_at: todayIso },
  { id: 2, type: 3, category: 3, message: 'Ward 2: Voter data verification', status: 1, created_at: todayIso },
];

const mockDashboard: DashboardAnalytics = {
  total_applications: mockApplications.length,
  pending_applications: mockApplications.filter((a) => a.status === 'Pending').length,
  approved_applications: mockApplications.filter((a) => a.status === 'Approved').length,
  total_voters: mockVoters.length,
  active_karyakartas: mockKaryakartas.length,
  total_schemes: mockSchemes.length,
  applications_by_status: [
    { status: 'Pending', count: mockApplications.filter((a) => a.status === 'Pending').length },
    { status: 'In_Progress', count: mockApplications.filter((a) => a.status === 'In_Progress').length },
    { status: 'Approved', count: mockApplications.filter((a) => a.status === 'Approved').length },
  ],
  applications_by_district: [
    { district_name: 'Thiruvananthapuram', count: mockApplications.length },
  ],
};

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private useMock: boolean;

  constructor(useStaging = false, useMock = true) {
    this.baseUrl = useStaging ? API_CONFIG.stagingUrl : API_CONFIG.baseUrl;
    this.useMock = useMock;
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Failed to load token:', error);
    }
  }

  private async saveToken(token: string) {
    try {
      await AsyncStorage.setItem('auth_token', token);
      this.token = token;
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  private async clearToken() {
    try {
      await AsyncStorage.removeItem('auth_token');
      this.token = null;
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (this.useMock) {
      console.log(`[MOCK] ${options.method || 'GET'} ${endpoint}`);
      await delay(400);
      return this.mockRoute<T>(endpoint, options);
    }

    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: { ...this.getHeaders(), ...(options.headers ?? {}) },
    };
    console.log(`API Request: ${config.method || 'GET'} ${url}`);
    const response = await fetch(url, config);
    const data = (await response.json()) as T;
    if (!response.ok) {
      const error = data as unknown as ApiError;
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    return data;
  }

  private mockRoute<T>(endpoint: string, options: RequestInit): T {
    const method = (options.method ?? 'GET').toUpperCase();

    if (endpoint === '/auth/request-otp' && method === 'POST') {
      const res = { message: 'OTP sent', expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() } as OtpResponse;
      return res as unknown as T;
    }
    if (endpoint === '/auth/login' && method === 'POST') {
      const res = {
        token: 'mock-token-123',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        karyakarta: { id: 1, name: 'Mock User', mobile_number: '9999900000', role: 'Admin', status: 'Active' },
        permissions: ['read', 'write'],
      } as LoginResponse;
      return res as unknown as T;
    }

    if (endpoint.startsWith('/applications')) {
      if (method === 'GET') {
        const url = new URL(`https://mock${endpoint}`);
        const page = Number(url.searchParams.get('page') ?? '1');
        const limit = Number(url.searchParams.get('limit') ?? '10');
        const status = url.searchParams.get('status');
        const filtered = status ? mockApplications.filter((a) => a.status === (status as Application['status'])) : mockApplications;
        return paginate(filtered, page, limit) as unknown as T;
      }
      if (method === 'POST') {
        const body = options.body ? (JSON.parse(options.body as string) as Application) : ({} as Application);
        const nextId = (mockApplications[mockApplications.length - 1]?.id ?? 0) + 1;
        const created: Application = { ...body, id: nextId, created_at: todayIso, updated_at: todayIso };
        mockApplications.push(created);
        return created as unknown as T;
      }
      if (method === 'PUT') {
        const id = Number(endpoint.split('/').pop());
        const idx = mockApplications.findIndex((a) => a.id === id);
        const body = options.body ? (JSON.parse(options.body as string) as Application) : ({} as Application);
        if (idx >= 0) {
          mockApplications[idx] = { ...mockApplications[idx], ...body, updated_at: todayIso };
          return mockApplications[idx] as unknown as T;
        }
      }
      if (method === 'DELETE') {
        const id = Number(endpoint.split('/').pop());
        const idx = mockApplications.findIndex((a) => a.id === id);
        if (idx >= 0) mockApplications.splice(idx, 1);
        return undefined as unknown as T;
      }
      if (method === 'GET' && /\/applications\/(\d+)/.test(endpoint)) {
        const id = Number(endpoint.split('/').pop());
        const app = mockApplications.find((a) => a.id === id) as Application;
        return app as unknown as T;
      }
    }

    if (endpoint.startsWith('/voters')) {
      if (method === 'GET' && endpoint.startsWith('/voters/search')) {
        const url = new URL(`https://mock${endpoint}`);
        const name = url.searchParams.get('name') ?? '';
        const epic = url.searchParams.get('epic_id');
        const page = Number(url.searchParams.get('page') ?? '1');
        const limit = Number(url.searchParams.get('limit') ?? '10');
        let filtered = mockVoters;
        if (name) filtered = filtered.filter((v) => (v.name ?? '').toLowerCase().includes(name.toLowerCase()));
        if (epic) filtered = filtered.filter((v) => (v.id_card_no ?? '').includes(epic));
        return paginate(filtered, page, limit) as unknown as T;
      }
      if (method === 'POST' && endpoint === '/voters/search') {
        const body = options.body ? (JSON.parse(options.body as string) as AdvancedVoterSearchRequest) : ({} as AdvancedVoterSearchRequest);
        const page = body.pagination?.page ?? 1;
        const limit = body.pagination?.limit ?? 10;
        let filtered = mockVoters;
        const name = body.search_criteria?.name?.value;
        if (name) filtered = filtered.filter((v) => (v.name ?? '').toLowerCase().includes(name.toLowerCase()));
        const ageMin = body.search_criteria?.age_range?.min ?? 0;
        const ageMax = body.search_criteria?.age_range?.max ?? 200;
        filtered = filtered.filter((v) => (v.age ?? 0) >= ageMin && (v.age ?? 0) <= ageMax);
        return paginate(filtered, page, limit) as unknown as T;
      }
      if (method === 'GET' && /^\/voters\?(.*)/.test(endpoint)) {
        const url = new URL(`https://mock${endpoint}`);
        const page = Number(url.searchParams.get('page') ?? '1');
        const limit = Number(url.searchParams.get('limit') ?? '10');
        return paginate(mockVoters, page, limit) as unknown as T;
      }
      if (method === 'GET' && /\/voters\/(\d+)/.test(endpoint)) {
        const id = Number(endpoint.split('/').pop());
        const v = mockVoters.find((x) => x.id === id) as Voter;
        return v as unknown as T;
      }
      if (method === 'POST' && endpoint === '/voters') {
        const body = options.body ? (JSON.parse(options.body as string) as Voter) : ({} as Voter);
        const nextId = (mockVoters[mockVoters.length - 1]?.id ?? 0) + 1;
        const created: Voter = { ...body, id: nextId, created_at: todayIso, updated_at: todayIso };
        mockVoters.push(created);
        return created as unknown as T;
      }
      if (method === 'PUT' && /\/voters\/(\d+)/.test(endpoint)) {
        const id = Number(endpoint.split('/').pop());
        const idx = mockVoters.findIndex((v) => v.id === id);
        const body = options.body ? (JSON.parse(options.body as string) as Voter) : ({} as Voter);
        if (idx >= 0) {
          mockVoters[idx] = { ...mockVoters[idx], ...body, updated_at: todayIso };
          return mockVoters[idx] as unknown as T;
        }
      }
      if (method === 'DELETE' && /\/voters\/(\d+)/.test(endpoint)) {
        const id = Number(endpoint.split('/').pop());
        const idx = mockVoters.findIndex((v) => v.id === id);
        if (idx >= 0) mockVoters.splice(idx, 1);
        return undefined as unknown as T;
      }
    }

    if (endpoint.startsWith('/schemes')) {
      if (method === 'GET' && /^\/schemes(\?.*)?$/.test(endpoint)) {
        const url = new URL(`https://mock${endpoint}`);
        const page = Number(url.searchParams.get('page') ?? '1');
        const limit = Number(url.searchParams.get('limit') ?? '10');
        return paginate(mockSchemes, page, limit) as unknown as T;
      }
      if (method === 'GET' && /\/schemes\/.+/.test(endpoint)) {
        const id = endpoint.split('/').pop() as string;
        const s = mockSchemes.find((x) => x.id === id) as Scheme;
        return s as unknown as T;
      }
      if (method === 'POST' && endpoint === '/schemes') {
        const body = options.body ? (JSON.parse(options.body as string) as Scheme) : ({} as Scheme);
        const created: Scheme = { ...body, id: `S${Math.floor(Math.random() * 10000)}`, created_at: todayIso, updated_at: todayIso };
        mockSchemes.push(created);
        return created as unknown as T;
      }
      if (method === 'PUT' && /\/schemes\/.+/.test(endpoint)) {
        const id = endpoint.split('/').pop() as string;
        const idx = mockSchemes.findIndex((s) => s.id === id);
        const body = options.body ? (JSON.parse(options.body as string) as Scheme) : ({} as Scheme);
        if (idx >= 0) {
          mockSchemes[idx] = { ...mockSchemes[idx], ...body, updated_at: todayIso };
          return mockSchemes[idx] as unknown as T;
        }
      }
      if (method === 'DELETE' && /\/schemes\/.+/.test(endpoint)) {
        const id = endpoint.split('/').pop() as string;
        const idx = mockSchemes.findIndex((s) => s.id === id);
        if (idx >= 0) mockSchemes.splice(idx, 1);
        return undefined as unknown as T;
      }
    }

    if (endpoint.startsWith('/karyakartas') && method === 'GET') {
      const url = new URL(`https://mock${endpoint}`);
      const page = Number(url.searchParams.get('page') ?? '1');
      const limit = Number(url.searchParams.get('limit') ?? '10');
      return paginate(mockKaryakartas, page, limit) as unknown as T;
    }

    if (endpoint === '/states' && method === 'GET') return mockStates as unknown as T;
    if (endpoint.startsWith('/districts') && method === 'GET') {
      const url = new URL(`https://mock${endpoint}`);
      const stateId = Number(url.searchParams.get('state_id'));
      const list = Number.isNaN(stateId) ? mockDistricts : mockDistricts.filter((d) => d.state_id === stateId);
      return list as unknown as T;
    }
    if (endpoint.startsWith('/assemblies') && method === 'GET') {
      const url = new URL(`https://mock${endpoint}`);
      const districtId = Number(url.searchParams.get('district_id'));
      const list = Number.isNaN(districtId) ? mockAssemblies : mockAssemblies.filter((a) => a.district_id === districtId);
      return list as unknown as T;
    }
    if (endpoint.startsWith('/local-bodies') && method === 'GET') {
      const url = new URL(`https://mock${endpoint}`);
      const assemblyId = Number(url.searchParams.get('assembly_id'));
      const list = Number.isNaN(assemblyId) ? mockLocalBodies : mockLocalBodies.filter((l) => l.assembly_id === assemblyId);
      return list as unknown as T;
    }
    if (endpoint.startsWith('/wards') && method === 'GET') {
      const url = new URL(`https://mock${endpoint}`);
      const localBodyId = Number(url.searchParams.get('local_body_id'));
      const list = Number.isNaN(localBodyId) ? mockWards : mockWards.filter((w) => w.local_body_id === localBodyId);
      return list as unknown as T;
    }
    if (endpoint.startsWith('/polling-stations') && method === 'GET') {
      const url = new URL(`https://mock${endpoint}`);
      const wardId = Number(url.searchParams.get('ward_id'));
      const list = Number.isNaN(wardId) ? mockPollingStations : mockPollingStations.filter((p) => p.ward_id === wardId);
      return list as unknown as T;
    }

    if (endpoint.startsWith('/communications') && method === 'GET') {
      const url = new URL(`https://mock${endpoint}`);
      const page = Number(url.searchParams.get('page') ?? '1');
      const limit = Number(url.searchParams.get('limit') ?? '10');
      return paginate(mockCommunications, page, limit) as unknown as T;
    }

    if (endpoint.startsWith('/analytics/dashboard') && method === 'GET') {
      return mockDashboard as unknown as T;
    }

    if (endpoint.startsWith('/reports/applications') && method === 'GET') {
      const url = new URL(`https://mock${endpoint}`);
      const format = url.searchParams.get('format') ?? 'json';
      if (format === 'json') {
        return { data: mockApplications } as unknown as T;
      }
      if (format === 'csv') {
        const header = 'id,helpdesk_id,name,status';
        const rows = mockApplications.map((a) => `${a.id},${a.helpdesk_id},${a.name},${a.status}`).join('\n');
        return `${header}\n${rows}` as unknown as T;
      }
      return mockApplications as unknown as T;
    }

    throw new Error(`No mock implemented for ${method} ${endpoint}`);
  }

  async requestOtp(request: OtpRequest): Promise<OtpResponse> {
    return this.request<OtpResponse>('/auth/request-otp', { method: 'POST', body: JSON.stringify(request) });
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(request) });
    await this.saveToken(response.token);
    return response;
  }

  async logout(): Promise<void> { await this.clearToken(); }

  async getApplications(params?: { page?: number; limit?: number; status?: string; district_id?: string; }): Promise<ApiResponse<Application[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.district_id) searchParams.append('district_id', params.district_id);
    const query = searchParams.toString();
    return this.request<ApiResponse<Application[]>>(`/applications${query ? `?${query}` : ''}`);
  }

  async getApplication(id: number): Promise<Application> { return this.request<Application>(`/applications/${id}`); }

  async createApplication(application: Application): Promise<Application> { return this.request<Application>('/applications', { method: 'POST', body: JSON.stringify(application) }); }

  async updateApplication(id: number, application: Application): Promise<Application> { return this.request<Application>(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(application) }); }

  async deleteApplication(id: number): Promise<void> { await this.request<void>(`/applications/${id}`, { method: 'DELETE' }); }

  async getVoters(params?: { page?: number; limit?: number; district_id?: number; assembly_id?: number; ward_id?: number; status?: string; }): Promise<ApiResponse<Voter[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.district_id) searchParams.append('district_id', params.district_id.toString());
    if (params?.assembly_id) searchParams.append('assembly_id', params.assembly_id.toString());
    if (params?.ward_id) searchParams.append('ward_id', params.ward_id.toString());
    if (params?.status) searchParams.append('status', params.status);
    const query = searchParams.toString();
    return this.request<ApiResponse<Voter[]>>(`/voters${query ? `?${query}` : ''}`);
  }

  async searchVoters(params: VoterSearchParams): Promise<ApiResponse<Voter[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== null) searchParams.append(key, value.toString()); });
    const query = searchParams.toString();
    return this.request<ApiResponse<Voter[]>>(`/voters/search${query ? `?${query}` : ''}`);
  }

  async advancedVoterSearch(request: AdvancedVoterSearchRequest): Promise<ApiResponse<Voter[]>> { return this.request<ApiResponse<Voter[]>>('/voters/search', { method: 'POST', body: JSON.stringify(request) }); }

  async getVoter(id: number): Promise<Voter> { return this.request<Voter>(`/voters/${id}`); }

  async createVoter(voter: Voter): Promise<Voter> { return this.request<Voter>('/voters', { method: 'POST', body: JSON.stringify(voter) }); }

  async updateVoter(id: number, voter: Voter): Promise<Voter> { return this.request<Voter>(`/voters/${id}`, { method: 'PUT', body: JSON.stringify(voter) }); }

  async deleteVoter(id: number): Promise<void> { await this.request<void>(`/voters/${id}`, { method: 'DELETE' }); }

  async getSchemes(params?: { page?: number; limit?: number; status?: string; category?: string; }): Promise<ApiResponse<Scheme[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.category) searchParams.append('category', params.category);
    const query = searchParams.toString();
    return this.request<ApiResponse<Scheme[]>>(`/schemes${query ? `?${query}` : ''}`);
  }

  async getScheme(id: string): Promise<Scheme> { return this.request<Scheme>(`/schemes/${id}`); }

  async createScheme(scheme: Scheme): Promise<Scheme> { return this.request<Scheme>('/schemes', { method: 'POST', body: JSON.stringify(scheme) }); }

  async updateScheme(id: string, scheme: Scheme): Promise<Scheme> { return this.request<Scheme>(`/schemes/${id}`, { method: 'PUT', body: JSON.stringify(scheme) }); }

  async deleteScheme(id: string): Promise<void> { await this.request<void>(`/schemes/${id}`, { method: 'DELETE' }); }

  async getKaryakartas(params?: { page?: number; limit?: number; district_id?: number; assembly_id?: number; status?: string; role?: string; }): Promise<ApiResponse<Karyakarta[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.district_id) searchParams.append('district_id', params.district_id.toString());
    if (params?.assembly_id) searchParams.append('assembly_id', params.assembly_id.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.role) searchParams.append('role', params.role);
    const query = searchParams.toString();
    return this.request<ApiResponse<Karyakarta[]>>(`/karyakartas${query ? `?${query}` : ''}`);
  }

  async getStates(): Promise<OrganisationalState[]> { return this.request<OrganisationalState[]>('/states'); }

  async getDistricts(stateId?: number): Promise<OrganisationalDistrict[]> {
    const query = stateId ? `?state_id=${stateId}` : '';
    return this.request<OrganisationalDistrict[]>(`/districts${query}`);
  }

  async getAssemblies(districtId?: number): Promise<AssemblyConstituency[]> {
    const query = districtId ? `?district_id=${districtId}` : '';
    return this.request<AssemblyConstituency[]>(`/assemblies${query}`);
  }

  async getLocalBodies(assemblyId?: number): Promise<LocalBody[]> {
    const query = assemblyId ? `?assembly_id=${assemblyId}` : '';
    return this.request<LocalBody[]>(`/local-bodies${query}`);
  }

  async getWards(localBodyId?: number): Promise<Ward[]> {
    const query = localBodyId ? `?local_body_id=${localBodyId}` : '';
    return this.request<Ward[]>(`/wards${query}`);
  }

  async getPollingStations(wardId?: number): Promise<PollingStation[]> {
    const query = wardId ? `?ward_id=${wardId}` : '';
    return this.request<PollingStation[]>(`/polling-stations${query}`);
  }

  async getCommunications(params?: { page?: number; limit?: number; type?: number; category?: number; }): Promise<ApiResponse<Communication[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.type) searchParams.append('type', params.type.toString());
    if (params?.category) searchParams.append('category', params.category.toString());
    const query = searchParams.toString();
    return this.request<ApiResponse<Communication[]>>(`/communications${query ? `?${query}` : ''}`);
  }

  async getDashboardAnalytics(params?: { date_from?: string; date_to?: string; district_id?: number; }): Promise<DashboardAnalytics> {
    const searchParams = new URLSearchParams();
    if (params?.date_from) searchParams.append('date_from', params.date_from);
    if (params?.date_to) searchParams.append('date_to', params.date_to);
    if (params?.district_id) searchParams.append('district_id', params.district_id.toString());
    const query = searchParams.toString();
    return this.request<DashboardAnalytics>(`/analytics/dashboard${query ? `?${query}` : ''}`);
  }

  async getApplicationsReport(params?: { format?: 'json' | 'csv' | 'excel'; date_from?: string; date_to?: string; district_id?: number; status?: string; }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.format) searchParams.append('format', params.format);
    if (params?.date_from) searchParams.append('date_from', params.date_from);
    if (params?.date_to) searchParams.append('date_to', params.date_to);
    if (params?.district_id) searchParams.append('district_id', params.district_id.toString());
    if (params?.status) searchParams.append('status', params.status);
    const query = searchParams.toString();
    return this.request<any>(`/reports/applications${query ? `?${query}` : ''}`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;