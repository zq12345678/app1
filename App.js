import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './components/HomeScreen';
import AIChatScreen from './components/AIChatScreen';
import StyleGuideScreen from './components/StyleGuideScreen';
import FolderDetailScreen from './components/FolderDetailScreen';
import NoteDetailScreen from './components/NoteDetailScreen';
import LanguageSelectionScreen from './components/LanguageSelectionScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Placeholder component for the Record tab
const PlaceholderScreen = () => {
  return null;
};

// Floating Microphone Button Component
const FloatingMicButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.floatingMicButton}
      onPress={onPress}
    >
      <MaterialCommunityIcons name="microphone" size={32} color="white" />
    </TouchableOpacity>
  );
};

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
        name="Record"
        component={PlaceholderScreen}
        options={{
          tabBarButton: () => (
            <FloatingMicButton onPress={() => {/* Microphone button pressed */}} />
          ),
        }}
      />
      <Tab.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.tabItem}>
              <MaterialCommunityIcons
                name="message-text-outline"
                size={26}
                color="#A0A0A0"
              />
              <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>
                AI Chat
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  floatingMicButton: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    marginLeft: -35,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3B6FE8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: 'white',
  },
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
});
