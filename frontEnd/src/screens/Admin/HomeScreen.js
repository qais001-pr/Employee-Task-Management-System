/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-quotes */
/* eslint-disable semi */
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeButton from './tabNavigation/HomeScreen'
import Projects from './tabNavigation/Projects'
import Employee from './tabNavigation/Employee'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'

const Tab = createBottomTabNavigator()

export default function HomeScreen() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#007BFF',
                tabBarInactiveTintColor: '#555',
                tabBarStyle: { backgroundColor: '#f0f0f0', height: 60 },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'house' : 'house-chimney';
                    } else if (route.name === 'Employees') {
                        iconName = focused ? 'users' : 'user-group';
                    } else if (route.name === 'Projects') {
                        iconName = focused ? 'folder' : 'folder-open';
                    }

                    return <FontAwesome6 name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name='Home' component={HomeButton} />
            <Tab.Screen name='Employees' component={Employee} />
            <Tab.Screen name='Projects' component={Projects} />
        </Tab.Navigator>
    )
}
