import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  
  Platform,
  TextInput,
  Image
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Edit, Phone, HelpCircle, ArrowLeft, Grid3X3, MapPin, Calendar, Home, QrCode } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useConfirm } from '@/hooks/useConfirm';
import { useVoterSearch, useAdvancedVoterSearch } from '@/hooks/useApi';
import { Voter as ApiVoter } from '@/lib/api-client';

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

// Helper function to convert API voter to local voter format
const convertApiVoter = (apiVoter: ApiVoter): Voter => ({
  id: apiVoter.id?.toString() || '',
  name: apiVoter.name || '',
  voterId: apiVoter.id_card_no || '',
  mobileNumber: apiVoter.mobile_number || '',
  guardianName: apiVoter.guardian_name || '',
  houseName: apiVoter.house_name || '',
  address: `${apiVoter.address_line1 || ''} ${apiVoter.address_line2 || ''}`.trim(),
  lastInteractionDate: apiVoter.updated_at ? new Date(apiVoter.updated_at).toLocaleDateString() : '',
  karyakartaName: 'Unknown', // Not available in API
  partyInclination: apiVoter.political_inclination || 'Unknown',
  age: apiVoter.age || 0,
  gender: apiVoter.gender || '',
  ward: `Ward ${apiVoter.ward_id || ''}`,
  assemblyConstituency: `Assembly ${apiVoter.assembly_id || ''}`,
});

type SearchVoterScreenProps = { showBack?: boolean };

