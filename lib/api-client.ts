import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_CONFIG = {
  baseUrl: 'https://pdms.tayana.in/v1',
  stagingUrl: 'https://staging.pdms.tayana.in/v1',
  timeout: 30000,
};

// Types based on OpenAPI specification
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
  type: 1 | 2 | 3 | 4 | 5 | 6; // 1: Individual, 2: Booth, 3: Ward, 4: Local Body, 5: District, 6: State
  category: 1 | 2 | 3 | 4; // 1: Application, 2: Scheme, 3: Voter, 4: General
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

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(useStaging = false) {
    this.baseUrl = useStaging ? API_CONFIG.stagingUrl : API_CONFIG.baseUrl;
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    console.log(`API Request: ${config.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = data;
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      console.log(`API Response: ${response.status}`);
      return data;
    } catch (error) {
      console.error(`API Error: ${error}`);
      throw error;
    }
  }

  // Authentication
  async requestOtp(request: OtpRequest): Promise<OtpResponse> {
    return this.request<OtpResponse>('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    await this.saveToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.clearToken();
  }

  // Applications
  async getApplications(params?: {
    page?: number;
    limit?: number;
    status?: string;
    district_id?: string;
  }): Promise<ApiResponse<Application[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.district_id) searchParams.append('district_id', params.district_id);

    const query = searchParams.toString();
    return this.request<ApiResponse<Application[]>>(
      `/applications${query ? `?${query}` : ''}`
    );
  }

  async getApplication(id: number): Promise<Application> {
    return this.request<Application>(`/applications/${id}`);
  }

  async createApplication(application: Application): Promise<Application> {
    return this.request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(application),
    });
  }

  async updateApplication(id: number, application: Application): Promise<Application> {
    return this.request<Application>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(application),
    });
  }

  async deleteApplication(id: number): Promise<void> {
    await this.request<void>(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  // Voters
  async getVoters(params?: {
    page?: number;
    limit?: number;
    district_id?: number;
    assembly_id?: number;
    ward_id?: number;
    status?: string;
  }): Promise<ApiResponse<Voter[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.district_id) searchParams.append('district_id', params.district_id.toString());
    if (params?.assembly_id) searchParams.append('assembly_id', params.assembly_id.toString());
    if (params?.ward_id) searchParams.append('ward_id', params.ward_id.toString());
    if (params?.status) searchParams.append('status', params.status);

    const query = searchParams.toString();
    return this.request<ApiResponse<Voter[]>>(
      `/voters${query ? `?${query}` : ''}`
    );
  }

  async searchVoters(params: VoterSearchParams): Promise<ApiResponse<Voter[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const query = searchParams.toString();
    return this.request<ApiResponse<Voter[]>>(
      `/voters/search${query ? `?${query}` : ''}`
    );
  }

  async advancedVoterSearch(request: AdvancedVoterSearchRequest): Promise<ApiResponse<Voter[]>> {
    return this.request<ApiResponse<Voter[]>>('/voters/search', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getVoter(id: number): Promise<Voter> {
    return this.request<Voter>(`/voters/${id}`);
  }

  async createVoter(voter: Voter): Promise<Voter> {
    return this.request<Voter>('/voters', {
      method: 'POST',
      body: JSON.stringify(voter),
    });
  }

  async updateVoter(id: number, voter: Voter): Promise<Voter> {
    return this.request<Voter>(`/voters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(voter),
    });
  }

  async deleteVoter(id: number): Promise<void> {
    await this.request<void>(`/voters/${id}`, {
      method: 'DELETE',
    });
  }

  // Schemes
  async getSchemes(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }): Promise<ApiResponse<Scheme[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.category) searchParams.append('category', params.category);

    const query = searchParams.toString();
    return this.request<ApiResponse<Scheme[]>>(
      `/schemes${query ? `?${query}` : ''}`
    );
  }

  async getScheme(id: string): Promise<Scheme> {
    return this.request<Scheme>(`/schemes/${id}`);
  }

  async createScheme(scheme: Scheme): Promise<Scheme> {
    return this.request<Scheme>('/schemes', {
      method: 'POST',
      body: JSON.stringify(scheme),
    });
  }

  async updateScheme(id: string, scheme: Scheme): Promise<Scheme> {
    return this.request<Scheme>(`/schemes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scheme),
    });
  }

  async deleteScheme(id: string): Promise<void> {
    await this.request<void>(`/schemes/${id}`, {
      method: 'DELETE',
    });
  }

  // Karyakartas
  async getKaryakartas(params?: {
    page?: number;
    limit?: number;
    district_id?: number;
    assembly_id?: number;
    status?: string;
    role?: string;
  }): Promise<ApiResponse<Karyakarta[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.district_id) searchParams.append('district_id', params.district_id.toString());
    if (params?.assembly_id) searchParams.append('assembly_id', params.assembly_id.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.role) searchParams.append('role', params.role);

    const query = searchParams.toString();
    return this.request<ApiResponse<Karyakarta[]>>(
      `/karyakartas${query ? `?${query}` : ''}`
    );
  }

  // Organizational Structure
  async getStates(): Promise<OrganisationalState[]> {
    return this.request<OrganisationalState[]>('/states');
  }

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

  // Communications
  async getCommunications(params?: {
    page?: number;
    limit?: number;
    type?: number;
    category?: number;
  }): Promise<ApiResponse<Communication[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.type) searchParams.append('type', params.type.toString());
    if (params?.category) searchParams.append('category', params.category.toString());

    const query = searchParams.toString();
    return this.request<ApiResponse<Communication[]>>(
      `/communications${query ? `?${query}` : ''}`
    );
  }

  // Analytics
  async getDashboardAnalytics(params?: {
    date_from?: string;
    date_to?: string;
    district_id?: number;
  }): Promise<DashboardAnalytics> {
    const searchParams = new URLSearchParams();
    if (params?.date_from) searchParams.append('date_from', params.date_from);
    if (params?.date_to) searchParams.append('date_to', params.date_to);
    if (params?.district_id) searchParams.append('district_id', params.district_id.toString());

    const query = searchParams.toString();
    return this.request<DashboardAnalytics>(
      `/analytics/dashboard${query ? `?${query}` : ''}`
    );
  }

  // Reports
  async getApplicationsReport(params?: {
    format?: 'json' | 'csv' | 'excel';
    date_from?: string;
    date_to?: string;
    district_id?: number;
    status?: string;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.format) searchParams.append('format', params.format);
    if (params?.date_from) searchParams.append('date_from', params.date_from);
    if (params?.date_to) searchParams.append('date_to', params.date_to);
    if (params?.district_id) searchParams.append('district_id', params.district_id.toString());
    if (params?.status) searchParams.append('status', params.status);

    const query = searchParams.toString();
    return this.request<any>(
      `/reports/applications${query ? `?${query}` : ''}`
    );
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
export default apiClient;