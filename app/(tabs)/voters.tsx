import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ArrowRight, HelpCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
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
  const { colors, t } = useAppSettings();

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
        <Text style={[styles.voterName, { color: colors.text.primary }]}>{item.name}</Text>
        <Text style={[styles.ward, { color: colors.primary }]}>{item.ward}</Text>
      </View>
      <Text style={[styles.voterId, { color: colors.text.primary }]}>{t('voterId')}: {item.voterId}</Text>
      <Text style={[styles.address, { color: colors.text.secondary }]}>{item.address}</Text>
      <Text style={[styles.phone, { color: colors.text.secondary }]}>{item.phone}</Text>
      
      <View style={styles.actionButtons}>
        <Button
          title={t('helpDesk')}
          onPress={() => router.push(`/help-desk?voterId=${item.voterId}`)}
          variant="outline"
          size="small"
          style={styles.helpDeskButton}
          icon={<HelpCircle size={16} color={colors.primary} />}
        />
      </View>
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
      <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerSpacer} />
          <Text style={[styles.headerTitle, { color: colors.text.white }]}>{t('votersTitle')}</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>
      
      <View style={styles.content}>
        <View style={styles.subHeader}>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>{t('votersSubtitle')}</Text>
        </View>

      {/* Quick Access to Advanced Search */}
      <View style={styles.quickAccessContainer}>
        <TouchableOpacity 
          style={styles.advancedSearchCard}
          onPress={() => router.push('/search-voter')}
        >
          <View style={styles.advancedSearchContent}>
            <View style={styles.advancedSearchIcon}>
              <Search size={24} color={colors.primary} />
            </View>
            <View style={styles.advancedSearchText}>
              <Text style={[styles.advancedSearchTitle, { color: colors.text.primary }]}>{t('advancedVoterSearch')}</Text>
              <Text style={[styles.advancedSearchDescription, { color: colors.text.secondary }]}>
                {t('advancedSearchDescription')}
              </Text>
            </View>
            <ArrowRight size={20} color={colors.text.light} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{t('quickSearch')}</Text>
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        <Button
          title={t('search')}
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
            <Search size={48} color={colors.text.light} />
            <Text style={[styles.emptyText, { color: colors.text.light }]}>
              {searchQuery ? t('noVotersFound') : t('enterSearchCriteria')}
            </Text>
          </View>
        }
      />
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    // backgroundColor applied inline
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
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  content: {
    flex: 1,
  },
  subHeader: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background
  },
  subtitle: {
    ...Typography.caption,
  },
  quickAccessContainer: {
    padding: Spacing.lg,
    backgroundColor: colors.background
  },
  advancedSearchCard: {
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border
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
    backgroundColor: colors.primary + '20',
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
    ...Typography.caption
  },
  searchContainer: {
    padding: Spacing.lg,
    backgroundColor: colors.background
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
    fontWeight: '600'
  },
  voterId: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Spacing.xs
  },
  address: {
    ...Typography.caption,
    marginBottom: Spacing.xs
  },
  phone: {
    ...Typography.caption,
    marginBottom: Spacing.md
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm
  },
  helpDeskButton: {
    minWidth: 100
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
  }
});