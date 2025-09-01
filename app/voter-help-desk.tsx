import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, User } from 'lucide-react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
import applicationData from './ApplicationDetails.json';
import schemeData from './SchemeDetails.json';

interface HelpDeskApplication {
  id: string;
  name: string;
  voter_id: string;
  mobile_number: string;
  status: string;
  application_id: string;
  created_at: string;
  required_help: string;
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

export default function VoterHelpDeskScreen() {
  const { voterId, voterName } = useLocalSearchParams();
  const { colors, t } = useAppSettings();

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const decodedVoterName = typeof voterName === 'string' ? decodeURIComponent(voterName) : 'Voter';

  // Filter applications for this specific voter
  const voterApplications = useMemo(() => {
    return applicationData.applications.filter(app => app.voter_id === voterId);
  }, [voterId]);

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
    console.log('Voter Name:', decodedVoterName);
    Alert.alert(
      t('applyForScheme') || 'Apply for Scheme',
      `${t('applyingFor') || 'Applying for'}: ${scheme.name}\n\n${t('voterDetails') || 'Voter Details'}:\n${t('name') || 'Name'}: ${decodedVoterName}\n${t('voterId') || 'Voter ID'}: ${voterId}\n\n${t('applicationWillBeProcessed') || 'Application will be processed with the above voter details.'}`,
      [
        {
          text: t('cancel') || 'Cancel',
          style: 'cancel'
        },
        {
          text: t('submit') || 'Submit',
          onPress: () => {
            Alert.alert(
              t('applicationSubmitted') || 'Application Submitted',
              t('applicationSubmittedMessage') || 'Your application has been submitted successfully and will be processed soon.',
              [{ text: t('ok') || 'OK' }]
            );
          }
        }
      ]
    );
  };

  const renderApplicationItem = ({ item }: { item: HelpDeskApplication }) => (
    <Card style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.requestInfo}>
          <Text style={[styles.requestTitle, { color: colors.text.primary }]}>{item.name}</Text>
          <Text style={[styles.requestId, { color: colors.text.secondary }]}>{t('requestId') || 'Request ID'}: {item.application_id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          {getStatusIcon(item.status)}
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.requestDetails}>
        <Text style={[styles.requestDetailText, { color: colors.text.secondary }]}>{t('mobile') || 'Mobile'}: {item.mobile_number}</Text>
        <Text style={[styles.requestDetailText, { color: colors.text.secondary }]}>{t('helpRequired') || 'Help Required'}: {item.required_help}</Text>
        <Text style={[styles.requestDetailText, { color: colors.text.secondary }]}>
          {t('submitted') || 'Submitted'}: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.viewRequestButton}>
        <Text style={[styles.viewRequestText, { color: colors.primary }]}>{t('viewDetails') || 'View Details'}</Text>
      </TouchableOpacity>
    </Card>
  );

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
          <Text style={[styles.beneficiariesLabel, { color: colors.text.primary }]}>{t('beneficiaries') || 'Beneficiaries'}: </Text>
          {item.beneficiaries}
        </Text>
        
        <Button
          title={t('apply') || 'Apply'}
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
          title: `${t('helpDesk') || 'HelpDesk'} - ${decodedVoterName}`,
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
            fontSize: 16,
            fontWeight: '600',
            color: colors.text.primary,
          },
        }}
      />
      
      {/* Voter Info Header */}
      <View style={styles.voterInfoHeader}>
        <View style={styles.voterInfoIcon}>
          <User size={24} color={colors.primary} />
        </View>
        <View style={styles.voterInfoText}>
          <Text style={[styles.voterInfoName, { color: colors.text.primary }]}>{decodedVoterName}</Text>
          <Text style={[styles.voterInfoId, { color: colors.text.secondary }]}>{t('voterId') || 'Voter ID'}: {voterId}</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section A: Recent HelpDesk Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{t('myRecentRequests') || 'My Recent Requests'}</Text>
            <Text style={[styles.sectionCount, { color: colors.text.secondary }]}>({voterApplications.length})</Text>
          </View>
          
          <View style={styles.requestsList}>
            {voterApplications.length > 0 ? (
              <>
                {voterApplications.slice(0, 3).map((item) => (
                  <View key={item.id}>
                    {renderApplicationItem({ item })}
                  </View>
                ))}
                
                {voterApplications.length > 3 && (
                  <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={[styles.viewAllText, { color: colors.primary }]}>{t('viewAllRequests') || 'View All Requests'}</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <View style={styles.emptyRequestsContainer}>
                <FileText size={48} color={colors.text.light} />
                <Text style={[styles.emptyText, { color: colors.text.light }]}>
                  {t('noRequestsFound') || 'No help desk requests found for this voter'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Section B: Government Schemes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{t('availableSchemes') || 'Available Schemes'}</Text>
            <Text style={[styles.sectionCount, { color: colors.text.secondary }]}>({filteredSchemes.length})</Text>
          </View>
          
          {/* Search and Filter */}
          <View style={styles.searchFilterContainer}>
            <Input
              placeholder={t('searchSchemes') || 'Search schemes...'}
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
                <Text style={[styles.emptyText, { color: colors.text.light }]}>{t('noSchemesFound') || 'No schemes found'}</Text>
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
  voterInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: Spacing.md,
  },
  voterInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voterInfoText: {
    flex: 1,
  },
  voterInfoName: {
    ...Typography.subtitle,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  voterInfoId: {
    ...Typography.caption,
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
  requestTitle: {
    ...Typography.subtitle,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  requestId: {
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
  requestDetails: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  requestDetailText: {
    ...Typography.caption,
  },
  viewRequestButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  viewRequestText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  viewAllText: {
    ...Typography.body,
    fontWeight: '600',
  },
  emptyRequestsContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
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
  schemeName: {
    ...Typography.subtitle,
    fontWeight: '600',
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
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});