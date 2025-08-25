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
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { leaders } from '@/constants/leaders';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
    <View style={styles.container}>
      <StatusBar 
        backgroundColor="transparent" 
        barStyle="light-content"
        translucent
      />
      
      <LinearGradient
        colors={['#FF6B35', '#FF8A65', '#FFAB91']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.headerContainer}>
              <View style={styles.brandContainer}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>BJP</Text>
                </View>
                <Text style={styles.brandTitle}>BJP Karyakarta</Text>
                <Text style={styles.brandSubtitle}>Digital Platform</Text>
              </View>
            </View>

            <View style={styles.imageContainer}>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                style={styles.carousel}
              >
                {leaders.map((leader) => (
                  <View key={leader.id} style={styles.imageSlide}>
                    <View style={styles.leaderImageContainer}>
                      <Image source={{ uri: leader.image }} style={styles.leaderImage} />
                      <View style={styles.imageOverlay} />
                    </View>
                    <View style={styles.leaderInfo}>
                      <Text style={styles.leaderName}>{leader.name}</Text>
                      <Text style={styles.leaderPosition}>{leader.position}</Text>
                    </View>
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
              <View style={styles.loginCard}>
                {step === 'login' && (
                  <>
                    <View style={styles.welcomeContainer}>
                      <Text style={styles.welcomeTitle}>Welcome Back</Text>
                      <Text style={styles.welcomeSubtitle}>Sign in to continue</Text>
                    </View>

                    <View style={styles.inputContainer}>
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
                    </View>

                    <View style={styles.buttonContainer}>
                      <Button
                        title="Sign In"
                        onPress={handleLogin}
                        loading={isLoading}
                        style={styles.primaryButton}
                      />

                      <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.divider} />
                      </View>

                      <Button
                        title="New User Registration"
                        onPress={handleNewUser}
                        variant="outline"
                        disabled={isLoading}
                        style={styles.secondaryButton}
                      />
                    </View>
                  </>
                )}

                {step === 'mobile' && (
                  <>
                    <View style={styles.welcomeContainer}>
                      <Text style={styles.welcomeTitle}>New Registration</Text>
                      <Text style={styles.welcomeSubtitle}>Enter your mobile number to get started</Text>
                    </View>

                    <View style={styles.inputContainer}>
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
                    </View>

                    <View style={styles.buttonContainer}>
                      <Button
                        title="Send OTP"
                        onPress={handleMobileSubmit}
                        loading={isLoading}
                        style={styles.primaryButton}
                      />

                      <Button
                        title="Back to Login"
                        onPress={handleBackToLogin}
                        variant="ghost"
                        style={styles.backButton}
                      />
                    </View>
                  </>
                )}

                {step === 'otp' && (
                  <>
                    <View style={styles.welcomeContainer}>
                      <Text style={styles.welcomeTitle}>Verify OTP</Text>
                      <Text style={styles.welcomeSubtitle}>Enter the OTP sent to {phone}</Text>
                    </View>

                    <View style={styles.inputContainer}>
                      <Input
                        label="OTP"
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Enter 4-digit OTP"
                        keyboardType="numeric"
                        maxLength={4}
                        returnKeyType="done"
                        textContentType="oneTimeCode"
                        autoFocus
                      />
                    </View>

                    <View style={styles.buttonContainer}>
                      <Button
                        title="Verify & Continue"
                        onPress={handleOTPVerify}
                        loading={isLoading}
                        style={styles.primaryButton}
                      />

                      <Button
                        title="Back"
                        onPress={() => setStep('mobile')}
                        variant="ghost"
                        style={styles.backButton}
                      />
                    </View>
                  </>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradientBackground: {
    flex: 1
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  keyboardContainer: {
    flex: 1
  },
  headerContainer: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: 'center'
  },
  brandContainer: {
    alignItems: 'center'
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text.white,
    letterSpacing: 1
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.xs
  },
  brandSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center'
  },
  imageContainer: {
    height: 180,
    position: 'relative',
    marginBottom: Spacing.lg
  },
  carousel: {
    flex: 1
  },
  imageSlide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg
  },
  leaderImageContainer: {
    position: 'relative',
    marginBottom: Spacing.md
  },
  leaderImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)'
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  leaderInfo: {
    alignItems: 'center'
  },
  leaderName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: 2
  },
  leaderPosition: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center'
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4
  },
  activeIndicator: {
    backgroundColor: Colors.text.white
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg
  },
  loginCard: {
    backgroundColor: Colors.text.white,
    borderRadius: 24,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.text.secondary,
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: Spacing.lg
  },
  buttonContainer: {
    gap: Spacing.md
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: Spacing.md
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: Spacing.md,
    borderWidth: 2
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500'
  },
  backButton: {
    marginTop: Spacing.sm
  }
});