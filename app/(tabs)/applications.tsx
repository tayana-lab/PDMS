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
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
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
        return <Clock size={16} color={Colors.warning} />;
      case 'APPROVED':
        return <CheckCircle size={16} color={Colors.success} />;
      case 'REJECTED':
        return <XCircle size={16} color={Colors.error} />;
      default:
        return <FileText size={16} color={Colors.text.secondary} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return Colors.warning;
      case 'APPROVED':
        return Colors.success;
      case 'REJECTED':
        return Colors.error;
      default:
        return Colors.text.secondary;
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
            <Text style={styles.schemeName}>{item.name}</Text>
            <Text style={styles.schemeCategory}>{item.category}</Text>
          </View>
          <Text style={styles.schemeBudget}>₹{item.budget.toLocaleString()}</Text>
        </View>
        
        <Text style={styles.schemeDescription} numberOfLines={3}>
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

  const renderMyApplicationItem = ({ item }: { item: MyApplication }) => (
    <Card style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <View style={styles.applicationInfo}>
          <Text style={styles.applicantName}>{item.name}</Text>
          <Text style={styles.applicationId}>ID: {item.application_id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          {getStatusIcon(item.status)}
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.applicationDetails}>
        <Text style={styles.detailText}>Mobile: {item.mobile_number}</Text>
        <Text style={styles.detailText}>Help Required: {item.required_help}</Text>
        <Text style={styles.detailText}>
          Submitted: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Details</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Applications</Text>
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
          
          <Text style={styles.sectionTitle}>
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
                <FileText size={48} color={Colors.text.light} />
                <Text style={styles.emptyText}>No schemes found</Text>
              </View>
            }
          />
        </View>
      )}

      {/* My Applications Tab */}
      {selectedTab === 'myApplications' && (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>
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
                <FileText size={48} color={Colors.text.light} />
                <Text style={styles.emptyText}>No applications found</Text>
              </View>
            }
          />
        </View>
      )}

      {/* Voter ID Input Modal */}
      {showVoterIdModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Voter ID</Text>
            <Text style={styles.modalSubtitle}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background
  },
  title: {
    ...Typography.title
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.text.white,
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
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: Colors.text.white,
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
    color: Colors.primary,
    fontWeight: '600',
  },
  schemeBudget: {
    ...Typography.body,
    color: Colors.secondary,
    fontWeight: '700',
  },
  schemeDescription: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  schemeBeneficiaries: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  beneficiariesLabel: {
    fontWeight: '600',
    color: Colors.text.primary,
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
    color: Colors.text.secondary,
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
    color: Colors.text.secondary,
  },
  viewDetailsButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  viewDetailsText: {
    ...Typography.caption,
    color: Colors.primary,
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
    color: Colors.text.light,
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
    backgroundColor: Colors.background,
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
    color: Colors.text.secondary,
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