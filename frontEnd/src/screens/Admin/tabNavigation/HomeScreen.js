/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView, // Main vertical scroll container
} from 'react-native';
import axios from 'axios';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// IMPORT NEW STYLES
import { styles } from '../../../styles/Admin/tabNavigation/HomeScreen';// Assuming your styles are in HomeScreenStyles.js

// Assuming ipAddress is defined and working
import { ipAddress } from '../../../../config';

export default function HomeScreen() {
    const BASE_URL = ipAddress; // Server URL

    // States
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);

    // Search fields
    const [showProjectSearch, setShowProjectSearch] = useState(false);
    const [projectSearchText, setProjectSearchText] = useState('');
    const [showEmployeeSearch, setShowEmployeeSearch] = useState(false);
    const [employeeSearchText, setEmployeeSearchText] = useState('');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);

            const [projectRes, employeeRes, departmentRes] = await Promise.all([
                axios.get(`${BASE_URL}/projects`),
                axios.get(`${BASE_URL}/employees`),
                axios.get(`${BASE_URL}/departments`),
            ]);

            setProjects(projectRes.data || []);
            setEmployees(employeeRes.data || []);
            setDepartments(departmentRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Filtered lists
    const filteredProjects = projects.filter((p) =>
        p.Name?.toLowerCase().includes(projectSearchText.toLowerCase())
    );

    const filteredEmployees = employees.filter((e) =>
        e.Name?.toLowerCase().includes(employeeSearchText.toLowerCase())
    );

    // Project Card
    const renderProject = ({ item }) => (
        <View style={styles.projectCard}>
            <Text style={styles.projectTitle}>{item.Name}</Text>
            <Text style={styles.projectDescription}>{item.Description}</Text>
            <Text style={styles.projectText}>
                <Text style={{ fontWeight: '600' }}>Dept:</Text> {item.DepartmentName}
            </Text>
            <Text style={styles.projectText}>
                <Text style={{ fontWeight: '600' }}>Budget:</Text> ${item.Budget}
            </Text>
            <View style={styles.projectStatusContainer}>
                <Text style={styles.projectText}>
                    <Text style={{ fontWeight: '600' }}>Status:</Text>
                </Text>
                <Text
                    style={[
                        styles.projectStatusBadge,
                        {
                            backgroundColor:
                                item.Status === 'Completed'
                                    ? '#28A745'
                                    : item.Status === 'In Progress'
                                        ? '#FFC107'
                                        : '#007BFF',
                            color: item.Status === 'In Progress' ? '#212529' : '#FFFFFF',
                        },
                    ]}>
                    {item.Status}
                </Text>
            </View>
            <Text style={styles.projectDuration}>
                {item.StartDate?.split('T')[0]} → {item.EndDate?.split('T')[0]}
            </Text>
        </View>
    );

    // Employee Card
    const renderEmployee = ({ item }) => (
        <View style={styles.employeeCard}>
            <View style={styles.employeeHeader}>
                <Text style={styles.employeeName}>{item.Name}</Text>
                <Text
                    style={[
                        styles.employeeStatus,
                        { color: item.IsActive ? '#28A745' : '#DC3545' },
                    ]}>
                    {item.IsActive ? 'Active' : 'Inactive'}
                </Text>
            </View>
            <View style={styles.employeeDetailRow}>
                <Text style={styles.employeeText}>
                    <Text style={{ fontWeight: '600' }}>Role:</Text> {item.RoleName}
                </Text>
                <Text style={styles.employeeText}>
                    <Text style={{ fontWeight: '600' }}>Dept:</Text> {item.DepartmentName}
                </Text>
            </View>
            <Text style={styles.employeeEmail}>
                <FontAwesome6 name="envelope" size={12} color="#6C757D" /> {item.Email}
            </Text>
        </View>
    );

    // Department Card
    const renderDepartment = ({ item }) => (
        <View style={styles.departmentCard}>
            <FontAwesome6
                name="building"
                size={24}
                color="#007BFF"
                style={{ marginBottom: 10 }}
            />
            <Text style={styles.departmentName}>{item.Name}</Text>
            <Text numberOfLines={3} style={styles.departmentText}>
                {item.Description}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <StatusBar barStyle={'dark-content'} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007BFF" />
                    <Text style={{ marginTop: 10, color: '#495057' }}>Loading data...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <StatusBar barStyle={'dark-content'} backgroundColor={styles.safeAreaView.backgroundColor} />

            {/* Header */}
            <View style={styles.headerContainter}>
                <Text style={styles.headerText}>Admin Dashboard</Text>
            </View>

            {/* The main scrollable area */}
            <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollViewContent}>

                {/* PROJECTS SECTION */}
                <View style={styles.subHeader}>
                    <Text style={styles.subHeaderTitle}>Projects Overview</Text>
                    <TouchableOpacity
                        onPress={() => setShowProjectSearch(!showProjectSearch)}
                        style={styles.searchButton}>
                        <FontAwesome6 name="magnifying-glass" size={18} color="#007BFF" />
                    </TouchableOpacity>
                </View>

                {showProjectSearch && (
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search projects by name..."
                        value={projectSearchText}
                        onChangeText={setProjectSearchText}
                        placeholderTextColor="#ADB5BD"
                    />
                )}

                <FlatList
                    data={filteredProjects}
                    renderItem={renderProject}
                    keyExtractor={(item) => item.Id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalListContainer}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyContainerText}>No projects found.</Text>
                        </View>
                    )}
                />

                {/* EMPLOYEES SECTION */}
                <View style={[styles.subHeader, { marginTop: 25 }]}>
                    <Text style={styles.subHeaderTitle}>Team Members</Text>
                    <TouchableOpacity
                        onPress={() => setShowEmployeeSearch(!showEmployeeSearch)}
                        style={styles.searchButton}>
                        <FontAwesome6 name="magnifying-glass" size={18} color="#007BFF" />
                    </TouchableOpacity>
                </View>

                {showEmployeeSearch && (
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search employees by name..."
                        value={employeeSearchText}
                        onChangeText={setEmployeeSearchText}
                        placeholderTextColor="#ADB5BD"
                    />
                )}

                {/* Employee List - Using FlatList with scrollEnabled={false} for optimization */}
                <View style={styles.employeeListWrapper}>
                    <FlatList
                        data={filteredEmployees}
                        renderItem={renderEmployee}
                        keyExtractor={(item) => item.Id.toString()}
                        scrollEnabled={false} // IMPORTANT: Allows parent ScrollView to handle scrolling
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyContainerText}>No employees found.</Text>
                            </View>
                        )}
                    />
                </View>

                {/* DEPARTMENTS SECTION */}
                <View style={[styles.subHeader, { marginTop: 25 }]}>
                    <Text style={styles.subHeaderTitle}>Departments List</Text>
                </View>

                <FlatList
                    data={departments}
                    renderItem={renderDepartment}
                    keyExtractor={(item) => item.Id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalListContainer}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyContainerText}>No departments found.</Text>
                        </View>
                    )}
                />

                {/* A little space at the bottom */}
                <View style={{ height: 30 }} />

            </ScrollView>
        </SafeAreaView>
    );
}