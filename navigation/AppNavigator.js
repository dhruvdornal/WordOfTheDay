import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4a90e2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#ffffff',
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            title: 'Word of the Day',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen} 
          options={{
            title: 'Word History',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;