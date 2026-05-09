import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
  Dimensions
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DesignScreen from './src/screens/DesignScreen';
import FieldEngineerMode from './src/screens/FieldEngineerMode';
import OfflineDashboard from './src/screens/OfflineDashboard';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Main App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
    checkConnectivity();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkConnectivity = () => {
    // Check network connectivity
    setIsOffline(!navigator.onLine);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFC107" />
        <Text style={styles.loadingText}>Loading SolarGenius Pro...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0f1425' },
          headerTintColor: '#FFC107',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="FieldEngineerMode" component={FieldEngineerMode} />
            <Stack.Screen name="OfflineDashboard" component={OfflineDashboard} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main Tabs Component
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Design') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'Field Mode') iconName = focused ? 'construct' : 'construct-outline';
          else if (route.name === 'Offline') iconName = focused ? 'cloud-offline' : 'cloud-offline-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFC107',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#0f1425', borderTopColor: '#1f253f' },
        headerStyle: { backgroundColor: '#0f1425' },
        headerTintColor: '#FFC107'
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Design" component={DesignScreen} />
      <Tab.Screen name="Field Mode" component={FieldEngineerMode} />
      <Tab.Screen name="Offline" component={OfflineDashboard} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Login Screen
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      // API call to login
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (data.success) {
        await AsyncStorage.setItem('auth_token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        navigation.replace('Main');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.loginContainer}>
      <ScrollView contentContainerStyle={styles.loginScroll}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>☀️</Text>
          <Text style={styles.title}>SolarGenius Pro</Text>
          <Text style={styles.subtitle}>by EmersonEIMS</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#0a0e1c" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.demoContainer}>
            <Text style={styles.demoText}>Demo Account:</Text>
            <Text style={styles.demoCreds}>admin@emerson.co.ke / admin123</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Field Engineer Mode Screen
function FieldEngineerMode() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    // Load projects from local storage or API
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔧 Field Engineer Mode</Text>
        <Text style={styles.headerSubtitle}>Offline-capable • GPS tracking • Photo capture</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Active Sites</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Efficiency</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          {projects.map((project, index) => (
            <TouchableOpacity key={index} style={styles.projectCard}>
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.projectLocation}>{project.location}</Text>
              <View style={styles.projectStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.projectTime}>10:00 AM</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📸</Text>
              <Text>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📍</Text>
              <Text>GPS Check-in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text>Complete Checklist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📄</Text>
              <Text>Generate Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0f1e'
  },
  loadingText: {
    marginTop: 20,
    color: '#FFC107',
    fontSize: 16
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  loginScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50
  },
  logoText: {
    fontSize: 60,
    marginBottom: 10
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  subtitle: {
    fontSize: 14,
    color: '#888'
  },
  formContainer: {
    width: '100%'
  },
  input: {
    backgroundColor: '#1f253f',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    marginBottom: 15,
    fontSize: 16
  },
  loginButton: {
    backgroundColor: '#FFC107',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10
  },
  loginButtonText: {
    color: '#0a0e1c',
    fontSize: 18,
    fontWeight: 'bold'
  },
  forgotText: {
    color: '#FFC107',
    textAlign: 'center',
    marginTop: 20
  },
  demoContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#1f253f',
    borderRadius: 10,
    alignItems: 'center'
  },
  demoText: {
    color: '#888',
    marginBottom: 5
  },
  demoCreds: {
    color: '#FFC107',
    fontSize: 12
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e'
  },
  header: {
    padding: 20,
    backgroundColor: '#0f1425',
    borderBottomWidth: 1,
    borderBottomColor: '#1f253f'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 5
  },
  content: {
    flex: 1,
    padding: 15
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0f1425',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#1f253f'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107'
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 5
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15
  },
  projectCard: {
    backgroundColor: '#0f1425',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f253f'
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  projectLocation: {
    fontSize: 12,
    color: '#888',
    marginTop: 5
  },
  projectStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 8
  },
  projectTime: {
    fontSize: 12,
    color: '#888'
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  actionCard: {
    width: (width - 45) / 2,
    backgroundColor: '#0f1425',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f253f'
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 10
  }
});