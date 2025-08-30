import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
import applicationData from './ApplicationDetails.json';
import schemeData from './SchemeDetails.json';
import { mockVoters } from '@/constants/mockData';

interface HelpDeskApplication {
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

interface GovernmentScheme {
  id: string;
  name: string;
  category: string;
  description: string;
  beneficiaries: string;
  budget: number;
  status: string;
}

export default function HelpDeskScreen() {
  const { voterId } = useLocalSearchParams();
  const { colors } = useAppSettings();

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Find voter information
  const voter = mockVoters.find(v => v.voterId === voterId);
  
  // Filter applications for this voter, with dummy fallback when empty
  const voterApplications = useMemo<HelpDeskApplication[]>(() => {
    try {
      const apps: HelpDeskApplication[] = (applicationData?.applications ?? []).filter(
        (app: any) => app?.voter_id === voterId
      );

      if (apps.length > 0) {
        console.log('HelpDesk: Found existing applications for voter', voterId, apps.length);
        return apps as HelpDeskApplication[];
      }

      const voterIdStr = String(voterId ?? 'VOTER-DEMO');
      const baseNow = Date.now();
      const pickScheme = (index: number) => {
        const list = schemeData?.items ?? [];
        if (list.length === 0) return undefined;
        return list[index % list.length];
      };

      const dummy: HelpDeskApplication[] = Array.from({ length: 3 }).map((_, i) => {
        const scheme = pickScheme(i);
        const created = new Date(baseNow - i * 1000 * 60 * 60 * 24).toISOString();
        const statusPool = ['PENDING', 'APPROVED', 'REJECTED'] as const;
        const status = statusPool[i % statusPool.length];
        const id = `demo-${voterIdStr}-${i + 1}`;
        const appId = `APP/${voterIdStr}/${String(i + 1).padStart(3, '0')}`;
        return {
          id,
          user_id: 'demo-user',
          name: voter?.name ?? 'Demo Voter',
          voter_id: voterIdStr,
          aadhaar_number: 'XXXX-XXXX-XXXX',
          mobile_number: voter?.mobileNumber ?? '9999999999',
          email: 'demo@example.com',
          dob: '1990-01-01',
          gender: (voter?.gender as string) ?? 'NA',
          religion: 'NA',
          caste: 'NA',
          address_line1: voter?.address ?? '123 Demo Street',
          address_line2: 'Near Demo Circle',
          district: voter?.district ?? 'Demo District',
          assembly_mandalam: voter?.panchayatMandal ?? 'Demo Mandal',
          panchayat: null,
          municipalitie: null,
          corporation: null,
          ward: voter?.ward ?? '1',
          pincode: '500001',
          occupation: 'Household',
          marital_status: 'Married',
          income_range: '0-2.5L',
          benefited_scheme: scheme?.name ?? 'General Assistance',
          scheme_id: scheme?.id ?? 'scheme-demo',
          scheme_details: scheme?.description ?? 'Dummy scheme details',
          required_help: i === 0
            ? 'Need assistance with pension application documentation.'
            : i === 1
            ? 'Requesting support for healthcare scheme enrollment.'
            : 'Follow-up on agriculture subsidy status.',
          documents: [],
          status,
          created_at: created,
          updated_at: created,
          state_id: '36',
          district_id: '501',
          mandal_id: '1001',
          ward_id: '1',
          panchayath_id: null,
          municipalitie_id: null,
          corporation_id: null,
          application_id: appId,
        } as HelpDeskApplication;
      });

      console.log('HelpDesk: Using dummy applications for voter', voterIdStr, dummy.length);
      return dummy;
    } catch (e) {
      console.error('HelpDesk: Error building voter applications', e);
      return [] as HelpDeskApplication[];
    }
  }, [voterId, voter]);


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

  const handleApplyScheme = (scheme: GovernmentScheme) => {
    console.log('Applying for scheme:', scheme.name);
    console.log('Voter ID:', voterId);
    Alert.alert(
      'Apply for Scheme',
      `You are applying for: ${scheme.name}\n\nThis would normally open an application form with pre-filled voter data.`,
      [{ text: 'OK' }]
    );
  };

  const renderApplicationItem = ({ item }: { item: HelpDeskApplication }) => {
    const scheme = schemeData.items.find(s => s.id === item.scheme_id);
    
    return (
      <Card style={styles.requestCard} testID={`request-card-${item.application_id}`}>
        <View style={styles.requestHeader}>
          <View style={styles.requestInfo}>
            <Text style={[styles.schemeName, { color: colors.text.primary }]}>
              {scheme?.name || 'Unknown Scheme'}
            </Text>
            <Text style={[styles.requestId, { color: colors.text.secondary }]}>
              {item.application_id}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            {getStatusIcon(item.status)}
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.schemeDescription, { color: colors.text.secondary }]} numberOfLines={2}>
          {item.required_help}
        </Text>
        
        <View style={styles.requestMeta}>
          <Text style={[styles.requestMetaText, { color: colors.text.secondary }]}>
            Submitted By: {voter?.karyakartaName || 'Unknown'}
          </Text>
          <Text style={[styles.requestMetaText, { color: colors.text.secondary }]}>
            Submission Date: {new Date(item.created_at).toLocaleDateString('en-GB')}
          </Text>
        </View>
        
        <View style={styles.requestActions}>
          <View style={styles.statusContainer}>
            {getStatusIcon(item.status)}
            <Text style={[styles.statusLabel, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => router.push(`/application-details?applicationId=${item.application_id}`)}
          >
            <Eye size={16} color={colors.primary} testID={`view-details-icon-${item.application_id}`} />
            <Text style={[styles.viewDetailsText, { color: colors.primary }]}>View Details</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  const renderSchemeItem = ({ item }: { item: GovernmentScheme }) => {
    const cleanDescription = item.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
    
    return (
      <Card style={styles.schemeCard}>
        <View style={styles.schemeHeader}>
          <View style={styles.schemeInfo}>
            <Text style={styles.schemeNameCard}>{item.name}</Text>
            <Text style={styles.schemeCategory}>{item.category}</Text>
          </View>
          <Text style={styles.schemeBudget}>₹{item.budget.toLocaleString()}</Text>
        </View>
        
        <Text style={styles.schemeDescriptionCard} numberOfLines={3}>
          {cleanDescription}
        </Text>
        
        <View style={styles.beneficiariesContainer}>
          <Text style={styles.beneficiariesLabel}>Beneficiaries: </Text>
          <Text style={styles.beneficiariesText}>{item.beneficiaries}</Text>
        </View>
        
        <Button
          title="Apply"
          onPress={() => handleApplyScheme(item)}
          variant="primary"
          size="small"
          style={styles.applyButton}
        />
      </Card>
    );
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => {
              console.log('Help Desk: Back button pressed');
              try {
                if (router.canGoBack()) {
                  console.log('Going back...');
                  router.back();
                } else {
                  console.log('Cannot go back, replacing with tabs...');
                  router.replace('/(tabs)');
                }
              } catch (error) {
                console.error('Navigation error:', error);
                router.replace('/(tabs)');
              }
            }} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>HelpDesk</Text>
        </View>
      </SafeAreaView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Voter Profile Section */}
        {voter && (
          <Card style={styles.voterProfileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageSection}>
                <View style={styles.profileImageContainer}>
                  <Text style={styles.profileInitial}>{voter.name.charAt(0)}</Text>
                </View>
              </View>
              <View style={styles.profileInfoSection}>
                <Text style={styles.profileName}>{voter.name}</Text>
                <Text style={styles.profileVoterId}>{voter.voterId}</Text>
                <Text style={styles.profileAgeGender}>{voter.age}Y • {voter.gender}</Text>
              </View>
              <View style={[
                styles.profilePartyIcon,
                { backgroundColor: voter.partyInclination === 'BJP' ? colors.primary : '#E0E0E0' }
              ]}>
                <Text style={[
                  styles.profilePartyIconText,
                  { color: voter.partyInclination === 'BJP' ? colors.text.white : colors.text.light }
                ]}>
                  🪷
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Section A: Voter Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Voter Requests</Text>
            <Text style={[styles.sectionCount, { color: colors.text.secondary }]}>
              ({voterApplications.length})
            </Text>
          </View>
          
          <View style={styles.requestsList} testID="voter-requests-list">
            {voterApplications.length > 0 ? (
              voterApplications.map((item) => (
                <View key={item.id}>
                  {renderApplicationItem({ item })}
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <FileText size={48} color={colors.text.light} />
                <Text style={[styles.emptyText, { color: colors.text.light }]}>No requests found for this voter</Text>
              </View>
            )}
          </View>
        </View>

        {/* Section B: Government Schemes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Schemes</Text>
            <Text style={styles.sectionCount}>({filteredSchemes.length})</Text>
          </View>
          
          {/* Search and Filter */}
          <View style={styles.searchFilterContainer}>
            <Input
              placeholder="Search schemes..."
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
          
          <View style={styles.schemesList}>
            {filteredSchemes.map((item) => (
              <View key={item.id}>
                {renderSchemeItem({ item })}
              </View>
            ))}
            
            {filteredSchemes.length === 0 && (
              <View style={styles.emptyContainer}>
                <FileText size={48} color={colors.text.light} />
                <Text style={styles.emptyText}>No schemes found</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
  backButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  headerTitle: {
    ...Typography.title,
    color: colors.text.white,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },

  bjpLogo: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: colors.text.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  bjpLogoImage: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...Typography.title,
    fontWeight: '700',
  },
  sectionCount: {
    ...Typography.body,
    marginLeft: Spacing.sm,
  },
  requestsList: {
    padding: Spacing.md,
  },
  schemesList: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  requestCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  requestInfo: {
    flex: 1,
  },
  schemeName: {
    ...Typography.subtitle,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  schemeDescription: {
    ...Typography.body,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  requestId: {
    ...Typography.caption,
    color: colors.text.secondary,
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
  requestMeta: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  requestMetaText: {
    ...Typography.caption,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusLabel: {
    ...Typography.caption,
    fontWeight: '600',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  viewDetailsText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  voterProfileCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImageSection: {
    marginRight: Spacing.md,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.round,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    ...Typography.title,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 32,
  },
  profileInfoSection: {
    flex: 1,
    paddingLeft: Spacing.sm,
  },
  profileName: {
    ...Typography.title,
    color: colors.text.primary,
    fontWeight: '700',
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  profileVoterId: {
    ...Typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  profileAgeGender: {
    ...Typography.body,
    color: colors.text.secondary,
    fontSize: 16,
  },
  profilePartyIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePartyIconText: {
    fontSize: 20,
  },
  inlineDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    minHeight: 24,
    paddingVertical: 4,
  },
  inlineDetailLabel: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    width: 120,
    letterSpacing: 0.5,
    textAlign: 'left',
  },
  inlineDetailSeparator: {
    ...Typography.body,
    fontWeight: '700',
    marginHorizontal: Spacing.sm,
    width: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  inlineDetailValue: {
    ...Typography.body,
    fontWeight: '500',
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  viewAllText: {
    ...Typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  schemeCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
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
  schemeNameCard: {
    ...Typography.subtitle,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  schemeCategory: {
    ...Typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  schemeBudget: {
    ...Typography.body,
    color: colors.secondary,
    fontWeight: '700',
  },
  schemeDescriptionCard: {
    ...Typography.body,
    color: colors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  beneficiariesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  beneficiariesLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: colors.text.primary,
  },
  beneficiariesText: {
    ...Typography.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
  applyButton: {
    alignSelf: 'flex-start',
  },
  searchFilterContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    ...Typography.body,
    color: colors.text.light,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});