/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useAuth } from '../../../../context/auth';
import { useNavigation } from '@react-navigation/native';
export default function Profile() {
    const { user, logout } = useAuth();
    const navigation = useNavigation()
    const handleLogout = () => {
        logout();
        navigation.navigate('Splash')
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Profile</Text>
            </View>

            {/* Profile Card */}
            <View style={styles.card}>
                <View style={styles.avatarContainer}>
                    <FontAwesome6 name="user-circle" size={80} color="#4F46E5" />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{user?.name || 'N/A'}</Text>

                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{user?.email || 'N/A'}</Text>

                    <Text style={styles.label}>Role</Text>
                    <Text style={styles.value}>{user?.roles || 'N/A'}</Text>
                </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <FontAwesome6 name="right-from-bracket" size={18} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
    },
    card: {
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 15,
        paddingVertical: 25,
        paddingHorizontal: 20,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        marginBottom: 30,
    },
    avatarContainer: {
        marginBottom: 15,
        alignItems: 'center',
    },
    infoContainer: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 10,
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e63946',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        elevation: 2,
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 8,
    },
});
