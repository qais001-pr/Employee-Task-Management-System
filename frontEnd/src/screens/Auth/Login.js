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
import { styles } from '../../styles/Admin/AdminLogin'

export default function Login() {
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
