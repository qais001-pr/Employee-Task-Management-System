/* eslint-disable semi */
import { View, SafeAreaView, Image, Text, StatusBar, Pressable } from 'react-native'
import React from 'react'
// image
import image from '../../../assets/images/login.png'
// import styleSheet
import { styles } from '../../styles/Mock/SplashScreen'

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

