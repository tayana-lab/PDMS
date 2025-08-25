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
import { Search, Edit, Phone, HelpCircle, ArrowLeft, Mic, Grid3X3, MapPin, Calendar, Home, Briefcase } from 'lucide-react-native';

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

  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  
  const recentSearches = ['Priya Nair', 'TVM001234567', 'Arun Pillai'];
  const filterOptions = ['All', 'Party Voter', 'Inclined', 'Neutral', 'Anti'];

  const filteredVoters = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    
    let filtered = mockVoters.filter(voter => {
      // Search in multiple fields for better results
      const searchFields = [
        voter.name.toLowerCase(),
        voter.voterId.toLowerCase(),
        voter.mobileNumber.toLowerCase(),
        voter.guardianName.toLowerCase(),
        voter.houseName.toLowerCase(),
        voter.address.toLowerCase(),
        voter.ward.toLowerCase(),
        voter.assemblyConstituency.toLowerCase(),
        voter.karyakartaName.toLowerCase(),
        voter.age.toString(),
        voter.gender.toLowerCase()
      ];
      
      // Check if query matches any field (partial match)
      return searchFields.some(field => field.includes(query));
    });
    
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
    
    // Sort results by relevance (exact name matches first, then partial matches)
    return filtered.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().startsWith(query);
      const bNameMatch = b.name.toLowerCase().startsWith(query);
      const aVoterIdMatch = a.voterId.toLowerCase().startsWith(query);
      const bVoterIdMatch = b.voterId.toLowerCase().startsWith(query);
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      if (aVoterIdMatch && !bVoterIdMatch) return -1;
      if (!aVoterIdMatch && bVoterIdMatch) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedFilter]);

  const handleVoterSelect = (voter: Voter) => {
    //alert("clicked");
    //setSelectedVoter(voter);
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

  const handleEdit = (voter?: Voter) => {
    if (voter) {
      router.push({
        pathname: '/edit-voter',
        params: { voterId: voter.id }
      });
    } else if (selectedVoter) {
      router.push({
        pathname: '/edit-voter',
        params: { voterId: selectedVoter.id }
      });
    }
  };



  const handleHelpDesk = (voter?: Voter) => {
    router.push('/help-desk');
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
      <TouchableOpacity 
        key={voter.id} 
        style={styles.voterCard} 
        testID={`voter-card-${voter.id}`}
        onPress={() => handleVoterSelect(voter)}
      >
        <View style={styles.voterCardContent}>
          {/* Header with Profile and Status */}
          <View style={styles.voterHeader}>
            <View style={styles.profileSection}>
              <View style={styles.profileImage}>
                <Text style={styles.profileInitial}>{voter.name.charAt(0)}</Text>
              </View>
              <View style={styles.voterBasicInfo}>
                <Text style={styles.voterName}>{voter.name}</Text>
                <Text style={styles.voterGuardian}>{voter.guardianName} • {voter.age}Y • {voter.gender}</Text>
              </View>
            </View>
            <View style={[styles.partyStatusBadge, { backgroundColor: partyStatus.bgColor }]}>
              <Text style={[styles.partyStatusText, { color: partyStatus.color }]}>
                {partyStatus.label}
              </Text>
            </View>
          </View>

          {/* Voter Details */}
          <View style={styles.voterDetails}>
            <View style={styles.detailRow}>
              <Grid3X3 size={16} color={Colors.text.secondary} />
              <Text style={styles.detailValue}>{voter.voterId}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Phone size={16} color={Colors.text.secondary} />
              <Text style={styles.detailValue}>{voter.mobileNumber || 'Not available'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Home size={16} color={Colors.text.secondary} />
              <Text style={styles.detailValue} numberOfLines={1}>
                {voter.houseName}, {voter.ward}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={16} color={Colors.text.secondary} />
              <Text style={styles.detailValue} numberOfLines={1}>
                {voter.address}, {voter.assemblyConstituency}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Briefcase size={16} color={Colors.text.secondary} />
              <Text style={styles.detailValue}>Business</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Calendar size={16} color={Colors.text.secondary} />
              <Text style={styles.detailValue}>Last: {voter.lastInteractionDate} by {voter.karyakartaName}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.editBtn]}
              onPress={(e) => {
                e.stopPropagation();
                handleEdit(voter);
              }}
            >
              <Edit size={16} color={Colors.primary} />
              <Text style={[styles.actionBtnText, { color: Colors.primary }]}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.actionBtn, 
                styles.callBtn,
                !voter.mobileNumber && styles.disabledBtn
              ]}
              onPress={(e) => {
                e.stopPropagation();
                handleCall(voter.mobileNumber);
              }}
              disabled={!voter.mobileNumber}
            >
              <Phone size={16} color={voter.mobileNumber ? '#4CAF50' : Colors.text.light} />
              <Text style={[
                styles.actionBtnText,
                { color: voter.mobileNumber ? '#4CAF50' : Colors.text.light }
              ]}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionBtn, styles.helpDeskBtn]}
              onPress={(e) => {
                e.stopPropagation();
                handleHelpDesk(voter);
              }}
            >
              <HelpCircle size={16} color={Colors.primary} />
              <Text style={[styles.actionBtnText, { color: Colors.primary }]}>HelpDesk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSelectedVoterDetails = () => {
    if (!selectedVoter) return null;

    return (
      <Card style={styles.selectedVoterCard}>
        {/* Header with Photo and Basic Info */}
        <View style={styles.selectedVoterHeader}>
          <View style={styles.selectedProfileImage}>
            <Text style={styles.selectedProfileInitial}>{selectedVoter.name.charAt(0)}</Text>
          </View>
          <View style={styles.selectedVoterInfo}>
            <Text style={styles.selectedVoterName}>{selectedVoter.name}</Text>
            <Text style={styles.selectedVoterId}>S/O: {selectedVoter.guardianName}</Text>
          </View>
          {renderPartyInclinationIcon(selectedVoter.partyInclination)}
        </View>

        {/* Compact Inline Row Format Details */}
        <View style={styles.selectedVoterDetails}>
          <View style={styles.inlineDetailRow}>
            <Text style={styles.inlineDetailLabel}>VOTER ID</Text>
            <Text style={styles.inlineDetailSeparator}>:</Text>
            <Text style={styles.inlineDetailValue}>{selectedVoter.voterId}</Text>
          </View>
          
          <View style={styles.inlineDetailRow}>
            <Text style={styles.inlineDetailLabel}>NAME</Text>
            <Text style={styles.inlineDetailSeparator}>:</Text>
            <Text style={styles.inlineDetailValue}>{selectedVoter.name}</Text>
          </View>
          
          <View style={styles.inlineDetailRow}>
            <Text style={styles.inlineDetailLabel}>AGE / GENDER</Text>
            <Text style={styles.inlineDetailSeparator}>:</Text>
            <Text style={styles.inlineDetailValue}>{selectedVoter.age} {selectedVoter.gender}</Text>
          </View>
          
          <View style={styles.inlineDetailRow}>
            <Text style={styles.inlineDetailLabel}>CONSTITUENCY</Text>
            <Text style={styles.inlineDetailSeparator}>:</Text>
            <Text style={styles.inlineDetailValue}>{selectedVoter.assemblyConstituency}</Text>
          </View>
          
          <View style={styles.inlineDetailRow}>
            <Text style={styles.inlineDetailLabel}>MOBILE</Text>
            <Text style={styles.inlineDetailSeparator}>:</Text>
            <Text style={styles.inlineDetailValue}>{selectedVoter.mobileNumber || 'Not available'}</Text>
          </View>
          
          <View style={styles.inlineDetailRow}>
            <Text style={styles.inlineDetailLabel}>GUARDIAN</Text>
            <Text style={styles.inlineDetailSeparator}>:</Text>
            <Text style={styles.inlineDetailValue}>{selectedVoter.guardianName}</Text>
          </View>
          
          <View style={styles.inlineDetailRow}>
            <Text style={styles.inlineDetailLabel}>HOUSE NAME</Text>
            <Text style={styles.inlineDetailSeparator}>:</Text>
            <Text style={styles.inlineDetailValue}>{selectedVoter.houseName}</Text>
          </View>
          
          <View style={styles.inlineDetailRow}>
            <Text style={styles.inlineDetailLabel}>ADDRESS</Text>
            <Text style={styles.inlineDetailSeparator}>:</Text>
            <Text style={styles.inlineDetailValue}>{selectedVoter.address}</Text>
          </View>
          
          <View style={styles.inlineDetailRow}>
            <Text style={styles.inlineDetailLabel}>WARD</Text>
            <Text style={styles.inlineDetailSeparator}>:</Text>
            <Text style={styles.inlineDetailValue}>{selectedVoter.ward}</Text>
          </View>
          
          <View style={styles.inlineDetailRow}>
            <Text style={styles.inlineDetailLabel}>PARTY STATUS</Text>
            <Text style={styles.inlineDetailSeparator}>:</Text>
            <Text style={styles.inlineDetailValue}>{selectedVoter.partyInclination}</Text>
          </View>
          
          <View style={styles.inlineDetailRow}>
            <Text style={styles.inlineDetailLabel}>KARYAKARTA</Text>
            <Text style={styles.inlineDetailSeparator}>:</Text>
            <Text style={styles.inlineDetailValue}>{selectedVoter.karyakartaName}</Text>
          </View>
          
          <View style={styles.inlineDetailRow}>
            <Text style={styles.inlineDetailLabel}>LAST CONTACT</Text>
            <Text style={styles.inlineDetailSeparator}>:</Text>
            <Text style={styles.inlineDetailValue}>{selectedVoter.lastInteractionDate}</Text>
          </View>
        </View>

        <View style={styles.selectedActionButtons}>
          <Button
            title="Edit"
            onPress={() => handleEdit()}
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
            title="HelpDesk"
            onPress={() => handleHelpDesk(selectedVoter)}
            variant="secondary"
            icon={<HelpCircle size={16} color={Colors.text.white} />}
            style={styles.selectedActionButton}
          />
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
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: Colors.text.primary,
          },
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
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
              <Mic size={18} color={Colors.text.white} />
            </TouchableOpacity>
          </View>
        </View>

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

        {/* Recent Searches */}
        {!searchQuery.trim() && (
          <View style={styles.recentSearches}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.recentChipsContainer}>
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
          </View>
        )}

        {/* No Results */}
        {searchQuery.trim() && filteredVoters.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No voters found matching your search</Text>
          </View>
        )}

        {/* Search Results */}
        {filteredVoters.length > 0 && !selectedVoter && (
          <View style={styles.resultsSection}>
            {filteredVoters.map(renderVoterCard)}
          </View>
        )}
        
        {/* Selected Voter Details */}
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
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchSection: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
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
    minHeight: 48,
  },
  micButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  filterSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  filterChip: {
    backgroundColor: Colors.background,
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
  recentSearches: {
    padding: Spacing.md,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  recentChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    padding: Spacing.md,
    gap: Spacing.md,
  },
  voterCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  voterCardContent: {
    padding: Spacing.md,
  },
  voterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.round,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  voterBasicInfo: {
    flex: 1,
  },
  voterName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  voterGuardian: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  partyStatusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  partyStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  voterDetails: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: Spacing.sm,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: 4,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editBtn: {
    backgroundColor: '#E3F2FD',
    borderColor: '#BBDEFB',
  },
  callBtn: {
    backgroundColor: '#E8F5E8',
    borderColor: '#C8E6C9',
  },
  helpDeskBtn: {
    backgroundColor: '#E3F2FD',
    borderColor: '#BBDEFB',
  },
  disabledBtn: {
    opacity: 0.5,
    backgroundColor: Colors.text.light + '10',
    borderColor: Colors.text.light + '30',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
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
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  selectedVoterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
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
  selectedProfileImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  selectedProfileInitial: {
    ...Typography.title,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 28,
  },
  inlineDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    minHeight: 24,
    paddingVertical: 4,
    paddingHorizontal: Spacing.xs,
  },
  inlineDetailLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    width: 110,
    letterSpacing: 0.5,
    textAlign: 'left',
    flexShrink: 0,
  },
  inlineDetailSeparator: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontWeight: '700',
    marginHorizontal: Spacing.xs,
    width: 12,
    fontSize: 14,
    textAlign: 'center',
    flexShrink: 0,
  },
  inlineDetailValue: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '500',
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  selectedDetailRow: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  selectedDetailLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  selectedDetailValue: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  editInput: {
    marginTop: Spacing.xs,
  },
  editInputInline: {
    flex: 1,
    marginLeft: 0,
    paddingVertical: 4,
    paddingHorizontal: Spacing.xs,
    fontSize: 14,
    minHeight: 20,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  partyInclinationOptions: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flex: 1,
  },
  partyOption: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
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
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  selectedActionButton: {
    flex: 1,
    minWidth: 100,
  },
  disabledButton: {
    opacity: 0.5,
  },
});