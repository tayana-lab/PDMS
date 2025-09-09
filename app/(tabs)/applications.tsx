import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FileText, Clock, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react-native';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useApplications, useSchemes } from '@/hooks/useApi';
import { Application, Scheme } from '@/lib/api-client';



export default function ApplicationsScreen() {
  const [selectedTab, setSelectedTab] = useState<'schemes' | 'myApplications'>('myApplications');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page] = useState<number>(1);

  const { colors, t } = useAppSettings();

  // API hooks
  const applicationsQuery = useApplications({ page, limit: 20 });
  const schemesQuery = useSchemes({ page, limit: 50 });

  // Handle different possible API response structures
  const applications = useMemo(() => {
    const data = applicationsQuery.data;
    if (!data) return [];
    
    // Try different possible structures
    if (Array.isArray(data)) return data as Application[]; // Direct array
    if (data.data && Array.isArray(data.data)) return data.data; // Wrapped in data property
    if ((data as any).applications && Array.isArray((data as any).applications)) return (data as any).applications; // applications property
    
    console.warn('⚠️ Unexpected applications data structure:', data);
    return [];
  }, [applicationsQuery.data]);
  
  const schemes = useMemo(() => {
    const data = schemesQuery.data;
    if (!data) return [];
    
    // Try different possible structures
    if (Array.isArray(data)) return data as Scheme[]; // Direct array
    if (data.data && Array.isArray(data.data)) return data.data; // Wrapped in data property
    if ((data as any).schemes && Array.isArray((data as any).schemes)) return (data as any).schemes; // schemes property
    
    console.warn('⚠️ Unexpected schemes data structure:', data);
    return [];
  }, [schemesQuery.data]);
  
  const applicationsTotal = applicationsQuery.data?.meta?.total || (applicationsQuery.data as any)?.total || applications.length;
  const schemesTotal = schemesQuery.data?.meta?.total || (schemesQuery.data as any)?.total || schemes.length;

  // Debug logging
  console.log('🔍 Applications Query Status:', {
    isLoading: applicationsQuery.isLoading,
    isError: applicationsQuery.isError,
    error: applicationsQuery.error?.message,
    dataLength: applications.length,
    rawData: applicationsQuery.data,
    dataStructure: applicationsQuery.data ? Object.keys(applicationsQuery.data) : 'No data'
  });
  
  console.log('🔍 Schemes Query Status:', {
    isLoading: schemesQuery.isLoading,
    isError: schemesQuery.isError,
    error: schemesQuery.error?.message,
    dataLength: schemes.length,
    rawData: schemesQuery.data,
    dataStructure: schemesQuery.data ? Object.keys(schemesQuery.data) : 'No data'
  });
  
  // Log first few items to understand structure
  if (applications.length > 0) {
    console.log('📋 First Application:', applications[0]);
  }
  if (schemes.length > 0) {
    console.log('📋 First Scheme:', schemes[0]);
  }

  const filteredSchemes = useMemo(() => {
    let filteredSchemes = schemes;
    
    if (filterCategory !== 'ALL') {
      filteredSchemes = filteredSchemes.filter((scheme: Scheme) => scheme.category === filterCategory);
    }
    
    if (searchQuery.trim()) {
      filteredSchemes = filteredSchemes.filter((scheme: Scheme) => 
        scheme.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filteredSchemes;
  }, [schemes, filterCategory, searchQuery]);

  const filteredApplications = useMemo(() => {
    if (searchQuery.trim()) {
      return applications.filter((app: Application) => 
        app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.helpdesk_id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return applications;
  }, [applications, searchQuery]);

  const categories = ['ALL', 'EMPLOYMENT', 'AGRICULTURE', 'HEALTH', 'EDUCATION', 'SOCIAL_WELFARE'];

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Clock size={16} color={colors.warning} />;
      case 'APPROVED':
        return <CheckCircle size={16} color={colors.success} />;
      case 'REJECTED':
        return <XCircle size={16} color={colors.error} />;
      default:
        return <FileText size={16} color={colors.text.secondary} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return colors.warning;
      case 'APPROVED':
        return colors.success;
      case 'REJECTED':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  const handleApplyScheme = (scheme: Scheme) => {
    console.log('Navigating to apply scheme for:', scheme.name);
    router.push(`/apply-scheme?schemeId=${scheme.id}`);
  };

  const handleRefresh = () => {
    if (selectedTab === 'schemes') {
      schemesQuery.refetch();
    } else {
      applicationsQuery.refetch();
    }
  };



  const renderSchemeItem = ({ item }: { item: Scheme }) => {
    const cleanDescription = item.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || 'No description available';
    
    return (
      <Card style={styles.schemeCard}>
        <View style={styles.schemeHeader}>
          <View style={styles.schemeInfo}>
            <Text style={[styles.schemeName, { color: colors.text.primary }]}>{item.name}</Text>
            <Text style={[styles.schemeCategory, { color: colors.primary }]}>{item.category}</Text>
          </View>
          <Text style={[styles.schemeBudget, { color: colors.secondary }]}>₹{item.budget?.toLocaleString() || '0'}</Text>
        </View>
        
        <Text style={[styles.schemeDescription, { color: colors.text.secondary }]} numberOfLines={3}>
          {cleanDescription}
        </Text>
        
        <Text style={[styles.schemeBeneficiaries, { color: colors.text.secondary }]} numberOfLines={2}>
          <Text style={[styles.beneficiariesLabel, { color: colors.text.primary }]}>{t('beneficiaries')}: </Text>
          {item.beneficiaries || 'Not specified'}
        </Text>
        
        <Button
          title={t('apply')}
          onPress={() => handleApplyScheme(item)}
          variant="primary"
          size="small"
          style={styles.applyButton}
        />
      </Card>
    );
  };

  const renderMyApplicationItem = ({ item }: { item: Application }) => (
    <Card style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <View style={styles.applicationInfo}>
          <Text style={[styles.applicantName, { color: colors.text.primary }]}>{item.name}</Text>
          <Text style={[styles.applicationId, { color: colors.text.secondary }]}>ID: {item.helpdesk_id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status || 'Pending') + '20' }]}>
          {getStatusIcon(item.status || 'Pending')}
          <Text style={[styles.statusText, { color: getStatusColor(item.status || 'Pending') }]}>
            {item.status || 'Pending'}
          </Text>
        </View>
      </View>
      
      <View style={styles.applicationDetails}>
        <Text style={[styles.detailText, { color: colors.text.secondary }]}>{t('mobile')}: {item.mobile_number}</Text>
        <Text style={[styles.detailText, { color: colors.text.secondary }]}>{t('helpRequired')}: {item.required_help}</Text>
        <Text style={[styles.detailText, { color: colors.text.secondary }]}>
          {t('submitted')}: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.viewDetailsButton}
        onPress={() => {
          console.log('Navigating to application details for:', item.helpdesk_id);
          router.push(`/application-details?applicationId=${item.helpdesk_id}`);
        }}
      >
        <Text style={[styles.viewDetailsText, { color: colors.primary }]}>{t('viewDetails')}</Text>
      </TouchableOpacity>
    </Card>
  );

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor={colors.primary} 
        barStyle="light-content" 
        translucent={false}
      />
      
      {/* Custom Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>{t('applicationsTitle')}</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <RefreshCw 
              size={20} 
              color={colors.text.white} 
              style={[
                styles.refreshIcon,
                (applicationsQuery.isFetching || schemesQuery.isFetching) && styles.refreshIconRotated
              ]} 
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      <View style={styles.content}>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
      
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'myApplications' && styles.activeTab
          ]}
          onPress={() => setSelectedTab('myApplications')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'myApplications' && styles.activeTabText
          ]}>
            {t('myApplications')}
          </Text>
        </TouchableOpacity>

          <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'schemes' && styles.activeTab
          ]}
          onPress={() => setSelectedTab('schemes')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'schemes' && styles.activeTabText
          ]}>
            {t('schemes')}
          </Text>
        </TouchableOpacity>
        
      </View>

      {/* Schemes Tab */}
      {selectedTab === 'schemes' && (
        <View style={styles.tabContent}>
          {/* Search and Filter */}
          <View style={styles.searchFilterContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={colors.text.light} style={styles.searchIcon} />
              <TextInput
                placeholder={t('searchSchemes')}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                placeholderTextColor={colors.text.light}
                returnKeyType="search"
              />
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    filterCategory === category && styles.activeFilterChip
                  ]}
                  onPress={() => setFilterCategory(category)}
                >
                  <Text style={[
                    styles.filterChipText,
                    filterCategory === category && styles.activeFilterChipText
                  ]}>
                    {category.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {t('availableSchemes')} ({filteredSchemes.length})
            </Text>
            {schemesQuery.isFetching && (
              <RefreshCw size={16} color={colors.text.secondary} style={styles.refreshIconRotated} />
            )}
          </View>
          
          <FlatList
            data={filteredSchemes}
            renderItem={renderSchemeItem}
            keyExtractor={(item) => item.id || Math.random().toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshing={schemesQuery.isFetching}
            onRefresh={() => schemesQuery.refetch()}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FileText size={48} color={colors.text.light} />
                <Text style={[styles.emptyText, { color: colors.text.light }]}>
                  {schemesQuery.isLoading ? 'Loading schemes...' : 
                   schemesQuery.isError ? 'Error loading schemes' : 
                   t('noSchemesFound')}
                </Text>
              </View>
            }
          />
        </View>
      )}

      {/* My Applications Tab */}
      {selectedTab === 'myApplications' && (
        <View style={styles.tabContent}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {t('myApplications')} ({applicationsTotal})
            </Text>
            {applicationsQuery.isFetching && (
              <RefreshCw size={16} color={colors.text.secondary} style={styles.refreshIconRotated} />
            )}
          </View>
          
          <FlatList
            data={filteredApplications}
            renderItem={renderMyApplicationItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshing={applicationsQuery.isFetching}
            onRefresh={() => applicationsQuery.refetch()}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FileText size={48} color={colors.text.light} />
                <Text style={[styles.emptyText, { color: colors.text.light }]}>
                  {applicationsQuery.isLoading ? 'Loading applications...' : 
                   applicationsQuery.isError ? 'Error loading applications' : 
                   t('noApplicationsFound')}
                </Text>
              </View>
            }
          />
        </View>
      )}


      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },
  headerSpacer: {
    width: 32,
  },
  refreshButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.title,
    color: colors.text.white,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...Typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.text.white,
  },
  tabContent: {
    flex: 1,
    padding: Spacing.md,
  },
  searchFilterContainer: {
    marginBottom: Spacing.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 50,
    height: 50,
    textAlignVertical: 'center',
  },
  filterContainer: {
    marginBottom: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...Typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: colors.text.white,
  },
  sectionTitle: {
    ...Typography.subtitle,
  },
  listContainer: {
    paddingBottom: Spacing.xl,
  },
  schemeCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  schemeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  schemeInfo: {
    flex: 1,
  },
  schemeName: {
    ...Typography.subtitle,
    marginBottom: Spacing.xs,
  },
  schemeCategory: {
    ...Typography.caption,
    fontWeight: '600',
  },
  schemeBudget: {
    ...Typography.body,
    fontWeight: '700',
  },
  schemeDescription: {
    ...Typography.body,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  schemeBeneficiaries: {
    ...Typography.caption,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  beneficiariesLabel: {
    fontWeight: '600',
  },
  applyButton: {
    alignSelf: 'flex-start',
  },
  applicationCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  applicationInfo: {
    flex: 1,
  },
  applicantName: {
    ...Typography.subtitle,
    marginBottom: Spacing.xs,
  },
  applicationId: {
    ...Typography.caption,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  applicationDetails: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  detailText: {
    ...Typography.caption,
  },
  viewDetailsButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  viewDetailsText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing.md
  },
  refreshIcon: {
    // Default state
  },
  refreshIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
});