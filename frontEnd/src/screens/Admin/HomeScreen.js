/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-quotes */
/* eslint-disable semi */
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeButton from './Tab/HomeScreen'
import Projects from './Tab/Projects'
import Employee from './Tab/Employee'
import Tasks from './Tab/Tasks'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { StyleSheet, View } from 'react-native'

const Tab = createBottomTabNavigator()

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    // Using the primary color (#4F46E5) 
                    tabBarActiveTintColor: '#4F46E5', 
                    tabBarInactiveTintColor: '#9CA3AF', 
                    tabBarLabelStyle: styles.tabLabel,
                    tabBarStyle: styles.tabBar,
                    tabBarIcon: ({ focused, color }) => {
                        let iconName

                        if (route.name === 'Home') {
                            iconName = focused ? 'house' : 'house-chimney'
                        } else if (route.name === 'Employees') {
                            iconName = focused ? 'users' : 'user-group'
                        } else if (route.name === 'Projects') {
                            // Using a closed/open folder icon pair
                            iconName = focused ? 'folder-closed' : 'folder-open'
                        } else if (route.name === 'Tasks') {
                            // Icon logic updated to handle 'Tasks' tab
                            iconName = focused ? 'list-check' : 'clipboard-list'
                        }

                        return (
                            <View style={styles.iconContainer}>
                                <FontAwesome6 name={iconName} size={19} color={color} />
                            </View>
                        )
                    },
                })}
            >
                <Tab.Screen
                    name='Home'
                    component={HomeButton}
                    options={{ tabBarLabel: 'Home' }}
                />

                <Tab.Screen
                    name='Projects'
                    component={Projects}
                    options={{ tabBarLabel: 'Projects' }}
                />
                <Tab.Screen
                    name='Employees'
                    component={Employee}
                    options={{ tabBarLabel: 'Employees' }}
                />
                <Tab.Screen
                    name='Tasks' // Added the 'Tasks' screen
                    component={Tasks}
                    options={{ tabBarLabel: 'Tasks' }}
                />
            </Tab.Navigator>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6', // Light gray background
    },
    tabBar: {
        backgroundColor: '#fff',
        borderTopWidth: 0,
        elevation: 15, // Android shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 }, // Shadow upwards
        shadowOpacity: 0.1,
        shadowRadius: 10,
        height: 65,
        borderTopLeftRadius: 25, // Rounded corners for a modern look
        borderTopRightRadius: 25,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: 5,
        paddingHorizontal: 5,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '700', // Slightly bolder label
        paddingBottom: 5,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
    },
})
