/* eslint-disable jsx-quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable semi */
import React, { useState } from 'react'
import {
    View,
    Text,
    SafeAreaView,
    Image,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Alert, // Import Alert for user feedback
} from 'react-native'
import adminImage from '../../../assets/images/AdminSignUp.png'

import { StyleSheet, Dimensions } from 'react-native'
import axios from 'axios'
import { ipAddress } from '../../../config'
// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window')

// Define a consistent color palette
const COLORS = {
    primary: '#4F46E5',
    secondary: '#374151',
    text: '#4B5563',
    background: '#FFFFFF',
    inputBorder: '#D1D5DB',
    inputBackground: '#F9FAFB',
    buttonText: '#FFFFFF',
}
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../../context/auth'
export default function AdminLogin() {
    const navigation = useNavigation()
    const { login } = useAuth()
    const [email, setEmail] = useState('employee123@gmail.com')
    const [password, setPassword] = useState('Password123')
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    // ----------------------------------------------------------------------
    // FIX: Switched to async/await for proper handling of the Axios call.
    // ----------------------------------------------------------------------
    let handleLogin = async () => {
        // Basic input validation
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        try {
            // Await the POST request
            const response = await axios.post(`${ipAddress}/employees/login`, {
                email: email,
                password: password,
            });

            // Assuming a successful login is indicated by a 2xx status
            if (response.data && response.data.employee) {
                const employeeData = response.data.employee;
                console.log('Login successful for employee:', employeeData);
                if (employeeData.roles === 'employee') {                    
                    Alert.alert('Success', `Logged in as ${employeeData.email}`);
                    login(employeeData)
                    navigation.navigate('EmployeeHomeScreen', { employee: employeeData });
                }
            } else {
                // Handle cases where the request succeeds, but the server response
                // indicates a login failure (e.g., status 200, but data says 'Invalid')
                Alert.alert('Login Failed', 'Invalid response from server.');
            }

        } catch (error) {
            // Handle network errors, 4xx, and 5xx responses
            // console.error('Login Error:', error);
            const errorMessage = error.response
                ? error.response.data.message || 'Invalid email or password.'
                : 'Network error. Please check your connection or IP.';

            Alert.alert('Login Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };


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
                            value={email}
                            onChangeText={setEmail}
                            placeholder='Enter Email here...'
                            style={styles.textInput}
                            autoCapitalize='none'
                            keyboardType='email-address'
                            editable={!isLoading}
                        />
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.labelText}>Password</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder='Enter Password here...'
                            style={styles.textInput}
                            secureTextEntry={true} // Added for password security
                            editable={!isLoading}
                        />
                    </View>
                    <Pressable
                        style={[styles.buttonContainer, isLoading && styles.buttonDisabled]} // Apply disabled style
                        onPress={handleLogin}
                        disabled={isLoading} // Disable button while loading
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Logging In...' : 'Login'}
                        </Text>
                    </Pressable>
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
        // Adjusted flex based on screen height to ensure input fields are visible above the keyboard
        flex: height > 700 ? 0.30 : 0.40,
        justifyContent: 'flex-end',
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
        fontWeight: '900',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    textInput: {
        fontSize: 16,
        color: COLORS.secondary,
        padding: 0,
        flex: 1,
    },
    // --- Button Styles (Login Button) ---
    buttonContainer: {
        marginTop: 30,
        marginBottom: 40,
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 10,
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
    buttonDisabled: {
        backgroundColor: '#9CA3AF', // A muted color for disabled state
        shadowOpacity: 0.1,
        elevation: 1,
    },
})