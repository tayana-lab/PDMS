import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, MapPin, Phone, Camera, User } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useAuth } from '@/hooks/useAuth';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const [editData, setEditData] = useState<{
    name?: string;
    phone?: string;
    address?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useAppSettings();

  useEffect(() => {
    if (user) {
      console.log('Found user:', user);
      setEditData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('Saving user data:', {
        userId: user.id,
        updates: editData,
        timestamp: new Date().toISOString()
      });
      
      // Update user data
      await updateUser({
        ...user,
        name: editData.name || user.name,
        phone: editData.phone || user.phone,
        address: editData.address || user.address
      });
      
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = createStyles(colors);

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => {
                console.log('Edit Profile: Back button pressed (not found case)');
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
            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>
        </SafeAreaView>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
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
              console.log('Edit Profile: Back button pressed');
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
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
      </SafeAreaView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          {/* Header with Photo and Basic Info */}
          <View style={styles.profileHeader}>
            <View style={styles.profileSection}>
              <TouchableOpacity style={styles.profileImageContainer}>
                <Image
                  source={{
                    uri: user.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
                  }}
                  style={styles.profileImage}
                />
                <TouchableOpacity style={styles.cameraButton}>
                  <Camera size={16} color={colors.text.white} />
                </TouchableOpacity>
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileRole}>{user.role}</Text>
              </View>
            </View>
          </View>

          {/* Editable Fields */}
          <View style={styles.editableSection}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            
            {/* Name */}
            <View style={styles.editFieldContainer}>
              <Input
                label="Full Name"
                value={editData.name || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                leftIcon={<User size={20} color={colors.text.secondary} />}
              />
            </View>
            
            {/* Phone Number */}
            <View style={styles.editFieldContainer}>
              <Input
                label="Phone Number"
                value={editData.phone || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, phone: text }))}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                maxLength={10}
                leftIcon={<Phone size={20} color={colors.text.secondary} />}
              />
            </View>
            
            {/* Address */}
            <View style={styles.editFieldContainer}>
              <Input
                label="Address"
                value={editData.address || ''}
                onChangeText={(text) => setEditData(prev => ({ ...prev, address: text }))}
                placeholder="Enter complete address"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                leftIcon={<MapPin size={20} color={colors.text.secondary} />}
                style={styles.multilineInput}
              />
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
  profileCard: {
    margin: Spacing.md,
    padding: Spacing.lg,
  },
  profileHeader: {
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
    width: 80,
    height: 80,
    borderRadius: 40,
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
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.title,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: Spacing.xs,
  },
  profileRole: {
    ...Typography.body,
    color: colors.primary,
    fontWeight: '600',
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
  editFieldContainer: {
    marginBottom: Spacing.md,
  },
  multilineInput: {
    minHeight: 80,
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