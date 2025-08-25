import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, MapPin, User, Phone, Home } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
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

export default function EditVoterScreen() {
  const { voterId } = useLocalSearchParams<{ voterId: string }>();
  const [voter, setVoter] = useState<Voter | null>(null);
  const [editData, setEditData] = useState<Partial<Voter>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (voterId) {
      const foundVoter = mockVoters.find(v => v.id === voterId);
      if (foundVoter) {
        setVoter(foundVoter);
        setEditData({
          mobileNumber: foundVoter.mobileNumber,
          address: foundVoter.address,
          partyInclination: foundVoter.partyInclination,
          houseName: foundVoter.houseName
        });
      }
    }
  }, [voterId]);

  const handleSave = async () => {
    if (!voter) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving voter data:', {
        voterId: voter.id,
        updates: editData,
        timestamp: new Date().toISOString(),
        location: 'GPS coordinates would be captured here'
      });
      
      Alert.alert(
        'Success',
        'Voter information updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch {
      Alert.alert('Error', 'Failed to update voter information. Please try again.');
    } finally {
      setIsLoading(false);
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

  if (!voter) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Voter</Text>
            <View style={styles.bjpLogo}>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/200px-Bharatiya_Janata_Party_logo.svg.png' }}
                style={styles.bjpLogoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </SafeAreaView>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Voter not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Voter</Text>
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
        <Card style={styles.voterCard}>
          {/* Header with Photo and Basic Info */}
          <View style={styles.voterHeader}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>{voter.name.charAt(0)}</Text>
            </View>
            <View style={styles.voterInfo}>
              <Text style={styles.voterName}>{voter.name}</Text>
              <Text style={styles.voterMeta}>S/O: {voter.guardianName}</Text>
              <Text style={styles.voterMeta}>{voter.age}Y {voter.gender}</Text>
            </View>
            {renderPartyInclinationIcon(voter.partyInclination)}
          </View>

          {/* Read-only Information */}
          <View style={styles.readOnlySection}>
            <Text style={styles.sectionTitle}>Voter Information</Text>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>VOTER ID</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter.voterId}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>NAME</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter.name}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>AGE / GENDER</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter.age} {voter.gender}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>CONSTITUENCY</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter.assemblyConstituency}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>GUARDIAN</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter.guardianName}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>WARD</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter.ward}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>KARYAKARTA</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter.karyakartaName}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>LAST CONTACT</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter.lastInteractionDate}</Text>
            </View>
          </View>

          {/* Editable Fields */}
          <View style={styles.editableSection}>
            <Text style={styles.sectionTitle}>Editable Information</Text>
            
            {/* Mobile Number */}
            <View style={styles.editFieldContainer}>
              <View style={styles.fieldHeader}>
                <Phone size={16} color={Colors.primary} />
                <Text style={styles.fieldLabel}>Mobile Number</Text>
              </View>
              <TextInput
                value={editData.mobileNumber || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, mobileNumber: text }))}
                placeholder="Enter mobile number"
                style={styles.editInput}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            
            {/* House Name */}
            <View style={styles.editFieldContainer}>
              <View style={styles.fieldHeader}>
                <Home size={16} color={Colors.primary} />
                <Text style={styles.fieldLabel}>House Name</Text>
              </View>
              <TextInput
                value={editData.houseName || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, houseName: text }))}
                placeholder="Enter house name"
                style={styles.editInput}
              />
            </View>
            
            {/* Address */}
            <View style={styles.editFieldContainer}>
              <View style={styles.fieldHeader}>
                <MapPin size={16} color={Colors.primary} />
                <Text style={styles.fieldLabel}>Address</Text>
              </View>
              <TextInput
                value={editData.address || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, address: text }))}
                placeholder="Enter complete address"
                style={[styles.editInput, styles.multilineInput]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            {/* Party Inclination */}
            <View style={styles.editFieldContainer}>
              <View style={styles.fieldHeader}>
                <User size={16} color={Colors.primary} />
                <Text style={styles.fieldLabel}>Party Inclination</Text>
              </View>
              <View style={styles.partyInclinationOptions}>
                {['BJP', 'Inclined', 'Neutral', 'Anti'].map((option) => {
                  const isSelected = editData.partyInclination === option;
                  const partyStatus = getPartyStatus(option);
                  
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.partyOption,
                        isSelected && { 
                          backgroundColor: partyStatus.color,
                          borderColor: partyStatus.color 
                        }
                      ]}
                      onPress={() => setEditData(prev => ({ ...prev, partyInclination: option }))}
                    >
                      <Text style={[
                        styles.partyOptionText,
                        isSelected && { color: Colors.text.white }
                      ]}>
                        {partyStatus.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title={isLoading ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              disabled={isLoading}
              icon={<Save size={16} color={Colors.text.white} />}
              style={styles.actionButton}
            />
          </View>
        </Card>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.title,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  voterCard: {
    margin: Spacing.md,
    padding: Spacing.lg,
  },
  voterHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileImage: {
    width: 64,
    height: 64,
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
    fontSize: 28,
  },
  voterInfo: {
    flex: 1,
  },
  voterName: {
    ...Typography.title,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  voterMeta: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  partyIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyIconText: {
    fontSize: 16,
  },
  readOnlySection: {
    marginBottom: Spacing.lg,
  },
  editableSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.text.primary,
    fontWeight: '700',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inlineDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    minHeight: 24,
    paddingVertical: 4,
  },
  inlineDetailLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    width: 120,
    letterSpacing: 0.5,
    textAlign: 'left',
  },
  inlineDetailSeparator: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontWeight: '700',
    marginHorizontal: Spacing.sm,
    width: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  inlineDetailValue: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '500',
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
  editFieldContainer: {
    marginBottom: Spacing.lg,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  fieldLabel: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  editInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: Spacing.sm,
  },
  partyInclinationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  partyOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    minWidth: 80,
    alignItems: 'center',
  },
  partyOptionText: {
    ...Typography.caption,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    flex: 1,
  },
});