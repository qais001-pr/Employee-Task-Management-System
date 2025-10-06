/* eslint-disable jsx-quotes */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// App Navigator
const Stack = createStackNavigator();

// Screens
import Splash from '../screens/Mock/Splash';

// Admin Authentication
import AdminLogin from '../screens/Admin/AdminLogin';
import HomeScreenAdmin from '../screens/Admin/HomeScreen';
// Employee Authentication
import EmployeeLogin from '../screens/Auth/Login';

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='HomeScreenAdmin' screenOptions={{ headerShown: false }}>
                {/* Splash Screen */}
                <Stack.Screen
                    name='Splash'
                    component={Splash}
                />
                <Stack.Screen
                    name='Login'
                    component={EmployeeLogin}
                />

                {/* Admin Authentication */}
                <Stack.Screen
                    name='AdminLogin'
                    component={AdminLogin}
                />
                <Stack.Screen
                    name='HomeScreenAdmin'
                    component={HomeScreenAdmin}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
