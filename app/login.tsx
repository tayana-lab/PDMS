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
import { leaders } from "@/constants/leaders";
import { useAuth } from "@/hooks/useAuth";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { login } = useAuth();
  const { colors, currentTheme } = useAppSettings();

  // Auto-scroll leader banners
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % leaders.length;
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: currentIndex * width,
          animated: true,
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!mobileNumber.trim() || !pin.trim()) {
      Alert.alert("Error", "Please enter both mobile number and PIN");
      return;
    }
    if (pin.length !== 6) {
      Alert.alert("Error", "PIN must be 6 digits");
      return;
    }
    setIsLoading(true);
    try {
      const result = await login(mobileNumber, pin);
      if (result.success) router.replace("/(tabs)");
      else Alert.alert("Error", result.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/new-user');
  };

  const handleRegister = () => {
    router.push('/new-user');
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.surface} 
      />
      
      {/* BJP Leaders Banner */}
      <View style={styles.bannerWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        >
          {leaders.map((leader) => (
            <View key={leader.id} style={styles.bannerSlide}>
              <Image source={{ uri: leader.image }} style={styles.bannerImage} />
              <View style={styles.bannerTextBox}>
                <Text style={styles.bannerName}>{leader.name}</Text>
                <Text style={styles.bannerPosition}>{leader.position}</Text>
                <Text style={styles.bannerSlogan}>
                  &ldquo;Sabka Saath, Sabka Vikas&rdquo;
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        style={styles.mainContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <View style={styles.logoInner}>
                  {/* Create the wheel pattern */}
                  <View style={styles.wheelPattern}>
                    {[...Array(8)].map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.wheelSpoke,
                          {
                            transform: [{ rotate: `${i * 45}deg` }],
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
              <View style={styles.decorativeElements}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
            
            <Text style={styles.welcomeTitle}>Welcome to LemonPie!</Text>
            <Text style={styles.welcomeSubtitle}>Keep your data safe</Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <Phone size={20} color={colors.text.light} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholder="Enter your mobile number"
                  placeholderTextColor={colors.text.light}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>6-Digit PIN</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={colors.text.light} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.pinInput]}
                  value={pin}
                  onChangeText={setPin}
                  placeholder="Enter 6-digit PIN"
                  placeholderTextColor={colors.text.light}
                  secureTextEntry={!showPin}
                  keyboardType="numeric"
                  maxLength={6}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPin(!showPin)}
                >
                  {showPin ? (
                    <Eye size={20} color={colors.text.light} />
                  ) : (
                    <EyeOff size={20} color={colors.text.light} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "LOGGING IN..." : "LOGIN"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot PIN?</Text>
            </TouchableOpacity>
          </View>

          {/* Register Section */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>
              Don&apos;t have an account?{" "}
              <Text style={styles.registerLink} onPress={handleRegister}>
                Register!
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  bannerWrapper: {
    height: 120,
    backgroundColor: colors.primary,
  },
  bannerSlide: {
    width,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    justifyContent: "center",
  },
  bannerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: "#fff",
  },
  bannerTextBox: { flex: 1 },
  bannerName: { fontSize: 16, fontWeight: "700", color: "#fff" },
  bannerPosition: { fontSize: 12, color: "rgba(255,255,255,0.9)" },
  bannerSlogan: { fontSize: 11, fontStyle: "italic", color: "rgba(255,255,255,0.8)" },
  
  mainContent: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  
  logoSection: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  
  logoContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  wheelPattern: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  
  wheelSpoke: {
    position: 'absolute',
    width: 3,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 1.5,
    top: 2,
    left: 18.5,
    transformOrigin: '1.5px 18px',
  },
  
  decorativeElements: {
    position: 'absolute',
    width: 120,
    height: 120,
    top: -20,
    left: -20,
  },
  
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  
  dot1: {
    top: 10,
    right: 20,
  },
  
  dot2: {
    top: 30,
    right: 10,
  },
  
  dot3: {
    bottom: 20,
    left: 15,
  },
  
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  
  loginCard: {
    backgroundColor: colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  
  inputContainer: {
    marginBottom: Spacing.md,
  },
  
  inputLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: '500',
  },
  
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 48,
  },
  
  pinInput: {
    paddingRight: 50,
  },
  
  eyeIcon: {
    position: 'absolute',
    right: Spacing.md,
    padding: Spacing.xs,
  },
  
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.white,
    letterSpacing: 0.5,
  },
  
  forgotPassword: {
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  registerSection: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  
  registerText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  
  registerLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});