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
        backgroundColor="#FF6B35" 
        barStyle="light-content"
        translucent={false}
      />
      
      <LinearGradient
        colors={['#FF6B35', '#FF8A65', '#FFAB91']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* BJP Advertisement Banner */}
        <View style={styles.advertisementBanner}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            style={styles.bannerCarousel}
          >
            {leaders.map((leader) => (
              <View key={leader.id} style={styles.bannerSlide}>
                <View style={styles.bannerContent}>
                  <Image source={{ uri: leader.image }} style={styles.bannerImage} />
                  <View style={styles.bannerTextContainer}>
                    <Text style={styles.bannerName}>{leader.name}</Text>
                    <Text style={styles.bannerPosition}>{leader.position}</Text>
                    <Text style={styles.bannerSlogan}>&ldquo;Sabka Saath, Sabka Vikas&rdquo;</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.bannerIndicators}>
            {leaders.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.bannerIndicator,
                  index === currentImageIndex && styles.activeBannerIndicator
                ]}
              />
            ))}
          </View>
        </View>

        {/* Main Content Area */}
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.centerContainer}>
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
  advertisementBanner: {
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)'
  },
  bannerCarousel: {
    flex: 1
  },
  bannerSlide: {
    width,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: Spacing.md,
    width: '100%',
    maxWidth: 350
  },
  bannerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: Spacing.md
  },
  bannerTextContainer: {
    flex: 1
  },
  bannerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.white,
    marginBottom: 2
  },
  bannerPosition: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4
  },
  bannerSlogan: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic'
  },
  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.xs
  },
  bannerIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 3
  },
  activeBannerIndicator: {
    backgroundColor: Colors.text.white
  },
  safeArea: {
    flex: 1
  },
  keyboardContainer: {
    flex: 1
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl
  },
  loginCard: {
    backgroundColor: Colors.text.white,
    borderRadius: 28,
    padding: Spacing.xl * 1.5,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl * 1.5
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    letterSpacing: 0.5
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.secondary,
    textAlign: 'center',
    opacity: 0.8
  },
  inputContainer: {
    marginBottom: Spacing.xl
  },
  buttonContainer: {
    gap: Spacing.lg
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    borderWidth: 2,
    borderColor: '#FF6B35'
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 107, 53, 0.2)'
  },
  dividerText: {
    marginHorizontal: Spacing.lg,
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '600',
    backgroundColor: Colors.text.white,
    paddingHorizontal: Spacing.sm
  },
  backButton: {
    marginTop: Spacing.md
  }
});