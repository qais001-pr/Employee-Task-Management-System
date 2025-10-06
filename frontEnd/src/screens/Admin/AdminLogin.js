/* eslint-disable jsx-quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable semi */
import React from 'react'
import {
    View,
    Text,
    SafeAreaView,
    Image,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import adminImage from '../../../assets/images/AdminSignUp.png'

import { StyleSheet, Dimensions } from 'react-native'

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window')

// Define a consistent color palette
const COLORS = {
    primary: '#4F46E5', // Indigo-600 (Main Action)
    secondary: '#374151', // Gray-700 (Header Text)
    text: '#4B5563', // Gray-600 (Label/Subtitle Text)
    background: '#FFFFFF',
    inputBorder: '#D1D5DB', // Gray-300
    inputBackground: '#F9FAFB', // Light Gray-50
    buttonText: '#FFFFFF',
}

export default function AdminLogin() {
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <View style={styles.imageContainer}>
                    <Image source={adminImage} style={styles.image} />
                </View>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Login</Text>
                </View>
                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitleText}>Please enter your credentials to log in</Text>
                </View>
                <ScrollView
                    style={styles.loginContainer}
                    keyboardShouldPersistTaps='always'
                >
                    <View style={styles.labelContainer}>
                        <Text style={styles.labelText}>Email</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            placeholder='Enter Email here...'
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.labelText}>Password</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            placeholder='Enter Password here...'
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Login</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

/**
 * Stylesheet for the AdminLogin component, providing a modern, form-focused layout.
 */
export const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    // --- Image Section (Reduced size for form focus) ---
    imageContainer: {
        // Adjust flex based on screen height to ensure input fields are visible above the keyboard
        flex: height > 700 ? 0.30 : 0.40, 
        justifyContent: 'flex-end', // Push image to the top of its container
        alignItems: 'center',
        paddingVertical: 10,
    },
    image: {
        width: width * 0.60,
        height: height * 0.20,
        resizeMode: 'contain',
    },

    // --- Header Section ---
    header: {
        paddingHorizontal: 24,
        marginBottom: 8,
    },
    headerText: {
        fontSize: 32,
        fontWeight: '900', // Black
        color: COLORS.secondary,
        textAlign: 'left',
    },

    // --- Subtitle Section ---
    subtitleContainer: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    subtitleText: {
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'left',
        fontWeight: '500',
    },

    // --- Form/Login Scroll Container ---
    loginContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
    },

    // --- Input Field Styles ---
    labelContainer: {
        marginTop: 16,
        marginBottom: 8,
    },
    labelText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.secondary,
    },
    textInputContainer: {
        backgroundColor: COLORS.inputBackground,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        paddingHorizontal: 16,
        height: 50,
        justifyContent: 'center',
        // Slight inner shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    textInput: {
        fontSize: 16,
        color: COLORS.secondary,
        padding: 0, // Reset default padding
        flex: 1,
    },

    // --- Button Styles (Login Button) ---
    buttonContainer: {
        marginTop: 30,
        marginBottom: 40, // Extra margin at the bottom for ScrollView and KeyboardAvoidingView
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 10,
        // Stronger shadow effect for the main action button
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.buttonText,
        fontSize: 18,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
})
