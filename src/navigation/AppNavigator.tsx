// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { LanguageSelectionScreen } from '../screens/auth/LanguageSelectionScreen';

// Main Screens
import { CreateMomentScreen } from '../screens/main/CreateMomentScreen';
// Import other main screens here

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'CreateMoment') {
            iconName = 'add-circle';
          } else if (route.name === 'GiveJoy') {
            iconName = 'video-call';
          } else if (route.name === 'YourMoments') {
            iconName = 'collections';
          } else if (route.name === 'WallOfJoy') {
            iconName = 'dashboard';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="CreateMoment" 
        component={CreateMomentScreen}
        options={{ title: 'Create Moment' }}
      />
      <Tab.Screen 
        name="GiveJoy" 
        component={CreateMomentScreen} // Replace with actual component
        options={{ title: 'Give Joy' }}
      />
      <Tab.Screen 
        name="YourMoments" 
        component={CreateMomentScreen} // Replace with actual component
        options={{ title: 'Your Moments' }}
      />
      <Tab.Screen 
        name="WallOfJoy" 
        component={CreateMomentScreen} // Replace with actual component
        options={{ title: 'Wall of Joy' }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    // Return loading screen
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : !user?.profileCompleted ? (
          // Language Selection
          <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        ) : (
          // Main App
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};