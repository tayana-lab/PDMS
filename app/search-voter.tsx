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
  TextInput,
  Image
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Edit, Phone, HelpCircle, ArrowLeft, Mic, Grid3X3, MapPin, User, Calendar } from 'lucide-react-native';
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
      <TouchableOpacity 
        key={voter.id} 
        style={styles.voterCard} 
        testID={`voter-card-${voter.id}`}
        onPress={() => handleVoterSelect(voter)}
      >
        <View style={styles.voterCardContent}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>{voter.name.charAt(0)}</Text>
            </View>
            <View style={styles.voterInfo}>
              <Text style={styles.voterName}>{voter.name}</Text>
              <View style={styles.voterMetaRow}>
                <Text style={styles.voterMeta}>S/O: {voter.guardianName}</Text>
              </View>
              <View style={styles.voterMetaRow}>
                <Text style={styles.voterMeta}>{voter.age}Y • {voter.gender}</Text>
              </View>
            </View>
            <View style={styles.partyStatusBadge}>
              <View style={[styles.statusIndicator, { backgroundColor: partyStatus.color }]} />
            </View>
          </View>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <Grid3X3 size={14} color={Colors.text.secondary} />
                <Text style={styles.detailLabel}>Voter ID</Text>
              </View>
              <Text style={styles.detailValue}>{voter.voterId}</Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <Phone size={14} color={Colors.text.secondary} />
                <Text style={styles.detailLabel}>Mobile</Text>
              </View>
              <Text style={styles.detailValue}>{voter.mobileNumber || 'Not available'}</Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <MapPin size={14} color={Colors.text.secondary} />
                <Text style={styles.detailLabel}>Address</Text>
              </View>
              <Text style={styles.detailValue} numberOfLines={2}>
                {voter.houseName}, {voter.ward}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <User size={14} color={Colors.text.secondary} />
                <Text style={styles.detailLabel}>Karyakarta</Text>
              </View>
              <Text style={styles.detailValue}>{voter.karyakartaName}</Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <Calendar size={14} color={Colors.text.secondary} />
                <Text style={styles.detailLabel}>Last Contact</Text>
              </View>
              <Text style={styles.detailValue}>{voter.lastInteractionDate}</Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailIcon}>🏛️</Text>
                <Text style={styles.detailLabel}>Assembly</Text>
              </View>
              <Text style={styles.detailValue}>{voter.assemblyConstituency}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.editBtn]}
              onPress={(e) => {
                e.stopPropagation();
                handleVoterSelect(voter);
                handleEdit();
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
              <Phone size={16} color={voter.mobileNumber ? Colors.secondary : Colors.text.light} />
              <Text style={[
                styles.actionBtnText,
                { color: voter.mobileNumber ? Colors.secondary : Colors.text.light }
              ]}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionBtn, styles.appsBtn]}
              onPress={(e) => {
                e.stopPropagation();
                handleVoterSelect(voter);
                handleHelpDesk();
              }}
            >
              <HelpCircle size={16} color={Colors.accent} />
              <Text style={[styles.actionBtnText, { color: Colors.accent }]}>Apps</Text>
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
        <View style={styles.selectedVoterHeader}>
          <View style={styles.selectedVoterInfo}>
            <Text style={styles.selectedVoterName}>{selectedVoter.name}</Text>
            <Text style={styles.selectedVoterId}>ID: {selectedVoter.voterId}</Text>
          </View>
          {renderPartyInclinationIcon(selectedVoter.partyInclination)}
        </View>

        <View style={styles.selectedVoterDetails}>
          <View style={styles.selectedDetailRow}>
            <Text style={styles.selectedDetailLabel}>Guardian Name:</Text>
            <Text style={styles.selectedDetailValue}>{selectedVoter.guardianName}</Text>
          </View>
          
          <View style={styles.selectedDetailRow}>
            <Text style={styles.selectedDetailLabel}>House Name:</Text>
            <Text style={styles.selectedDetailValue}>{selectedVoter.houseName}</Text>
          </View>
          
          <View style={styles.selectedDetailRow}>
            <Text style={styles.selectedDetailLabel}>Mobile Number:</Text>
            {isEditing ? (
              <Input
                value={editData.mobileNumber || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, mobileNumber: text }))}
                placeholder="Enter mobile number"
                style={styles.editInput}
              />
            ) : (
              <Text style={styles.selectedDetailValue}>{selectedVoter.mobileNumber || 'Not available'}</Text>
            )}
          </View>
          
          <View style={styles.selectedDetailRow}>
            <Text style={styles.selectedDetailLabel}>Address:</Text>
            {isEditing ? (
              <Input
                value={editData.address || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, address: text }))}
                placeholder="Enter address"
                multiline
                style={styles.editInput}
              />
            ) : (
              <Text style={styles.selectedDetailValue}>{selectedVoter.address}</Text>
            )}
          </View>
          
          <View style={styles.selectedDetailRow}>
            <Text style={styles.selectedDetailLabel}>Party Inclination:</Text>
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
              <Text style={styles.selectedDetailValue}>{selectedVoter.partyInclination}</Text>
            )}
          </View>
          
          <View style={styles.selectedDetailRow}>
            <Text style={styles.selectedDetailLabel}>Last Interaction:</Text>
            <Text style={styles.selectedDetailValue}>{selectedVoter.lastInteractionDate}</Text>
          </View>
          
          <View style={styles.selectedDetailRow}>
            <Text style={styles.selectedDetailLabel}>Karyakarta:</Text>
            <Text style={styles.selectedDetailValue}>{selectedVoter.karyakartaName}</Text>
          </View>
          
          <View style={styles.selectedDetailRow}>
            <Text style={styles.selectedDetailLabel}>Ward:</Text>
            <Text style={styles.selectedDetailValue}>{selectedVoter.ward}</Text>
          </View>
          
          <View style={styles.selectedDetailRow}>
            <Text style={styles.selectedDetailLabel}>Assembly:</Text>
            <Text style={styles.selectedDetailValue}>{selectedVoter.assemblyConstituency}</Text>
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
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Custom Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Voter</Text>
          <View style={styles.bjpLogo}>
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/200px-Bharatiya_Janata_Party_logo.svg.png' }}
              style={styles.bjpLogoImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </SafeAreaView>
      
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },
  backButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  headerTitle: {
    ...Typography.title,
    color: Colors.text.white,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  bjpLogo: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.text.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  bjpLogoImage: {
    width: 24,
    height: 24,
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
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  voterCardContent: {
    padding: Spacing.lg,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  profileInitial: {
    ...Typography.title,
    color: Colors.primary,
    fontWeight: '700',
  },
  voterInfo: {
    flex: 1,
  },
  voterName: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  voterMetaRow: {
    marginBottom: 2,
  },
  voterMeta: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontSize: 13,
  },
  partyStatusBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.round,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  detailItem: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontWeight: '600',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  detailValue: {
    ...Typography.body,
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  detailIcon: {
    fontSize: 12,
    width: 14,
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
    borderWidth: 1,
  },
  editBtn: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary + '30',
  },
  callBtn: {
    backgroundColor: Colors.secondary + '10',
    borderColor: Colors.secondary + '30',
  },
  appsBtn: {
    backgroundColor: Colors.accent + '10',
    borderColor: Colors.accent + '30',
  },
  disabledBtn: {
    opacity: 0.5,
    backgroundColor: Colors.text.light + '10',
    borderColor: Colors.text.light + '30',
  },
  actionBtnText: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 12,
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
});