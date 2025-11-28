import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './components/HomeScreen';
import SettingsScreen from './components/SettingsScreen';
import StyleGuideScreen from './components/StyleGuideScreen';
import FolderDetailScreen from './components/FolderDetailScreen';
import NoteDetailScreen from './components/NoteDetailScreen';
import LanguageSelectionScreen from './components/LanguageSelectionScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import { RecordingProvider } from './contexts/RecordingContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
// Use AsyncStorage version for Snack compatibility
import { initDatabase } from './services/database';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack Navigator (for Home, StyleGuide, FolderDetail, NoteDetail, and LanguageSelection screens)
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="StyleGuide" component={StyleGuideScreen} />
      <Stack.Screen name="FolderDetail" component={FolderDetailScreen} />
      <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
    </Stack.Navigator>
  );
};

// Root Tab Navigator
const RootTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <MaterialCommunityIcons
                name="home"
                size={26}
                color={focused ? '#3B6FE8' : '#A0A0A0'}
              />
              <Text style={[styles.tabLabel, { color: focused ? '#3B6FE8' : '#A0A0A0' }]}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <MaterialCommunityIcons
                name="account-outline"
                size={26}
                color={focused ? '#3B6FE8' : '#A0A0A0'}
              />
              <Text style={[styles.tabLabel, { color: focused ? '#3B6FE8' : '#A0A0A0' }]}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack Navigator (for Login and Register screens)
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Loading Screen Component
const LoadingScreen = () => {
  return (
    <View style={styles.loadingScreen}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle1} />
        <View style={styles.logoCircle2} />
        <View style={styles.logoCircle3} />
        <Text style={styles.logoText}>Otter</Text>
      </View>
      <ActivityIndicator size="large" color="#3B6FE8" style={{ marginTop: 20 }} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

// App Navigator Component (decides between Auth and Main app)
const AppNavigator = () => {
  const { user, loading, isInitialized } = useAuth();

  if (loading || !isInitialized) {
    return <LoadingScreen />;
  }

  return user ? <RootTabNavigator /> : <AuthStack />;
};

// Main App Component
export default function App() {
  const [dbInitialized, setDbInitialized] = React.useState(false);
  const [initError, setInitError] = React.useState(null);

  React.useEffect(() => {
    async function setupDatabase() {
      try {
        console.log('Starting database initialization...');
        await initDatabase();
        console.log('Database initialized successfully');
        setDbInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setInitError(error.message);

        // For web/Snack, just log and continue
        if (Platform.OS === 'web') {
          console.warn('Running in web environment - SQLite not available');
          setDbInitialized(true);
        } else {
          // Show alert for mobile
          Alert.alert(
            'Database Error',
            `Failed to initialize database: ${error.message}\n\nPlease restart the app.`,
            [{ text: 'OK', onPress: () => setDbInitialized(true) }]
          );
        }
      }
    }
    setupDatabase();
  }, []);

  if (!dbInitialized) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle1} />
          <View style={styles.logoCircle2} />
          <View style={styles.logoCircle3} />
          <Text style={styles.logoText}>Otter</Text>
        </View>
        <ActivityIndicator size="large" color="#3B6FE8" style={{ marginTop: 20 }} />
        <Text style={styles.loadingText}>Initializing database...</Text>
        {initError && (
          <Text style={styles.errorText}>Error: {initError}</Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RecordingProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </RecordingProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: 60,
    height: 50,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle1: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B6FE8',
    marginRight: 4,
  },
  logoCircle2: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5B8FFF',
    marginRight: 4,
  },
  logoCircle3: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7BA5FF',
    marginRight: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#E8504C',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
