import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { leaders } from '@/constants/leaders';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

const { width } = Dimensions.get('window');

type LoginStep = 'login' | 'mobile' | 'otp';

export default function LoginScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<LoginStep>('login');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { login, sendOTP, verifyOTP } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % leaders.length;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: nextIndex * width,
            animated: true
          });
        }
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!pin.trim()) {
      Alert.alert('Error', 'Please enter your PIN');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(phone, pin);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', result.error || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewUser = () => {
    setStep('mobile');
    setPhone('');
    setPin('');
    setOtp('');
  };

  const handleMobileSubmit = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setIsLoading(true);
    const result = await sendOTP(phone);
    setIsLoading(false);

    if (result.success) {
      setStep('otp');
      Alert.alert('Success', `OTP sent to ${phone}. Use 1234 for demo.`);
    } else {
      Alert.alert('Error', result.error || 'Failed to send OTP');
    }
  };

  const handleOTPVerify = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyOTP(phone, otp);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', result.error || 'OTP verification failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep('login');
    setPhone('');
    setPin('');
    setOtp('');
  };



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor={Colors.primary} 
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} 
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.imageContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          >
            {leaders.map((leader) => (
              <View key={leader.id} style={styles.imageSlide}>
                <Image source={{ uri: leader.image }} style={styles.leaderImage} />
                <Text style={styles.leaderName}>{leader.name}</Text>
                <Text style={styles.leaderPosition}>{leader.position}</Text>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.indicators}>
            {leaders.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.formContainer}>
          <Card style={styles.loginCard}>
            <View style={styles.logoContainer}>
              <Text style={styles.appTitle}>BJP Karyakarta</Text>
              <Text style={styles.appSubtitle}>Digital Platform</Text>
            </View>

            {step === 'login' && (
              <>
                <Input
                  label="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="next"
                />

                <Input
                  label="PIN"
                  value={pin}
                  onChangeText={setPin}
                  placeholder="Enter your PIN"
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={4}
                  returnKeyType="done"
                  textContentType="password"
                />

                <Button
                  title="Login"
                  onPress={handleLogin}
                  loading={isLoading}
                  style={styles.loginButton}
                />

                <Button
                  title="New User"
                  onPress={handleNewUser}
                  variant="outline"
                  disabled={isLoading}
                  style={styles.otpButton}
                />
              </>
            )}

            {step === 'mobile' && (
              <>
                <Text style={styles.stepTitle}>Enter Mobile Number</Text>
                <Input
                  label="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="done"
                  autoFocus
                />

                <Button
                  title="Send OTP"
                  onPress={handleMobileSubmit}
                  loading={isLoading}
                  style={styles.loginButton}
                />

                <Button
                  title="Back to Login"
                  onPress={handleBackToLogin}
                  variant="ghost"
                  style={styles.backButton}
                />
              </>
            )}

            {step === 'otp' && (
              <>
                <Text style={styles.stepTitle}>Enter OTP</Text>
                <Text style={styles.stepSubtitle}>OTP sent to {phone}</Text>
                <Input
                  label="OTP"
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="Enter OTP"
                  keyboardType="numeric"
                  maxLength={4}
                  returnKeyType="done"
                  textContentType="oneTimeCode"
                  autoFocus
                />

                <Button
                  title="Verify OTP"
                  onPress={handleOTPVerify}
                  loading={isLoading}
                  style={styles.loginButton}
                />

                <Button
                  title="Back"
                  onPress={() => setStep('mobile')}
                  variant="ghost"
                  style={styles.backButton}
                />
              </>
            )}
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  keyboardContainer: {
    flex: 1
  },
  imageContainer: {
    height: 240,
    position: 'relative',
    backgroundColor: Colors.background
  },
  imageSlide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingBottom: 40
  },
  leaderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.sm,
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface
  },
  leaderName: {
    ...Typography.subtitle,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 2
  },
  leaderPosition: {
    ...Typography.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontSize: 12
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 8,
    width: '100%',
    zIndex: 10
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text.light,
    marginHorizontal: 4
  },
  activeIndicator: {
    backgroundColor: Colors.primary
  },
  formContainer: {
    flex: 1,
    padding: Spacing.lg
  },
  loginCard: {
    padding: Spacing.xl
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl
  },
  appTitle: {
    ...Typography.title,
    color: Colors.primary,
    fontWeight: '700'
  },
  appSubtitle: {
    ...Typography.caption,
    color: Colors.secondary,
    marginTop: Spacing.xs
  },
  loginButton: {
    marginTop: Spacing.md
  },
  otpButton: {
    marginTop: Spacing.md
  },
  backButton: {
    marginTop: Spacing.sm
  },
  stepTitle: {
    ...Typography.subtitle,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: '600'
  },
  stepSubtitle: {
    ...Typography.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg
  }
});