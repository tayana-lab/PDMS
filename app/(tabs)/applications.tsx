import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import schemeData from '../SchemeDetails.json';
import applicationData from '../ApplicationDetails.json';

interface GovernmentScheme {
  id: string;
  name: string;
  category: string;
  description: string;
  beneficiaries: string;
  budget: number;
  status: string;
  min_age: number;
  max_age: number;
  gender: string;
}

interface MyApplication {
  id: string;
  user_id: string;
  name: string;
  voter_id: string;
  aadhaar_number: string;
  mobile_number: string;
  email: string;
  dob: string;
  gender: string;
  religion: string;
  caste: string;
  address_line1: string;
  address_line2: string;
  district: string;
  assembly_mandalam: string;
  panchayat: string | null;
  municipalitie: string | null;
  corporation: string | null;
  ward: string;
  pincode: string;
  occupation: string;
  marital_status: string;
  income_range: string;
  benefited_scheme: string;
  scheme_id: string;
  scheme_details: string;
  required_help: string;
  documents: string[];
  status: string;
  created_at: string;
  updated_at: string;
  state_id: string;
  district_id: string;
  mandal_id: string;
  ward_id: string;
  panchayath_id: string | null;
  municipalitie_id: string | null;
  corporation_id: string | null;
  application_id: string;
}

export default function ApplicationsScreen() {
  const [selectedTab, setSelectedTab] = useState<'schemes' | 'myApplications'>('myApplications');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [voterIdInput, setVoterIdInput] = useState<string>('');
  const [showVoterIdModal, setShowVoterIdModal] = useState<boolean>(false);
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const { colors, t } = useAppSettings();

  const filteredSchemes = useMemo(() => {
    let schemes = schemeData.items;
    
    if (filterCategory !== 'ALL') {
      schemes = schemes.filter(scheme => scheme.category === filterCategory);
    }
    
    if (searchQuery.trim()) {
      schemes = schemes.filter(scheme => 
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return schemes;
  }, [filterCategory, searchQuery]);

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

  const handleApplyScheme = (scheme: GovernmentScheme) => {
    setSelectedScheme(scheme);
    setShowVoterIdModal(true);
  };

  const handleVoterIdSubmit = () => {
    if (!voterIdInput.trim()) {
      Alert.alert(t('error'), 'Please enter a valid Voter ID');
      return;
    }
    
    console.log('Applying for scheme:', selectedScheme?.name);
    console.log('Voter ID:', voterIdInput);
    
    Alert.alert(
      t('applicationSubmitted'),
      `${t('applicationSubmittedMessage')}\n\nApplication will be processed with voter details for ID: ${voterIdInput}`,
      [
        {
          text: t('ok'),
          onPress: () => {
            setShowVoterIdModal(false);
            setVoterIdInput('');
            setSelectedScheme(null);
          }
        }
      ]
    );
  };

  const renderSchemeItem = ({ item }: { item: GovernmentScheme }) => {
    const cleanDescription = item.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
    
    return (
      <Card style={styles.schemeCard}>
        <View style={styles.schemeHeader}>
          <View style={styles.schemeInfo}>
            <Text style={[styles.schemeName, { color: colors.text.primary }]}>{item.name}</Text>
            <Text style={[styles.schemeCategory, { color: colors.primary }]}>{item.category}</Text>
          </View>
          <Text style={[styles.schemeBudget, { color: colors.secondary }]}>₹{item.budget.toLocaleString()}</Text>
        </View>
        
        <Text style={[styles.schemeDescription, { color: colors.text.secondary }]} numberOfLines={3}>
          {cleanDescription}
        </Text>
        
        <Text style={[styles.schemeBeneficiaries, { color: colors.text.secondary }]} numberOfLines={2}>
          <Text style={[styles.beneficiariesLabel, { color: colors.text.primary }]}>{t('beneficiaries')}: </Text>
          {item.beneficiaries}
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

  const renderMyApplicationItem = ({ item }: { item: MyApplication }) => (
    <Card style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <View style={styles.applicationInfo}>
          <Text style={[styles.applicantName, { color: colors.text.primary }]}>{item.name}</Text>
          <Text style={[styles.applicationId, { color: colors.text.secondary }]}>ID: {item.application_id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          {getStatusIcon(item.status)}
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.applicationDetails}>
        <Text style={[styles.detailText, { color: colors.text.secondary }]}>{t('mobile')}: {item.mobile_number}</Text>
        <Text style={[styles.detailText, { color: colors.text.secondary }]}>{t('helpRequired')}: {item.required_help}</Text>
        <Text style={[styles.detailText, { color: colors.text.secondary }]}>
          {t('submitted')}: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.viewDetailsButton}>
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
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>
      
      <View style={styles.content}>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
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
      </View>

      {/* Schemes Tab */}
      {selectedTab === 'schemes' && (
        <View style={styles.tabContent}>
          {/* Search and Filter */}
          <View style={styles.searchFilterContainer}>
            <Input
              placeholder={t('searchSchemes')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
            
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
          
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {t('availableSchemes')} ({filteredSchemes.length})
          </Text>
          
          <FlatList
            data={filteredSchemes}
            renderItem={renderSchemeItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FileText size={48} color={colors.text.light} />
                <Text style={[styles.emptyText, { color: colors.text.light }]}>{t('noSchemesFound')}</Text>
              </View>
            }
          />
        </View>
      )}

      {/* My Applications Tab */}
      {selectedTab === 'myApplications' && (
        <View style={styles.tabContent}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {t('myApplications')} ({applicationData.total_count})
          </Text>
          
          <FlatList
            data={applicationData.applications}
            renderItem={renderMyApplicationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FileText size={48} color={colors.text.light} />
                <Text style={[styles.emptyText, { color: colors.text.light }]}>{t('noApplicationsFound')}</Text>
              </View>
            }
          />
        </View>
      )}

      {/* Voter ID Input Modal */}
      {showVoterIdModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>{t('enterVoterId')}</Text>
            <Text style={[styles.modalSubtitle, { color: colors.text.secondary }]}>
              {t('applyingFor')}: {selectedScheme?.name}
            </Text>
            
            <Input
              placeholder={t('enterYourVoterId')}
              value={voterIdInput}
              onChangeText={setVoterIdInput}
              style={styles.voterIdInput}
              autoCapitalize="characters"
            />
            
            <View style={styles.modalButtons}>
              <Button
                title={t('cancel')}
                onPress={() => {
                  setShowVoterIdModal(false);
                  setVoterIdInput('');
                  setSelectedScheme(null);
                }}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title={t('submit')}
                onPress={handleVoterIdSubmit}
                style={styles.modalButton}
              />
            </View>
          </View>
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
  searchInput: {
    marginBottom: Spacing.md,
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
    marginBottom: Spacing.md,
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    width: '90%',
    ...Shadows.large,
  },
  modalTitle: {
    ...Typography.title,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  voterIdInput: {
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});