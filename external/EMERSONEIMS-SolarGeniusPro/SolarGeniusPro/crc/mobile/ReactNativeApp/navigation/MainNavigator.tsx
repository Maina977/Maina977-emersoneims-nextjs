import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { DesignScreen } from '../screens/DesignScreen';
import { FieldEngineerMode } from '../screens/FieldEngineerMode';
import { OfflineDashboard } from '../screens/OfflineDashboard';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
  </Stack.Navigator>
);

const DesignStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DesignScreen" component={DesignScreen} />
  </Stack.Navigator>
);

const FieldStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FieldScreen" component={FieldEngineerMode} />
  </Stack.Navigator>
);

const OfflineStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OfflineScreen" component={OfflineDashboard} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  </Stack.Navigator>
);

const getTabBarIcon = (routeName: string, focused: boolean) => {
  const icons: Record<string, { focused: string; unfocused: string }> = {
    Home: { focused: '🏠', unfocused: '🏠' },
    Design: { focused: '🎨', unfocused: '🎨' },
    Field: { focused: '🔧', unfocused: '🔧' },
    Offline: { focused: '📡', unfocused: '📡' },
    Profile: { focused: '👤', unfocused: '👤' }
  };
  return icons[routeName]?.[focused ? 'focused' : 'unfocused'] || '📱';
};

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const icon = getTabBarIcon(route.name, focused);
          return <span style={{ fontSize: 22 }}>{icon}</span>;
        },
        tabBarActiveTintColor: '#FFC107',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#0f1425',
          borderTopColor: '#1f253f',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60
        },
        headerStyle: {
          backgroundColor: '#0f1425'
        },
        headerTintColor: '#FFC107',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Design" component={DesignStack} />
      <Tab.Screen name="Field" component={FieldStack} />
      <Tab.Screen name="Offline" component={OfflineStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};