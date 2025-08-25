import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
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
  name: string;
  voter_id: string;
  mobile_number: string;
  status: string;
  application_id: string;
  created_at: string;
  scheme_id: string;
  required_help: string;
}

export default function ApplicationsScreen() {
  const [selectedTab, setSelectedTab] = useState<'schemes' | 'myApplications'>('schemes');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [voterIdInput, setVoterIdInput] = useState<string>('');
  const [showVoterIdModal, setShowVoterIdModal] = useState<boolean>(false);
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const { colors } = useAppSettings();

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
      Alert.alert('Error', 'Please enter a valid Voter ID');
      return;
    }
    
    console.log('Applying for scheme:', selectedScheme?.name);
    console.log('Voter ID:', voterIdInput);
    
    Alert.alert(
      'Application Submitted',
      `Your application for ${selectedScheme?.name} has been submitted successfully.\n\nApplication will be processed with voter details for ID: ${voterIdInput}`,
      [
        {
          text: 'OK',
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
          <Text style={[styles.beneficiariesLabel, { color: colors.text.primary }]}>Beneficiaries: </Text>
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
        <Text style={[styles.detailText, { color: colors.text.secondary }]}>Mobile: {item.mobile_number}</Text>
        <Text style={[styles.detailText, { color: colors.text.secondary }]}>Help Required: {item.required_help}</Text>
        <Text style={[styles.detailText, { color: colors.text.secondary }]}>
          Submitted: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.viewDetailsButton}>
        <Text style={[styles.viewDetailsText, { color: colors.primary }]}>View Details</Text>
      </TouchableOpacity>
    </Card>
  );

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Applications</Text>
      </View>

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
            Schemes
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
            My Applications
          </Text>
        </TouchableOpacity>
      </View>

      {/* Schemes Tab */}
      {selectedTab === 'schemes' && (
        <View style={styles.tabContent}>
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
          
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Available Schemes ({filteredSchemes.length})
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
                <Text style={[styles.emptyText, { color: colors.text.light }]}>No schemes found</Text>
              </View>
            }
          />
        </View>
      )}

      {/* My Applications Tab */}
      {selectedTab === 'myApplications' && (
        <View style={styles.tabContent}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            My Applications ({applicationData.total_count})
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
                <Text style={[styles.emptyText, { color: colors.text.light }]}>No applications found</Text>
              </View>
            }
          />
        </View>
      )}

      {/* Voter ID Input Modal */}
      {showVoterIdModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Enter Voter ID</Text>
            <Text style={[styles.modalSubtitle, { color: colors.text.secondary }]}>
              Applying for: {selectedScheme?.name}
            </Text>
            
            <Input
              placeholder="Enter your Voter ID"
              value={voterIdInput}
              onChangeText={setVoterIdInput}
              style={styles.voterIdInput}
              autoCapitalize="characters"
            />
            
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowVoterIdModal(false);
                  setVoterIdInput('');
                  setSelectedScheme(null);
                }}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Submit"
                onPress={handleVoterIdSubmit}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background
  },
  title: {
    ...Typography.title
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