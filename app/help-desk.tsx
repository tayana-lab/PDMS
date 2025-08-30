import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
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
  
  // Filter applications for this voter
  const voterApplications = applicationData.applications.filter(
    app => app.voter_id === voterId
  );



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
      <Card style={styles.requestCard}>
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
            <Eye size={16} color={colors.primary} />
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
        
        <Text style={styles.schemeBeneficiaries} numberOfLines={2}>
          <Text style={styles.beneficiariesLabel}>Beneficiaries: </Text>
          {item.beneficiaries}
        </Text>
        
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
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'HelpDesk',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text.primary,
          },
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Voter Information Section */}
        {voter && (
          <Card style={styles.voterCard}>
            <View style={styles.voterHeader}>
              <View style={styles.voterPhotoContainer}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }}
                  style={styles.voterPhoto}
                />
              </View>
              <View style={styles.voterInfo}>
                <Text style={[styles.voterName, { color: colors.text.primary }]}>{voter.name}</Text>
                <Text style={[styles.voterDetail, { color: colors.text.secondary }]}>Voter ID: {voter.voterId}</Text>
                <Text style={[styles.voterDetail, { color: colors.text.secondary }]}>
                  {voter.age} years, {voter.gender}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Section A: Voter Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Voter Requests</Text>
            <Text style={[styles.sectionCount, { color: colors.text.secondary }]}>({voterApplications.length})</Text>
          </View>
          
          <View style={styles.requestsList}>
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
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
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
  voterCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  voterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  voterPhotoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  voterPhoto: {
    width: '100%',
    height: '100%',
  },
  voterInfo: {
    flex: 1,
  },
  voterName: {
    ...Typography.title,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  voterDetail: {
    ...Typography.body,
    marginBottom: Spacing.xs,
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
  schemeBeneficiaries: {
    ...Typography.caption,
    color: colors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  beneficiariesLabel: {
    fontWeight: '600',
    color: colors.text.primary,
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