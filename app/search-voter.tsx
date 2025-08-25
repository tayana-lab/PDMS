import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
  TextInput
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Edit, Phone, HelpCircle, ArrowLeft, Mic, Grid3X3 } from 'lucide-react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { mockVoters } from '@/constants/mockData';

interface Voter {
  id: string;
  name: string;
  voterId: string;
  mobileNumber: string;
  guardianName: string;
  houseName: string;
  address: string;
  lastInteractionDate: string;
  karyakartaName: string;
  partyInclination: string;
  age: number;
  gender: string;
  ward: string;
  assemblyConstituency: string;
}

export default function SearchVoterScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<Partial<Voter>>({});
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  
  const recentSearches = ['Priya Nair', 'TVM001234567', 'Arun Pillai'];
  const filterOptions = ['All', 'Party Voter', 'Inclined', 'Neutral', 'Anti'];

  const filteredVoters = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    let filtered = mockVoters.filter(voter => 
      voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voter.voterId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Apply filter
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(voter => {
        switch (selectedFilter) {
          case 'Party Voter':
            return voter.partyInclination === 'BJP';
          case 'Inclined':
            return voter.partyInclination === 'Inclined';
          case 'Neutral':
            return voter.partyInclination === 'Neutral';
          case 'Anti':
            return voter.partyInclination === 'Anti';
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [searchQuery, selectedFilter]);

  const handleVoterSelect = (voter: Voter) => {
    setSelectedVoter(voter);
    setEditData({
      mobileNumber: voter.mobileNumber,
      address: voter.address,
      partyInclination: voter.partyInclination
    });
  };

  const handleCall = (phoneNumber: string) => {
    if (!phoneNumber) {
      Alert.alert('No Phone Number', 'This voter does not have a phone number on file.');
      return;
    }
    
    const phoneUrl = Platform.select({
      ios: `tel:${phoneNumber}`,
      android: `tel:${phoneNumber}`,
      default: `tel:${phoneNumber}`
    });
    
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    console.log('Saving voter data:', editData);
    console.log('Geo location should be captured here');
    setIsEditing(false);
    Alert.alert('Success', 'Voter information updated successfully!');
  };

  const handleHelpDesk = () => {
    if (selectedVoter) {
      router.push({
        pathname: '/help-desk',
        params: { voterId: selectedVoter.id }
      });
    }
  };

  const getPartyStatus = (inclination: string) => {
    switch (inclination) {
      case 'BJP':
        return { label: 'Party Voter', color: Colors.primary, bgColor: Colors.primary + '20' };
      case 'Inclined':
        return { label: 'Inclined to Party', color: '#FF9500', bgColor: '#FF950020' };
      case 'Neutral':
        return { label: 'Neutral', color: '#8E8E93', bgColor: '#8E8E9320' };
      case 'Anti':
        return { label: 'Anti Party', color: '#FF3B30', bgColor: '#FF3B3020' };
      default:
        return { label: 'Unknown', color: '#8E8E93', bgColor: '#8E8E9320' };
    }
  };

  const renderPartyInclinationIcon = (inclination: string) => {
    const isInclined = inclination === 'BJP';
    return (
      <View style={[
        styles.partyIcon,
        { backgroundColor: isInclined ? Colors.primary : '#E0E0E0' }
      ]}>
        <Text style={[
          styles.partyIconText,
          { color: isInclined ? Colors.text.white : Colors.text.light }
        ]}>
          🪷
        </Text>
      </View>
    );
  };

  const renderVoterCard = (voter: Voter) => {
    const partyStatus = getPartyStatus(voter.partyInclination);
    
    return (
      <View 
        key={voter.id} 
        style={styles.voterCard} 
        testID={`voter-card-${voter.id}`}
      >
        <View style={styles.voterCardHeader}>
          <View style={styles.voterMainInfo}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>{voter.name.charAt(0)}</Text>
            </View>
            <View style={styles.voterBasicInfo}>
              <Text style={styles.voterName}>{voter.name}</Text>
              <Text style={styles.voterSubtitle}>
                {voter.guardianName} • {voter.age}Y • {voter.gender}
              </Text>
            </View>
          </View>
          <View style={styles.partyStatusContainer}>
            <Text style={[styles.partyStatusText, { color: partyStatus.color }]}>
              {partyStatus.label}
            </Text>
            {renderPartyInclinationIcon(voter.partyInclination)}
          </View>
        </View>
        
        <View style={styles.voterDetails}>
          <View style={styles.detailRow}>
            <Grid3X3 size={14} color={Colors.text.secondary} />
            <Text style={styles.detailText}>{voter.voterId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Phone size={14} color={Colors.text.secondary} />
            <Text style={styles.detailText}>{voter.mobileNumber || 'Not available'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🏠</Text>
            <Text style={styles.detailText}>{voter.houseName}, {voter.ward}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText}>{voter.address}, {voter.assemblyConstituency}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👤</Text>
            <Text style={styles.detailText}>{voter.karyakartaName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>Last: {voter.lastInteractionDate} by {voter.karyakartaName}</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              handleVoterSelect(voter);
              handleEdit();
            }}
          >
            <Edit size={16} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton,
              !voter.mobileNumber && styles.disabledActionButton
            ]}
            onPress={() => handleCall(voter.mobileNumber)}
            disabled={!voter.mobileNumber}
          >
            <Phone size={16} color={voter.mobileNumber ? Colors.secondary : Colors.text.light} />
            <Text style={[
              styles.actionButtonText,
              { color: voter.mobileNumber ? Colors.secondary : Colors.text.light }
            ]}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              handleVoterSelect(voter);
              handleHelpDesk();
            }}
          >
            <HelpCircle size={16} color={Colors.accent} />
            <Text style={[styles.actionButtonText, { color: Colors.accent }]}>Apps</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSelectedVoterDetails = () => {
    if (!selectedVoter) return null;

    return (
      <Card style={styles.selectedVoterCard}>
        <View style={styles.selectedVoterHeader}>
          <View style={styles.selectedVoterInfo}>
            <Text style={styles.selectedVoterName}>{selectedVoter.name}</Text>
            <Text style={styles.selectedVoterId}>ID: {selectedVoter.voterId}</Text>
          </View>
          {renderPartyInclinationIcon(selectedVoter.partyInclination)}
        </View>

        <View style={styles.selectedVoterDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Guardian Name:</Text>
            <Text style={styles.detailValue}>{selectedVoter.guardianName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>House Name:</Text>
            <Text style={styles.detailValue}>{selectedVoter.houseName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mobile Number:</Text>
            {isEditing ? (
              <Input
                value={editData.mobileNumber || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, mobileNumber: text }))}
                placeholder="Enter mobile number"
                style={styles.editInput}
              />
            ) : (
              <Text style={styles.detailValue}>{selectedVoter.mobileNumber || 'Not available'}</Text>
            )}
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            {isEditing ? (
              <Input
                value={editData.address || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, address: text }))}
                placeholder="Enter address"
                multiline
                style={styles.editInput}
              />
            ) : (
              <Text style={styles.detailValue}>{selectedVoter.address}</Text>
            )}
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Party Inclination:</Text>
            {isEditing ? (
              <View style={styles.partyInclinationOptions}>
                <TouchableOpacity
                  style={[
                    styles.partyOption,
                    editData.partyInclination === 'BJP' && styles.partyOptionSelected
                  ]}
                  onPress={() => setEditData(prev => ({ ...prev, partyInclination: 'BJP' }))}
                >
                  <Text style={[
                    styles.partyOptionText,
                    editData.partyInclination === 'BJP' && styles.partyOptionTextSelected
                  ]}>BJP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.partyOption,
                    editData.partyInclination === 'Independent' && styles.partyOptionSelected
                  ]}
                  onPress={() => setEditData(prev => ({ ...prev, partyInclination: 'Independent' }))}
                >
                  <Text style={[
                    styles.partyOptionText,
                    editData.partyInclination === 'Independent' && styles.partyOptionTextSelected
                  ]}>Independent</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.detailValue}>{selectedVoter.partyInclination}</Text>
            )}
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Interaction:</Text>
            <Text style={styles.detailValue}>{selectedVoter.lastInteractionDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Karyakarta:</Text>
            <Text style={styles.detailValue}>{selectedVoter.karyakartaName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ward:</Text>
            <Text style={styles.detailValue}>{selectedVoter.ward}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assembly:</Text>
            <Text style={styles.detailValue}>{selectedVoter.assemblyConstituency}</Text>
          </View>
        </View>

        <View style={styles.selectedActionButtons}>
          {isEditing ? (
            <>
              <Button
                title="Cancel"
                onPress={() => setIsEditing(false)}
                variant="outline"
                style={styles.selectedActionButton}
              />
              <Button
                title="Save"
                onPress={handleSaveEdit}
                style={styles.selectedActionButton}
              />
            </>
          ) : (
            <>
              <Button
                title="Edit"
                onPress={handleEdit}
                variant="outline"
                icon={<Edit size={16} color={Colors.primary} />}
                style={styles.selectedActionButton}
              />
              <Button
                title="Call"
                onPress={() => handleCall(selectedVoter.mobileNumber)}
                variant={selectedVoter.mobileNumber ? 'default' : 'outline'}
                disabled={!selectedVoter.mobileNumber}
                icon={<Phone size={16} color={selectedVoter.mobileNumber ? Colors.text.white : Colors.text.light} />}
                style={[
                  styles.selectedActionButton,
                  !selectedVoter.mobileNumber && styles.disabledButton
                ]}
              />
              <Button
                title="Help Desk"
                onPress={handleHelpDesk}
                variant="secondary"
                icon={<HelpCircle size={16} color={Colors.text.white} />}
                style={styles.selectedActionButton}
              />
            </>
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Search Voter',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={Colors.text.light} style={styles.searchIcon} />
              <TextInput
                placeholder="Search by Name, Voter ID, or Mobile..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                testID="search-input"
                placeholderTextColor={Colors.text.light}
              />
              <TouchableOpacity style={styles.micButton}>
                <Mic size={20} color={Colors.text.white} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Recent Searches */}
          {!searchQuery.trim() && (
            <View style={styles.recentSearches}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipsContainer}>
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.recentChip}
                      onPress={() => setSearchQuery(search)}
                    >
                      <Text style={styles.recentChipText}>{search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
          
          {/* Filter Options */}
          {searchQuery.trim() && (
            <View style={styles.filterSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filtersContainer}>
                  {filterOptions.map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      style={[
                        styles.filterChip,
                        selectedFilter === filter && styles.filterChipSelected
                      ]}
                      onPress={() => setSelectedFilter(filter)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        selectedFilter === filter && styles.filterChipTextSelected
                      ]}>
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        {searchQuery.trim() && filteredVoters.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No voters found matching your search</Text>
          </View>
        )}

        {filteredVoters.length > 0 && !selectedVoter && (
          <View style={styles.resultsSection}>
            {filteredVoters.map(renderVoterCard)}
          </View>
        )}
        
        {selectedVoter && (
          <View style={styles.selectedSection}>
            <TouchableOpacity 
              style={styles.backToResults}
              onPress={() => setSelectedVoter(null)}
            >
              <ArrowLeft size={16} color={Colors.primary} />
              <Text style={styles.backToResultsText}>Back to Results</Text>
            </TouchableOpacity>
            {renderSelectedVoterDetails()}
          </View>
        )}
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
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  searchSection: {
    marginBottom: Spacing.lg,
  },
  searchContainer: {
    marginBottom: Spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    ...Shadows.small,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 44,
  },
  micButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  recentSearches: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  recentChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentChipText: {
    ...Typography.caption,
    color: Colors.text.primary,
  },
  filterSection: {
    marginTop: Spacing.md,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    ...Typography.caption,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: Colors.text.white,
  },
  noResults: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  noResultsText: {
    ...Typography.body,
    color: Colors.text.light,
    textAlign: 'center',
  },
  resultsSection: {
    gap: Spacing.md,
  },
  voterCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Shadows.small,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  voterCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg
  },
  voterMainInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: Spacing.md
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    ...Typography.subtitle,
    color: Colors.primary,
    fontWeight: '600',
  },
  voterBasicInfo: {
    flex: 1
  },
  voterName: {
    ...Typography.subtitle,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.text.primary
  },
  voterSubtitle: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: 2
  },
  partyStatusContainer: {
    alignItems: 'flex-end',
    gap: 4
  },
  partyStatusText: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 11
  },
  partyIcon: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyIconText: {
    fontSize: 14,
  },
  voterDetails: {
    gap: 8,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: {
    fontSize: 12,
    width: 16,
  },
  detailText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    flex: 1,
    fontSize: 13
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'transparent',
    minWidth: 60
  },
  disabledActionButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '500',
    fontSize: 11
  },
  selectedSection: {
    marginBottom: Spacing.lg,
  },
  backToResults: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  backToResultsText: {
    ...Typography.body,
    color: Colors.primary,
  },
  selectedVoterCard: {
    padding: Spacing.lg,
  },
  selectedVoterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  selectedVoterInfo: {
    flex: 1,
  },
  selectedVoterName: {
    ...Typography.title,
    marginBottom: Spacing.xs,
  },
  selectedVoterId: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  selectedVoterDetails: {
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },

  detailLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  detailValue: {
    ...Typography.body,
  },
  editInput: {
    marginTop: Spacing.xs,
  },
  partyInclinationOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  partyOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  partyOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  partyOptionText: {
    ...Typography.caption,
    color: Colors.text.primary,
  },
  partyOptionTextSelected: {
    color: Colors.text.white,
  },
  selectedActionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  selectedActionButton: {
    flex: 1,
    minWidth: 100,
  },
  disabledButton: {
    opacity: 0.5,
  },
  selectedDetailRow: {
    gap: Spacing.xs,
  },
});