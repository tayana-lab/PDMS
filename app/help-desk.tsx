import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
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

export default function HelpDeskScreen() {
  const { voterId } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState<'applications' | 'schemes'>('applications');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    switch (status) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const handleApplyScheme = (scheme: GovernmentScheme) => {
    console.log('Applying for scheme:', scheme.name);
    console.log('Voter ID:', voterId);
    // Here you would navigate to application form with pre-filled data
    // For now, we'll show an alert since the application form doesn't exist yet
    Alert.alert(
      'Apply for Scheme',
      `You are applying for: ${scheme.name}\n\nThis would normally open an application form with pre-filled voter data.`,
      [{ text: 'OK' }]
    );
  };

  const renderApplicationItem = ({ item }: { item: HelpDeskApplication }) => (
    <Card style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <View style={styles.applicationInfo}>
          <Text style={styles.applicationName}>{item.name}</Text>
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
          Applied: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </Card>
  );

  const renderSchemeItem = ({ item }: { item: GovernmentScheme }) => (
    <Card style={styles.schemeCard}>
      <View style={styles.schemeHeader}>
        <View style={styles.schemeInfo}>
          <Text style={styles.schemeName}>{item.name}</Text>
          <Text style={styles.schemeCategory}>{item.category}</Text>
        </View>
        <Text style={styles.schemeBudget}>₹{item.budget.toLocaleString()}</Text>
      </View>
      
      <Text style={styles.schemeDescription} numberOfLines={3}>
        {item.description}
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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Help Desk',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.content}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'applications' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('applications')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'applications' && styles.activeTabText
            ]}>
              Recent Applications
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
              Government Schemes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Applications Tab */}
        {selectedTab === 'applications' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>
              Recent Help Desk Applications ({applicationData.total_count})
            </Text>
            
            <FlatList
              data={applicationData.applications}
              renderItem={renderApplicationItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        )}

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
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  content: {
    flex: 1,
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
  sectionTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.md,
  },
  listContainer: {
    paddingBottom: Spacing.xl,
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
  applicationName: {
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
  },
  detailText: {
    ...Typography.caption,
    color: Colors.text.secondary,
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
});