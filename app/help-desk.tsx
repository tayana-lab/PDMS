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
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
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

export default function HelpDeskScreen() {
  const { voterId } = useLocalSearchParams();
  const { colors } = useAppSettings();

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

  const handleApplyScheme = (scheme: GovernmentScheme) => {
    console.log('Applying for scheme:', scheme.name);
    console.log('Voter ID:', voterId);
    Alert.alert(
      'Apply for Scheme',
      `You are applying for: ${scheme.name}\n\nThis would normally open an application form with pre-filled voter data.`,
      [{ text: 'OK' }]
    );
  };

  const renderApplicationItem = ({ item }: { item: HelpDeskApplication }) => (
    <Card style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.requestInfo}>
          <Text style={styles.requestTitle}>{item.name}</Text>
          <Text style={styles.requestId}>Request ID: {item.application_id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          {getStatusIcon(item.status)}
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.requestDetails}>
        <Text style={styles.requestDetailText}>Mobile: {item.mobile_number}</Text>
        <Text style={styles.requestDetailText}>Help Required: {item.required_help}</Text>
        <Text style={styles.requestDetailText}>
          Submitted: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.viewRequestButton}>
        <Text style={styles.viewRequestText}>View Details</Text>
      </TouchableOpacity>
    </Card>
  );

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
        {/* Section A: Recent HelpDesk Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Recent Requests</Text>
            <Text style={styles.sectionCount}>({applicationData.total_count})</Text>
          </View>
          
          <View style={styles.requestsList}>
            {applicationData.applications.slice(0, 3).map((item) => (
              <View key={item.id}>
                {renderApplicationItem({ item })}
              </View>
            ))}
            
            {applicationData.applications.length > 3 && (
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All Requests</Text>
              </TouchableOpacity>
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
                <FileText size={48} color={Colors.text.light} />
                <Text style={styles.emptyText}>No schemes found</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    ...Typography.title,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  sectionCount: {
    ...Typography.body,
    color: Colors.text.secondary,
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
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.border,
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
  requestDetails: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  requestDetailText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  viewRequestButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  viewRequestText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  viewAllText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  schemeCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.border,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.light,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});