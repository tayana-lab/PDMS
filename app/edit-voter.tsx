import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,

} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, MapPin, Phone, Camera, Building } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useUpdateVoter, useVoter } from '@/hooks/useApi';
import { Voter } from '@/lib/api-client';

export default function EditVoterScreen() {
  const { voterId } = useLocalSearchParams<{ voterId: string }>();
  const [editData, setEditData] = useState<{
    mobile_number?: string;
    address_line1?: string;
    political_inclination?: string;
    occupation?: string;
  }>({});
  const { colors } = useAppSettings();
  
  // Use API hooks
  const voterQuery = useVoter(Number(voterId));
  const updateVoterMutation = useUpdateVoter();
  
  const voter = voterQuery.data;
  const isLoading = updateVoterMutation.isPending;

  useEffect(() => {
    if (voter) {
      console.log('Found voter:', voter);
      console.log('Voter data structure:', {
        mobile_number: voter.mobile_number,
        address_line1: voter.address_line1,
        political_inclination: voter.political_inclination,
        occupation: voter.occupation
      });
      
      setEditData({
        mobile_number: voter.mobile_number || '',
        address_line1: voter.address_line1 || '',
        political_inclination: voter.political_inclination || '',
        occupation: voter.occupation || ''
      });
    }
  }, [voter]);

  const handleSave = async () => {
    if (!voter || !voter.id) return;
    
    try {
      console.log('Saving voter data:', {
        voterId: voter.id,
        updates: editData,
        timestamp: new Date().toISOString(),
        location: 'GPS coordinates would be captured here'
      });
      
      await updateVoterMutation.mutateAsync({
        id: voter.id!,
        voter: {
          ...voter,
          mobile_number: editData.mobile_number,
          address_line1: editData.address_line1,
          political_inclination: editData.political_inclination,
          occupation: editData.occupation,
          updated_at: new Date().toISOString()
        }
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
    } catch (error) {
      console.error('Update voter error:', error);
      Alert.alert('Error', 'Failed to update voter information. Please try again.');
    }
  };

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



  const styles = createStyles(colors);

  if (voterQuery.isLoading || voterQuery.isFetching) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => {
                console.log('Edit Voter: Back button pressed (loading case)');
                try {
                  if (router.canGoBack()) {
                    console.log('Going back...');
                    router.back();
                  } else {
                    console.log('Cannot go back, replacing with tabs...');
                    router.replace('/(tabs)');
                  }
                } catch (error) {
                  console.error('Navigation error:', error);
                  router.replace('/(tabs)');
                }
              }} 
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colors.text.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Voter</Text>
          </View>
        </SafeAreaView>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loading voter information...</Text>
        </View>
      </View>
    );
  }
  
  if (voterQuery.isError || (!voter && !voterQuery.isLoading)) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => {
                console.log('Edit Voter: Back button pressed (not found case)');
                try {
                  if (router.canGoBack()) {
                    console.log('Going back...');
                    router.back();
                  } else {
                    console.log('Cannot go back, replacing with tabs...');
                    router.replace('/(tabs)');
                  }
                } catch (error) {
                  console.error('Navigation error:', error);
                  router.replace('/(tabs)');
                }
              }} 
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colors.text.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Voter</Text>
            
          </View>
        </SafeAreaView>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {voterQuery.isError ? `Error: ${voterQuery.error?.message || 'Failed to load voter'}` : 'Voter not found'}
          </Text>
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
          <TouchableOpacity 
            onPress={() => {
              console.log('Edit Voter: Back button pressed');
              try {
                if (router.canGoBack()) {
                  console.log('Going back...');
                  router.back();
                } else {
                  console.log('Cannot go back, replacing with tabs...');
                  router.replace('/(tabs)');
                }
              } catch (error) {
                console.error('Navigation error:', error);
                router.replace('/(tabs)');
              }
            }} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Voter</Text>
      
        </View>
      </SafeAreaView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.voterCard}>
          {/* Header with Photo and Basic Info */}
          <View style={styles.voterHeader}>
            <View style={styles.profileSection}>
              <TouchableOpacity style={styles.profileImageContainer}>
                <View style={styles.profileImage}>
                  <Text style={styles.profileInitial}>{voter?.name?.charAt(0) || 'V'}</Text>
                </View>
                <TouchableOpacity style={styles.cameraButton}>
                  <Camera size={16} color={colors.text.white} />
                </TouchableOpacity>
              </TouchableOpacity>
              <View style={styles.voterInfo}>
                <Text style={styles.voterName}>{voter?.name || 'N/A'}</Text>
                <Text style={styles.voterMeta}>{voter?.id_card_no || 'N/A'}</Text>
                <Text style={styles.voterMeta}>{voter?.age || 0}Y • {voter?.gender || 'N/A'}</Text>
              </View>
            </View>
            
          </View>

          {/* Read-only Information */}
          <View style={styles.readOnlySection}>
            <Text style={styles.sectionTitle}>Voter Information</Text>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>GUARDIAN NAME</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter?.guardian_name || 'N/A'}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>HOUSE NUMBER</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter?.house_no || 'H-123'}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>HOUSE NAME</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter?.house_name || 'N/A'}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>POLLING STATION</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter?.polling_station_id || 'PS-001'}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>WARD</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter?.ward_id || 'N/A'}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>OLD WARD NO.</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter?.old_ward_no || '12'}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>ASSEMBLY</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter?.assembly_id || 'N/A'}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>DISTRICT</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter?.district_id || 'N/A'}</Text>
            </View>
            
            <View style={styles.inlineDetailRow}>
              <Text style={styles.inlineDetailLabel}>LAST UPDATE DATE</Text>
              <Text style={styles.inlineDetailSeparator}>:</Text>
              <Text style={styles.inlineDetailValue}>{voter?.updated_at ? new Date(voter.updated_at).toLocaleDateString() : 'N/A'}</Text>
            </View>
          </View>

          {/* Editable Fields */}
          <View style={styles.editableSection}>
            <Text style={styles.sectionTitle}>Editable Information</Text>
            
            {/* Mobile Number */}
            <View style={styles.editFieldContainer}>
              <Input
                label="Mobile Number"
                value={editData.mobile_number || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, mobile_number: text }))}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                leftIcon={<Phone size={20} color={colors.text.secondary} />}
              />
            </View>
            
            {/* Address */}
            <View style={styles.editFieldContainer}>
              <Input
                label="Address"
                value={editData.address_line1 || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, address_line1: text }))}
                placeholder="Enter complete address"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                leftIcon={<MapPin size={20} color={colors.text.secondary} />}
                style={styles.multilineInput}
              />
            </View>
            
            {/* Occupation */}
            <View style={styles.editFieldContainer}>
              <Input
                label="Occupation"
                value={editData.occupation || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, occupation: text }))}
                placeholder="Enter occupation"
                leftIcon={<Building size={20} color={colors.text.secondary} />}
              />
            </View>
            
            {/* Party Inclination */}
            <View style={styles.editFieldContainer}>
              <Text style={styles.partyInclinationLabel}>Party Inclination</Text>
              <View style={styles.partyInclinationOptions}>
                {[
                  { key: 'BJP', label: 'Party Voter' },
                  { key: 'Inclined', label: 'Inclined to Party' },
                  { key: 'Neutral', label: 'Neutral' },
                  { key: 'Anti', label: 'Anti Party' }
                ].map((option) => {
                  const isSelected = editData.political_inclination === option.key;
                  const partyStatus = getPartyStatus(option.key);
                  
                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.partyOption,
                        isSelected && { 
                          backgroundColor: partyStatus.color,
                          borderColor: partyStatus.color 
                        }
                      ]}
                      onPress={() => setEditData(prev => ({ ...prev, political_inclination: option.key }))}
                    >
                      <Text style={[
                        styles.partyOptionText,
                        isSelected && { color: colors.text.white }
                      ]}>
                        {option.label}
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
              title={isLoading ? "Saving..." : "Save"}
              onPress={handleSave}
              disabled={isLoading}
              icon={<Save size={16} color={colors.text.white} />}
              style={styles.actionButton}
            />
          </View>
        </Card>
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
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },
  backButton: {
    position: 'absolute',
    left: Spacing.md,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.title,
    color: colors.text.secondary,
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
    borderBottomColor: colors.border,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.round,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profileInitial: {
    ...Typography.title,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 28,
  },
  voterInfo: {
    flex: 1,
  },
  voterName: {
    ...Typography.title,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: Spacing.xs,
  },
  voterMeta: {
    ...Typography.body,
    color: colors.text.secondary,
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
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    color: colors.text.secondary,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    width: 120,
    letterSpacing: 0.5,
    textAlign: 'left',
  },
  inlineDetailSeparator: {
    ...Typography.body,
    color: colors.text.secondary,
    fontWeight: '700',
    marginHorizontal: Spacing.sm,
    width: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  inlineDetailValue: {
    ...Typography.body,
    color: colors.text.primary,
    fontWeight: '500',
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
  editFieldContainer: {
    //marginBottom: Spacing.lg,
  },

  multilineInput: {
    minHeight: 80,
  },
  partyInclinationLabel: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    color: colors.text.primary
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
    borderColor: colors.border,
    backgroundColor: colors.background,
    minWidth: 80,
    alignItems: 'center',
  },
  partyOptionText: {
    ...Typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
  },
});