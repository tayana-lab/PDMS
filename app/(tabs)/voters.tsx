import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Search, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Voter {
  id: string;
  name: string;
  voterId: string;
  address: string;
  phone: string;
  ward: string;
}

const mockVoters: Voter[] = [
  {
    id: '1',
    name: 'Amit Sharma',
    voterId: 'ABC1234567',
    address: 'House No. 123, Sector 15, New Delhi',
    phone: '+91 9876543210',
    ward: 'Ward 15'
  },
  {
    id: '2',
    name: 'Priya Singh',
    voterId: 'DEF9876543',
    address: 'Flat 45, Block B, Rohini, Delhi',
    phone: '+91 8765432109',
    ward: 'Ward 22'
  },
  {
    id: '3',
    name: 'Rajesh Kumar',
    voterId: 'GHI5432109',
    address: 'Plot 67, Dwarka, New Delhi',
    phone: '+91 7654321098',
    ward: 'Ward 8'
  }
];

export default function VotersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [voters, setVoters] = useState<Voter[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = mockVoters.filter(voter =>
        voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voter.voterId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voter.phone.includes(searchQuery)
      );
      setVoters(filtered);
      setIsLoading(false);
    }, 1000);
  };

  const renderVoter = ({ item }: { item: Voter }) => (
    <Card style={styles.voterCard}>
      <View style={styles.voterHeader}>
        <Text style={styles.voterName}>{item.name}</Text>
        <Text style={styles.ward}>{item.ward}</Text>
      </View>
      <Text style={styles.voterId}>Voter ID: {item.voterId}</Text>
      <Text style={styles.address}>{item.address}</Text>
      <Text style={styles.phone}>{item.phone}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voters</Text>
        <Text style={styles.subtitle}>Search and manage voter information</Text>
      </View>

      {/* Quick Access to Advanced Search */}
      <View style={styles.quickAccessContainer}>
        <TouchableOpacity 
          style={styles.advancedSearchCard}
          onPress={() => router.push('/search-voter')}
        >
          <View style={styles.advancedSearchContent}>
            <View style={styles.advancedSearchIcon}>
              <Search size={24} color={Colors.primary} />
            </View>
            <View style={styles.advancedSearchText}>
              <Text style={styles.advancedSearchTitle}>Advanced Voter Search</Text>
              <Text style={styles.advancedSearchDescription}>
                Search with detailed filters and edit voter information
              </Text>
            </View>
            <ArrowRight size={20} color={Colors.text.light} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.sectionTitle}>Quick Search</Text>
        <Input
          placeholder="Enter name, voter ID, or phone number"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        <Button
          title="Search"
          onPress={handleSearch}
          loading={isLoading}
          style={styles.searchButton}
        />
      </View>

      <FlatList
        data={voters}
        renderItem={renderVoter}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Search size={48} color={Colors.text.light} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No voters found' : 'Enter search criteria to find voters'}
            </Text>
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
  subtitle: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs
  },
  quickAccessContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.background
  },
  advancedSearchCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border
  },
  advancedSearchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md
  },
  advancedSearchIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center'
  },
  advancedSearchText: {
    flex: 1
  },
  advancedSearchTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.xs
  },
  advancedSearchDescription: {
    ...Typography.caption,
    color: Colors.text.secondary
  },
  searchContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.background
  },
  sectionTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.md
  },
  searchInput: {
    marginBottom: Spacing.md
  },
  searchButton: {
    marginBottom: 0
  },
  listContainer: {
    padding: Spacing.lg,
    flexGrow: 1
  },
  voterCard: {
    marginBottom: Spacing.md
  },
  voterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm
  },
  voterName: {
    ...Typography.subtitle,
    flex: 1
  },
  ward: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600'
  },
  voterId: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs
  },
  address: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs
  },
  phone: {
    ...Typography.caption,
    color: Colors.text.secondary
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