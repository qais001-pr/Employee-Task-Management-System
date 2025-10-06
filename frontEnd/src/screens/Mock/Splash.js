/* eslint-disable semi */
import { View, SafeAreaView, Image, Text, StatusBar, Pressable } from 'react-native'
import React from 'react'
// image
import image from '../../../assets/images/login.png'
// import styleSheet

import { StyleSheet, Dimensions } from 'react-native'

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window')

// Define a primary color palette
const COLORS = {
    primary: '#4F46E5', // Indigo-600 for main actions
    secondary: '#374151', // Gray-700 for text
    background: '#FFFFFF',
    buttonText: '#FFFFFF',
}


// navigation
import { useNavigation } from '@react-navigation/native'

export default function Splash() {

    const navigation = useNavigation()

    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <StatusBar barStyle={'dark-content'} />
            <View style={styles.ImageContainer}>
                <Image source={image} style={styles.Image} />
            </View>
            <View style={styles.HeaderContainer}>
                <Text style={styles.HeaderText}>
                    Employee & Task Management App
                </Text>
            </View>
            <View style={styles.ButtonContainer}>
                <Pressable
                    onPress={() => navigation.navigate('AdminLogin')}
                    style={styles.Button} >
                    <Text style={styles.ButtonText}>
                        Admin Login
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => navigation.navigate('Login')}
                    style={styles.Button}>
                    <Text style={styles.ButtonText}>
                        Employee Login
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

/**
 * Stylesheet for the SplashScreen component, providing a clean,
 * modern, and responsive layout for the app's entry screen.
 */
export const styles = StyleSheet.create({
    SafeAreaView: {
        flex: 1, // Take up the entire screen
        backgroundColor: COLORS.background,
        paddingTop: 0, // Ensure content starts right from the top (Status Bar will handle spacing if needed)
    },

    // --- Image Section ---
    ImageContainer: {
        flex: 2.5, // Allocate more space for the visual element
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    Image: {
        width: width * 0.85, // 85% of screen width
        height: height * 0.35, // 35% of screen height
        resizeMode: 'contain', // Ensure the image scales properly
        marginBottom: 20,
    },

    // --- Header/Text Section ---
    HeaderContainer: {
        flex: 0.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    HeaderText: {
        fontSize: 28,
        fontWeight: '800', // Extra Bold
        color: COLORS.secondary,
        textAlign: 'center',
        lineHeight: 36,
        letterSpacing: -0.5,
    },

    // --- Button Section ---
    ButtonContainer: {
        flex: 2, // Ensure enough space for buttons and vertical padding
        paddingHorizontal: 32,
        justifyContent: 'center', // Center buttons vertically within their space
        gap: 16, // Space between the two buttons (React Native styling standard)
        marginTop: 40,
    },
    Button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6, // Android shadow
        alignItems: 'center',
        justifyContent: 'center',
        // Optional: Add a subtle border for depth
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    ButtonText: {
        color: COLORS.buttonText,
        fontSize: 18,
        fontWeight: '700', // Bold
        textTransform: 'uppercase',
    },
})