export default function SearchVoterScreen({ showBack = true }: SearchVoterScreenProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [searchTriggered, setSearchTriggered] = useState<boolean>(false);
  const { colors } = useAppSettings();
  const { confirm } = useConfirm();

  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  
  // API hooks
  const voterSearchQuery = useVoterSearch({
    name: searchQuery.length >= 2 && !searchQuery.match(/^[A-Z0-9]+$/i) ? searchQuery : undefined,
    epic_id: searchQuery.match(/^[A-Z0-9]+$/i) ? searchQuery : undefined,
    limit: 20,
  });
  
  const advancedSearchMutation = useAdvancedVoterSearch();
  
  const recentSearches = ['Priya Nair', 'TVM001234567', 'Arun Pillai'];
  const filterOptions = ['All', 'Party Voter', 'Inclined', 'Neutral', 'Anti'];

  const filteredVoters = useMemo(() => {
    if (!searchQuery.trim() || !voterSearchQuery.data) return [];
    
    // Convert API voters to local format
    let voters = voterSearchQuery.data.data.map(convertApiVoter);
    
    // Apply filter
    if (selectedFilter !== 'All') {
      voters = voters.filter(voter => {
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
    
    return voters;
  }, [voterSearchQuery.data, selectedFilter, searchQuery]);

  const handleVoterSelect = (voter: Voter) => {
    //alert("clicked");
    //setSelectedVoter(voter);
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

  const handleCall = async (phoneNumber: string) => {
    if (!phoneNumber) {
      await confirm({
        title: 'No Phone Number',
        message: 'This voter does not have a phone number on file.',
        confirmText: 'OK',
        cancelText: undefined,
      });
      return;
    }

    const ok = await confirm({
      title: 'Call voter?',
      message: `Call ${phoneNumber}?`,
      confirmText: 'Call',
      cancelText: 'Cancel',
    });
    if (!ok) return;
    
    const phoneUrl = Platform.select({
      ios: `tel:${phoneNumber}`,
      android: `tel:${phoneNumber}`,
      default: `tel:${phoneNumber}`
    });
    
    Linking.openURL(phoneUrl).catch(async () => {
      await confirm({ title: 'Error', message: 'Unable to make phone call', confirmText: 'OK', cancelText: undefined });
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
    const target = voter ?? selectedVoter;
    if (target) {
      router.push({
        pathname: '/help-desk',
        params: { 
          voterId: target.voterId,
          voterName: encodeURIComponent(target.name),
          age: String(target.age ?? ''),
          gender: target.gender ?? ''
        }
      });
    } else {
      router.push('/help-desk');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await confirm({ title: 'Search Required', message: 'Please enter a voter name or ID to search.', confirmText: 'OK', cancelText: undefined });
      return;
    }

    setSearchTriggered(true);
    setIsLoading(true);
    
    try {
      // The useVoterSearch hook will automatically trigger when searchQuery changes
      // For advanced search, we can use the mutation
      if (searchQuery.length >= 3) {
        await advancedSearchMutation.mutateAsync({
          search_criteria: {
            name: {
              value: searchQuery,
              match_type: 'partial',
              case_sensitive: false,
            },
          },
          pagination: {
            page: 1,
            limit: 20,
          },
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarcodePress = async () => {
    if (!cameraPermission) {
      return;
    }

    if (!cameraPermission.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        await confirm({ title: 'Camera Permission', message: 'Camera permission is required to scan barcodes.', confirmText: 'OK', cancelText: undefined });
        return;
      }
    }

    setShowCamera(true);
  };

  const handleBarcodeScanned = (data: string) => {
    setSearchQuery(data);
    setShowCamera(false);
    // Automatically trigger search after scanning
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const styles = createStyles(colors);

  if (showCamera) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        
        {/* Custom Header */}
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => setShowCamera(false)} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan Barcode</Text>
          </View>
        </SafeAreaView>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={'back'}
            onBarcodeScanned={({ data }: { data: string }) => handleBarcodeScanned(data)}
          >
            <View style={styles.cameraOverlay}>
              <View style={[styles.scanFrame, { borderColor: colors.primary }]} />
              <Text style={[styles.scanInstructions, { color: colors.text.white }]}>
                Position the barcode within the frame to scan
              </Text>
            </View>
          </CameraView>
        </View>
      </SafeAreaView>
    );
  }

  const getPartyStatus = (inclination: string) => {
    switch (inclination) {
      case 'BJP':
        return { label: 'Party Voter', color: colors.primary, bgColor: colors.primary + '20' };
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
        { backgroundColor: isInclined ? colors.primary : '#E0E0E0' }
      ]}>
        <Text style={[
          styles.partyIconText,
          { color: isInclined ? colors.text.white : colors.text.light }
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
              <Grid3X3 size={16} color={colors.text.secondary} />
              <Text style={styles.detailValue}>{voter.voterId}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Phone size={16} color={colors.text.secondary} />
              <Text style={styles.detailValue}>{voter.mobileNumber || 'Not available'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Home size={16} color={colors.text.secondary} />
              <Text style={styles.detailValue} numberOfLines={1}>
                {voter.houseName}, {voter.ward}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={16} color={colors.text.secondary} />
              <Text style={styles.detailValue} numberOfLines={1}>
                {voter.address}, {voter.assemblyConstituency}
              </Text>
            </View>
            

            
            <View style={styles.detailRow}>
              <Calendar size={16} color={colors.text.secondary} />
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
              <Edit size={16} color={colors.primary} />
              <Text style={[styles.actionBtnText, { color: colors.primary }]}>Edit</Text>
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
              <Phone size={16} color={voter.mobileNumber ? '#4CAF50' : colors.text.light} />
              <Text style={[
                styles.actionBtnText,
                { color: voter.mobileNumber ? '#4CAF50' : colors.text.light }
              ]}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionBtn, styles.helpDeskBtn]}
              onPress={(e) => {
                e.stopPropagation();
                handleHelpDesk(voter);
              }}
            >
              <HelpCircle size={16} color={colors.primary} />
              <Text style={[styles.actionBtnText, { color: colors.primary }]}>HelpDesk</Text>
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
            icon={<Edit size={16} color={colors.primary} />}
            style={styles.selectedActionButton}
          />
          <Button
            title="Call"
            onPress={() => handleCall(selectedVoter.mobileNumber)}
            variant={selectedVoter.mobileNumber ? 'default' : 'outline'}
            disabled={!selectedVoter.mobileNumber}
            icon={<Phone size={16} color={selectedVoter.mobileNumber ? colors.text.white : colors.text.light} />}
            style={[
              styles.selectedActionButton,
              !selectedVoter.mobileNumber && styles.disabledButton
            ]}
          />
          <Button
            title="HelpDesk"
            onPress={() => handleHelpDesk(selectedVoter)}
            variant="secondary"
            icon={<HelpCircle size={16} color={colors.text.white} />}
            style={styles.selectedActionButton}
          />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
    <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          {showBack && (
            <TouchableOpacity 
              onPress={() => {
                console.log('Search Voter: Back button pressed');
                try {
                  if (router.canGoBack()) {
                    console.log('Going back...');
                    router.back();
                  }
                } catch (error) {
                  console.error('Navigation error:', error);
                }
              }} 
              style={styles.backButton}
              testID="header-back-button"
            >
              <ArrowLeft size={24} color={colors.text.white} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Search Voter</Text>

        </View>
      </SafeAreaView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.text.light} style={styles.searchIcon} />
            <TextInput
              placeholder="Enter Voter ID to search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              testID="search-input"
              placeholderTextColor={colors.text.light}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity 
              style={styles.searchIconButton}
              onPress={handleSearch}
              disabled={isLoading}
            >
              <Search size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.barcodeButton}
              onPress={handleBarcodePress}
            >
              <QrCode size={18} color={colors.text.secondary} />
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

        {/* Loading State */}
        {(voterSearchQuery.isLoading || advancedSearchMutation.isPending || isLoading) && searchQuery.trim() && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>Searching voters...</Text>
          </View>
        )}

        {/* Error State */}
        {(voterSearchQuery.error || advancedSearchMutation.error) && searchQuery.trim() && (
          <View style={styles.noResults}>
            <Text style={[styles.noResultsText, { color: colors.error }]}>
              Search failed. Please try again.
            </Text>
          </View>
        )}

        {/* No Results */}
        {searchQuery.trim() && 
         !voterSearchQuery.isLoading && 
         !advancedSearchMutation.isPending && 
         !isLoading && 
         filteredVoters.length === 0 && 
         !voterSearchQuery.error && 
         !advancedSearchMutation.error && (
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
              <ArrowLeft size={16} color={colors.primary} />
              <Text style={styles.backToResultsText}>Back to Results</Text>
            </TouchableOpacity>
            {renderSelectedVoterDetails()}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
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
    color: colors.text.white,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },

  bjpLogo: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: colors.text.white,
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
    backgroundColor: colors.background,
  },
  searchSection: {
    padding: Spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...Shadows.small,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 50,
    height: 50,
    textAlignVertical: 'center',
  },
  barcodeButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIconButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: BorderRadius.md,
    backgroundColor: 'transparent',
  },
  scanInstructions: {
    color: colors.text.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  filterSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  filterChip: {
    backgroundColor: colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...Typography.caption,
    color: colors.text.primary,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: colors.text.white,
  },
  recentSearches: {
    padding: Spacing.md,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: colors.text.primary,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  recentChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  recentChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentChipText: {
    ...Typography.caption,
    color: colors.text.primary,
  },
  noResults: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  noResultsText: {
    ...Typography.body,
    color: colors.text.light,
    textAlign: 'center',
  },
  resultsSection: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  voterCard: {
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text.primary,
    marginBottom: 2,
  },
  voterGuardian: {
    fontSize: 13,
    color: colors.text.secondary,
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
    color: colors.text.primary,
    flex: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.text.light + '10',
    borderColor: colors.text.light + '30',
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
    color: colors.primary,
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
    borderBottomColor: colors.border,
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
    color: colors.text.secondary,
  },
  selectedVoterDetails: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    backgroundColor: colors.background,
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
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  selectedProfileInitial: {
    ...Typography.title,
    color: colors.primary,
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
    color: colors.text.secondary,
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
    color: colors.text.secondary,
    fontWeight: '700',
    marginHorizontal: Spacing.xs,
    width: 12,
    fontSize: 14,
    textAlign: 'center',
    flexShrink: 0,
  },
  inlineDetailValue: {
    ...Typography.body,
    color: colors.text.primary,
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
    color: colors.text.secondary,
    fontWeight: '600',
  },
  selectedDetailValue: {
    ...Typography.body,
    color: colors.text.primary,
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
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
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
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  partyOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  partyOptionText: {
    ...Typography.caption,
    color: colors.text.primary,
  },
  partyOptionTextSelected: {
    color: colors.text.white,
  },
  selectedActionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedActionButton: {
    flex: 1,
    minWidth: 100,
  },
  disabledButton: {
    opacity: 0.5,
  },
});