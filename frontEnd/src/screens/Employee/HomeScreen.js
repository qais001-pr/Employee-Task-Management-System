/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
    Modal,
    FlatList as RNFlatList,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../../context/auth';
import { ipAddress } from '../../../config';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, validatePathConfig } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const statusOptions = ['To Do', 'In Progress', 'Pending', 'Done'];

    // ✅ Fetch employee tasks
    useEffect(() => {
        if (user?.id) {
            fetchTasks();
        }
    }, [user]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${ipAddress}/tasks/filter/employee/${user.id}`);
            console.log('Fetched tasks:', res.data);
            setTasks(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            Alert.alert('Error', 'Failed to load tasks from server.');
        } finally {
            setLoading(false);
        }
    };

    // Update task status
    const handleStatusUpdate = async (taskId, newStatus) => {
        console.log(taskId)
        console.log(newStatus)
        try {
            setUpdating(true);
            const progress = newStatus === 'Done' ? 100 : newStatus === 'In Progress' ? 50 : 0;
            await axios.put(`${ipAddress}/tasks/${taskId}`, {
                status: newStatus,
                progress: progress,
            });
            Alert.alert('Success', 'Task status updated successfully.');
            fetchTasks();
        } catch (err) {
            Alert.alert('Error', 'Failed to update task status.');
        } finally {
            setUpdating(false);
        }
    };

    // ✅ Logout
    const handleLogout = () => {
        logout();
        navigation.navigate('Splash');
    };

    // ✅ Open dropdown modal
    const openStatusDropdown = (taskId) => {
        console.log(taskId);
        setSelectedTaskId(taskId);
        setModalVisible(true);
    };

    // ✅ Render each task
    const renderTask = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.Title || 'Untitled Task'}</Text>
            <Text style={styles.desc}>{item.Description || 'No description available.'}</Text>
            <Text style={styles.status}>Current Status: {item.Status}</Text>

            {/* 🔽 Dropdown to select new status */}
            {(item.Status !== 'Done') &&
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => openStatusDropdown(item.Id)}
                >
                    <Text style={styles.dropdownText}>
                        {item.Status || 'Select Status'}
                    </Text>
                    <FontAwesome6 name="chevron-down" size={14} color="#333" />
                </TouchableOpacity>
            }
        </View>
    );

    return (
        <View style={styles.container}>
            {/* ✅ Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Welcome, {user?.name}</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <FontAwesome6 name="right-from-bracket" size={18} color="#fff" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* ✅ Task List */}
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 30 }} />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
                    renderItem={renderTask}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>
                            No tasks found.
                        </Text>
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}

            {/* ✅ Status Dropdown Modal */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <RNFlatList
                            data={statusOptions}
                            keyExtractor={(status) => status}
                            renderItem={({ item: status }) => (
                                <TouchableOpacity
                                    style={styles.optionButton}
                                    onPress={() => {
                                        handleStatusUpdate(selectedTaskId, status);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.optionText}>{status}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* ✅ Overlay while updating */}
            {updating && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={{ color: '#fff', marginTop: 10 }}>Updating status...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f6fa' },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    header: { fontSize: 20, fontWeight: 'bold', color: '#222' },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e63946',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    logoutText: { color: '#fff', marginLeft: 5, fontWeight: 'bold' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 3,
    },
    title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    desc: { color: '#555', marginVertical: 5 },
    status: { fontWeight: '600', color: '#007bff', marginBottom: 10 },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    dropdownText: { color: '#007bff', fontWeight: '600' },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 30,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        maxHeight: '50%',
    },
    optionButton: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 15,
        color: '#333',
    },
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
