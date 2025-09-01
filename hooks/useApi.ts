import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, {
  Application,
  Voter,
  Scheme,
  VoterSearchParams,
  AdvancedVoterSearchRequest,
  LoginRequest,
  OtpRequest,
} from '@/lib/api-client';

// Authentication hooks
export const useRequestOtp = () => {
  return useMutation({
    mutationFn: (request: OtpRequest) => apiClient.requestOtp(request),
    onError: (error) => {
      console.error('OTP request failed:', error);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: LoginRequest) => apiClient.login(request),
    onSuccess: (data) => {
      console.log('Login successful:', (data as any).karyakarta.name);
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      console.log('Logout successful');
      // Clear all cached data
      queryClient.clear();
    },
  });
};

// Applications hooks
export const useApplications = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  district_id?: string;
}) => {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => apiClient.getApplications(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useApplication = (id: number) => {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => apiClient.getApplication(id),
    enabled: !!id,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (application: Application) => apiClient.createApplication(application),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => {
      console.error('Create application failed:', error);
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, application }: { id: number; application: Application }) =>
      apiClient.updateApplication(id, application),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.setQueryData(['applications', variables.id], data);
    },
    onError: (error) => {
      console.error('Update application failed:', error);
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => {
      console.error('Delete application failed:', error);
    },
  });
};

// Voters hooks
export const useVoters = (params?: {
  page?: number;
  limit?: number;
  district_id?: number;
  assembly_id?: number;
  ward_id?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['voters', params],
    queryFn: () => apiClient.getVoters(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useVoterSearch = (params: VoterSearchParams) => {
  return useQuery({
    queryKey: ['voters', 'search', params],
    queryFn: () => apiClient.searchVoters(params),
    enabled: !!(params.name || params.epic_id), // Only search if name or epic_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdvancedVoterSearch = () => {
  return useMutation({
    mutationFn: (request: AdvancedVoterSearchRequest) => apiClient.advancedVoterSearch(request),
    onError: (error) => {
      console.error('Advanced voter search failed:', error);
    },
  });
};

export const useVoter = (id: number) => {
  return useQuery({
    queryKey: ['voters', id],
    queryFn: () => apiClient.getVoter(id),
    enabled: !!id,
  });
};

export const useCreateVoter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (voter: Voter) => apiClient.createVoter(voter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voters'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => {
      console.error('Create voter failed:', error);
    },
  });
};

export const useUpdateVoter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, voter }: { id: number; voter: Voter }) =>
      apiClient.updateVoter(id, voter),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['voters'] });
      queryClient.setQueryData(['voters', variables.id], data);
    },
    onError: (error) => {
      console.error('Update voter failed:', error);
    },
  });
};

export const useDeleteVoter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.deleteVoter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voters'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => {
      console.error('Delete voter failed:', error);
    },
  });
};

// Schemes hooks
export const useSchemes = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}) => {
  return useQuery({
    queryKey: ['schemes', params],
    queryFn: () => apiClient.getSchemes(params),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useScheme = (id: string) => {
  return useQuery({
    queryKey: ['schemes', id],
    queryFn: () => apiClient.getScheme(id),
    enabled: !!id,
  });
};

export const useCreateScheme = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (scheme: Scheme) => apiClient.createScheme(scheme),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
    },
    onError: (error) => {
      console.error('Create scheme failed:', error);
    },
  });
};

export const useUpdateScheme = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, scheme }: { id: string; scheme: Scheme }) =>
      apiClient.updateScheme(id, scheme),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
      queryClient.setQueryData(['schemes', variables.id], data);
    },
    onError: (error) => {
      console.error('Update scheme failed:', error);
    },
  });
};

export const useDeleteScheme = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteScheme(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
    },
    onError: (error) => {
      console.error('Delete scheme failed:', error);
    },
  });
};

// Karyakartas hooks
export const useKaryakartas = (params?: {
  page?: number;
  limit?: number;
  district_id?: number;
  assembly_id?: number;
  status?: string;
  role?: string;
}) => {
  return useQuery({
    queryKey: ['karyakartas', params],
    queryFn: () => apiClient.getKaryakartas(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Organizational Structure hooks
export const useStates = () => {
  return useQuery({
    queryKey: ['states'],
    queryFn: () => apiClient.getStates(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useDistricts = (stateId?: number) => {
  return useQuery({
    queryKey: ['districts', stateId],
    queryFn: () => apiClient.getDistricts(stateId),
    enabled: !!stateId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useAssemblies = (districtId?: number) => {
  return useQuery({
    queryKey: ['assemblies', districtId],
    queryFn: () => apiClient.getAssemblies(districtId),
    enabled: !!districtId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useLocalBodies = (assemblyId?: number) => {
  return useQuery({
    queryKey: ['localBodies', assemblyId],
    queryFn: () => apiClient.getLocalBodies(assemblyId),
    enabled: !!assemblyId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useWards = (localBodyId?: number) => {
  return useQuery({
    queryKey: ['wards', localBodyId],
    queryFn: () => apiClient.getWards(localBodyId),
    enabled: !!localBodyId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const usePollingStations = (wardId?: number) => {
  return useQuery({
    queryKey: ['pollingStations', wardId],
    queryFn: () => apiClient.getPollingStations(wardId),
    enabled: !!wardId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Analytics hooks
export const useDashboardAnalytics = (params?: {
  date_from?: string;
  date_to?: string;
  district_id?: number;
}) => {
  return useQuery({
    queryKey: ['dashboard', 'analytics', params],
    queryFn: () => apiClient.getDashboardAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Communications hooks
export const useCommunications = (params?: {
  page?: number;
  limit?: number;
  type?: number;
  category?: number;
}) => {
  return useQuery({
    queryKey: ['communications', params],
    queryFn: () => apiClient.getCommunications(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Reports hooks
export const useApplicationsReport = () => {
  return useMutation({
    mutationFn: (params?: {
      format?: 'json' | 'csv' | 'excel';
      date_from?: string;
      date_to?: string;
      district_id?: number;
      status?: string;
    }) => apiClient.getApplicationsReport(params),
    onError: (error) => {
      console.error('Applications report failed:', error);
    },
  });
};