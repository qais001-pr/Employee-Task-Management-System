/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-quotes */
/* eslint-disable semi */
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeButton from './tabNavigation/HomeScreen'
import Projects from './tabNavigation/Projects'
import Employee from './tabNavigation/Employee'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { StyleSheet, View } from 'react-native'

const Tab = createBottomTabNavigator()

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: '#007BFF',
                    tabBarInactiveTintColor: '#888',
                    tabBarLabelStyle: styles.tabLabel,
                    tabBarStyle: styles.tabBar,
                    tabBarIcon: ({ focused, color }) => {
                        let iconName

                        if (route.name === 'Home') {
                            iconName = focused ? 'house' : 'house-chimney'
                        } else if (route.name === 'Employees') {
                            iconName = focused ? 'users' : 'user-group'
                        } else if (route.name === 'Projects') {
                            iconName = focused ? 'folder' : 'folder-open'
                        } else if (route.name === 'Departments') {
                            iconName = focused ? 'building' : 'building-user'
                        }

                        return (
                            <View style={styles.iconContainer}>
                                <FontAwesome6 name={iconName} size={18} color={color} />
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
            </Tab.Navigator>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    tabBar: {
        backgroundColor: '#fff',
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        height: 65,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: 5,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
        paddingBottom: 5,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
    },
})
