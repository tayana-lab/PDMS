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
import { Eye, EyeOff } from "lucide-react-native";
import { Spacing } from "@/constants/theme";
import { leaders } from "@/constants/leaders";
import { useAuth } from "@/hooks/useAuth";

const { width } = Dimensions.get("window");

export default function LoginScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { login } = useAuth();

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
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    setIsLoading(true);
    try {
      const result = await login(email, password);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
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
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="janedoe@gmail.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye size={20} color="#999" />
                ) : (
                  <EyeOff size={20} color="#999" />
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
            <Text style={styles.forgotPassword}>Forgot password?</Text>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  bannerWrapper: {
    height: 100,
    backgroundColor: '#FF6B35',
  },
  bannerSlide: {
    width,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    justifyContent: "center",
  },
  bannerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: "#fff",
  },
  bannerTextBox: { flex: 1 },
  bannerName: { fontSize: 14, fontWeight: "700", color: "#fff" },
  bannerPosition: { fontSize: 11, color: "rgba(255,255,255,0.9)" },
  bannerSlogan: { fontSize: 10, fontStyle: "italic", color: "rgba(255,255,255,0.8)" },
  
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  
  logoSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  
  logoContainer: {
    position: 'relative',
    marginBottom: 24,
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
    backgroundColor: '#FFD700',
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
    color: '#000',
    marginBottom: 4,
  },
  
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  inputContainer: {
    marginBottom: 20,
  },
  
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  
  inputWrapper: {
    position: 'relative',
  },
  
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 0,
  },
  
  passwordInput: {
    paddingRight: 50,
  },
  
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  
  loginButton: {
    backgroundColor: '#FFD700',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  
  forgotPassword: {
    fontSize: 16,
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  registerSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  
  registerText: {
    fontSize: 16,
    color: '#666',
  },
  
  registerLink: {
    color: '#FFD700',
    fontWeight: '600',
  },
});