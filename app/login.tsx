import React, { useState, useEffect, useRef } from "react";
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
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { Eye, EyeOff, Phone, Lock } from "lucide-react-native";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { useAppSettings } from "@/hooks/useAppSettings";

import { useAuth } from "@/hooks/useAuth";
import { useRequestOtp, useLogin } from "@/hooks/useApi";
import Button from "@/components/ui/Button";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Banner images array
  const bannerImages = [
    {
      uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/akbi9amrsr36bu10mpbj4",
      slogan: "Sabka Saath, Sabka Vikas"
    },
    {
      uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/onaptyoia584jcqbmalfg",
      slogan: "Unity in Diversity"
    },
    {
      uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/1y7ginuej799zpineibmz",
      slogan: "Seva Hi Sangathan"
    }
  ];

  const { login } = useAuth();
  const { colors, currentTheme, t } = useAppSettings();
  const requestOtpMutation = useRequestOtp();
  const loginMutation = useLogin();

  // Auto-scroll banner images
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % bannerImages.length;
      setCurrentBannerIndex(currentIndex);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: currentIndex * width,
          animated: true,
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // OTP Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleRequestOtp = async () => {
    if (!mobileNumber.trim()) {
      Alert.alert(t('error'), "Please enter mobile number");
      return;
    }
    if (mobileNumber.length !== 10) {
      Alert.alert(t('error'), "Mobile number must be 10 digits");
      return;
    }

    setIsLoading(true);
    try {
      await requestOtpMutation.mutateAsync({ mobile_number: mobileNumber });
      setOtpSent(true);
      setOtpTimer(60); // 60 seconds timer
      Alert.alert(t('success'), "OTP sent successfully");
    } catch (error: any) {
      Alert.alert(t('error'), error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!mobileNumber.trim() || !otp.trim()) {
      Alert.alert(t('error'), "Please enter both mobile number and OTP");
      return;
    }
    if (otp.length !== 6) {
      Alert.alert(t('error'), "OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginMutation.mutateAsync({
        mobile_number: mobileNumber,
        otp: otp,
      });
      
      // Update local auth state
      await login(mobileNumber, otp);
      
      Alert.alert(t('success'), `Welcome ${response.karyakarta.name}!`);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(t('error'), error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-pin");
  };

  const handleRegister = () => {
    router.push("/new-user");
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={currentTheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      {/* BJP Banner Carousel */}
      <View style={styles.bannerWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentBannerIndex(index);
          }}
        >
          {bannerImages.map((banner, index) => (
            <View key={index} style={styles.bannerSlide}>
              <Image 
                source={{ uri: banner.uri }} 
                style={styles.bannerImage} 
                resizeMode="cover"
              />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerSlogan}>
                  &ldquo;{banner.slogan}&rdquo;
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        
   
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView
        style={styles.mainContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
       
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/883hzv1gvf1dh5pk5dd8q",
                }}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.welcomeSubtitle}>BHARATIYA JANATA PARTY</Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('mobileNumber')}</Text>
              <View style={styles.inputWrapper}>
                <Phone
                  size={20}
                  color={colors.text.light}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholder={t('enterMobileNumber')}
                  placeholderTextColor={colors.text.light}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>

            {!otpSent ? (
              <Button
                title={isLoading ? "Sending OTP..." : "Send OTP"}
                onPress={handleRequestOtp}
                disabled={isLoading || mobileNumber.length !== 10}
                loading={isLoading}
                style={styles.loginButton}
              />
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>OTP</Text>
                  <View style={styles.inputWrapper}>
                    <Lock
                      size={20}
                      color={colors.text.light}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, styles.pinInput]}
                      value={otp}
                      onChangeText={setOtp}
                      placeholder="Enter 6-digit OTP"
                      placeholderTextColor={colors.text.light}
                      secureTextEntry={!showOtp}
                      keyboardType="numeric"
                      maxLength={6}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowOtp(!showOtp)}
                    >
                      {showOtp ? (
                        <Eye size={20} color={colors.text.light} />
                      ) : (
                        <EyeOff size={20} color={colors.text.light} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <Button
                  title={isLoading ? t('loggingIn') : t('login')}
                  onPress={handleLogin}
                  disabled={isLoading || otp.length !== 6}
                  loading={isLoading}
                  style={styles.loginButton}
                />

                <View style={styles.resendContainer}>
                  {otpTimer > 0 ? (
                    <Text style={styles.timerText}>
                      Resend OTP in {otpTimer}s
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleRequestOtp}>
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}



            <View style={styles.forgotPin}>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.registerLink}>{t('forgotPin')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Section */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>
              {t('dontHaveAccount')}{" "}
             
                <Text style={styles.registerLink} onPress={handleRegister} >{t('register')}</Text>
              
            </Text>
          </View>
  
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },

bannerWrapper: {
      flex: 0.3,
      marginHorizontal: Spacing.lg,
      borderRadius: 12,
      overflow: "hidden",
      position: "relative",
    },
    bannerSlide: {
      width: width - (Spacing.lg * 2),
      height: "100%",
      position: "relative",
    },
    bannerImage: {
      width: "100%",
      height: "100%",
    },
    paginationContainer: {
      position: "absolute",
      bottom: 10,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      marginHorizontal: 4,
    },
    paginationDotActive: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    bannerOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
    },
    bannerSlogan: {
      fontSize: 16,
      fontWeight: "600",
      fontStyle: "italic",
      color: "#fff",
      textAlign: "center",
    },

    // Main Content 60%
    mainContent: {
      flex: 0.7,
      marginHorizontal: Spacing.lg,  
      justifyContent: "center", 
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.lg
    },

    logoSection: {
      alignItems: "center",
      marginBottom: 10,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 10,
    },
    logoImage: {
      width: 75,
      height: 75,
    },
    welcomeSubtitle: {
      fontSize: 16,
      color: colors.text.secondary,
    },

    loginCard: {
      backgroundColor: colors.background,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      ...Shadows.medium,
    },

    inputContainer: {
      marginBottom: Spacing.md,
    },
    inputLabel: {
      fontSize: 14,
      color: colors.text.secondary,
      marginBottom: Spacing.sm,
      fontWeight: "500",
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...Shadows.small,
    },
    inputIcon: {
      marginRight: Spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text.primary,
      paddingVertical: Spacing.md,
      paddingHorizontal: 0,
      backgroundColor: "transparent",
      borderWidth: 0,
      minHeight: 50,
      height: 50,
      textAlignVertical: 'center',
    },
    pinInput: {
      paddingRight: 50,
    },
    eyeIcon: {
      position: "absolute",
      right: Spacing.md,
      padding: Spacing.xs,
    },
    loginButton: {
      marginTop: Spacing.sm,
      marginBottom: Spacing.md,
    },

    forgotPin: {
      alignItems: "flex-end",
      textAlign: "right",
    },

    registerSection: {
      alignItems: "center",
      marginTop:10,
      marginBottom: Spacing.md,
    },
    registerText: {
      fontSize: 16,
      color: colors.text.secondary,
    },
    registerLink: {
      color: colors.primary,
      fontWeight: "500",
    },
    resendContainer: {
      alignItems: "center",
      marginTop: Spacing.sm,
    },
    timerText: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    resendText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "500",
    },
  });
