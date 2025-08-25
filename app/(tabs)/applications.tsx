import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface Application {
  id: string;
  applicantName: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  description: string;
}

const mockApplications: Application[] = [
  {
    id: '1',
    applicantName: 'Rajesh Kumar',
    type: 'Ration Card',
    status: 'pending',
    submittedDate: '2024-01-15',
    description: 'New ration card application for family of 4'
  },
  {
    id: '2',
    applicantName: 'Priya Sharma',
    type: 'Voter ID',
    status: 'approved',
    submittedDate: '2024-01-10',
    description: 'First time voter registration'
  },
  {
    id: '3',
    applicantName: 'Amit Singh',
    type: 'Birth Certificate',
    status: 'rejected',
    submittedDate: '2024-01-12',
    description: 'Birth certificate for newborn child'
  },
  {
    id: '4',
    applicantName: 'Sunita Devi',
    type: 'Pension',
    status: 'pending',
    submittedDate: '2024-01-18',
    description: 'Senior citizen pension application'
  }
];

export default function ApplicationsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} color={Colors.warning} />;
      case 'approved':
        return <CheckCircle size={16} color={Colors.success} />;
      case 'rejected':
        return <XCircle size={16} color={Colors.error} />;
      default:
        return <FileText size={16} color={Colors.text.secondary} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.warning;
      case 'approved':
        return Colors.success;
      case 'rejected':
        return Colors.error;
      default:
        return Colors.text.secondary;
    }
  };

  const filteredApplications = selectedFilter === 'all' 
    ? mockApplications 
    : mockApplications.filter(app => app.status === selectedFilter);

  const pendingCount = mockApplications.filter(app => app.status === 'pending').length;

  const renderApplication = ({ item }: { item: Application }) => (
    <TouchableOpacity activeOpacity={0.8}>
      <Card style={styles.applicationCard}>
        <View style={styles.applicationHeader}>
          <View style={styles.applicationInfo}>
            <Text style={styles.applicantName}>{item.applicantName}</Text>
            <Text style={styles.applicationType}>{item.type}</Text>
          </View>
          <View style={styles.statusContainer}>
            {getStatusIcon(item.status)}
            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>Submitted: {item.submittedDate}</Text>
      </Card>
    </TouchableOpacity>
  );

  const FilterButton = ({ filter, label, count }: { filter: typeof selectedFilter, label: string, count?: number }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterText,
        selectedFilter === filter && styles.activeFilterText
      ]}>
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <Badge count={count} size={16} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Applications</Text>
      </View>

      <View style={styles.filterContainer}>
        <FilterButton filter="all" label="All" />
        <FilterButton filter="pending" label="Pending" count={pendingCount} />
        <FilterButton filter="approved" label="Approved" />
        <FilterButton filter="rejected" label="Rejected" />
      </View>

      <FlatList
        data={filteredApplications}
        renderItem={renderApplication}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FileText size={48} color={Colors.text.light} />
            <Text style={styles.emptyText}>No applications found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface
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
  filterContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginRight: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  filterText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text.secondary
  },
  activeFilterText: {
    color: Colors.text.white
  },
  listContainer: {
    padding: Spacing.lg,
    flexGrow: 1
  },
  applicationCard: {
    marginBottom: Spacing.md
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm
  },
  applicationInfo: {
    flex: 1
  },
  applicantName: {
    ...Typography.subtitle,
    marginBottom: Spacing.xs
  },
  applicationType: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primary
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  status: {
    ...Typography.caption,
    fontWeight: '600',
    marginLeft: Spacing.xs
  },
  description: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm
  },
  date: {
    ...Typography.small,
    color: Colors.text.light
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
  }
});