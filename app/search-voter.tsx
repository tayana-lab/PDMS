import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Edit, Phone, HelpCircle, ArrowLeft } from 'lucide-react-native';
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

  const filteredVoters = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return mockVoters.filter(voter => 
      voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voter.voterId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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

  const renderVoterCard = (voter: Voter) => (
    <TouchableOpacity
      key={voter.id}
      style={styles.voterCard}
      onPress={() => handleVoterSelect(voter)}
      testID={`voter-card-${voter.id}`}
    >
      <View style={styles.voterCardHeader}>
        <View style={styles.voterInfo}>
          <Text style={styles.voterName}>{voter.name}</Text>
          <Text style={styles.voterId}>ID: {voter.voterId}</Text>
        </View>
        {renderPartyInclinationIcon(voter.partyInclination)}
      </View>
      
      <View style={styles.voterDetails}>
        <Text style={styles.detailText}>Guardian: {voter.guardianName}</Text>
        <Text style={styles.detailText}>House: {voter.houseName}</Text>
        <Text style={styles.detailText}>Mobile: {voter.mobileNumber || 'Not available'}</Text>
        <Text style={styles.detailText}>Last Contact: {voter.lastInteractionDate}</Text>
        <Text style={styles.detailText}>Karyakarta: {voter.karyakartaName}</Text>
      </View>
    </TouchableOpacity>
  );

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

        <View style={styles.actionButtons}>
          {isEditing ? (
            <>
              <Button
                title="Cancel"
                onPress={() => setIsEditing(false)}
                variant="outline"
                style={styles.actionButton}
              />
              <Button
                title="Save"
                onPress={handleSaveEdit}
                style={styles.actionButton}
              />
            </>
          ) : (
            <>
              <Button
                title="Edit"
                onPress={handleEdit}
                variant="outline"
                icon={<Edit size={16} color={Colors.primary} />}
                style={styles.actionButton}
              />
              <Button
                title="Call"
                onPress={() => handleCall(selectedVoter.mobileNumber)}
                variant={selectedVoter.mobileNumber ? 'default' : 'outline'}
                disabled={!selectedVoter.mobileNumber}
                icon={<Phone size={16} color={selectedVoter.mobileNumber ? Colors.text.white : Colors.text.light} />}
                style={[
                  styles.actionButton,
                  !selectedVoter.mobileNumber && styles.disabledButton
                ]}
              />
              <Button
                title="Help Desk"
                onPress={handleHelpDesk}
                variant="secondary"
                icon={<HelpCircle size={16} color={Colors.text.white} />}
                style={styles.actionButton}
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
          <Input
            placeholder="Search by name or voter ID"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            testID="search-input"
          />
        </View>

        {searchQuery.trim() && filteredVoters.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No voters found matching your search</Text>
          </View>
        )}

        {filteredVoters.length > 0 && !selectedVoter && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Search Results ({filteredVoters.length})</Text>
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
  searchInput: {
    marginBottom: 0,
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
    marginBottom: Spacing.lg,
  },
  resultsTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.md,
  },
  voterCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  voterCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  voterInfo: {
    flex: 1,
  },
  voterName: {
    ...Typography.subtitle,
    marginBottom: Spacing.xs,
  },
  voterId: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  partyIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyIconText: {
    fontSize: 20,
  },
  voterDetails: {
    gap: Spacing.xs,
  },
  detailText: {
    ...Typography.caption,
    color: Colors.text.secondary,
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
  detailRow: {
    gap: Spacing.xs,
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
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
  },
  disabledButton: {
    opacity: 0.5,
  },
});