import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    TextInput,
    RefreshControl,
    Alert,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { ipAddress } from '../../../../config';
const BASE_API = `${ipAddress}`;
const TASKS_API = `${ipAddress}/tasks/`;

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Standard format for display
    return new Date(dateString).toLocaleDateString();
};



const TaskCard = ({ task, onDelete, onEdit }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress': return '#007AFF';
            case 'To Do': return '#FF9500';
            case 'Done': return '#34C759';
            case 'Pending': return '#FFCC00';
            default: return '#8E8E93';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return '#FF3B30';
            case 'Medium': return '#FF9500';
            case 'Low': return '#34C759';
            default: return '#8E8E93';
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.taskTitle}>{task.Title}</Text>
                <View style={{ flexDirection: 'row' }}>
                    {/* Edit Button */}
                    <TouchableOpacity onPress={() => onEdit(task)} style={styles.actionButton}>
                        <FontAwesome6 name="pen-to-square" size={18} color="#007AFF" />
                    </TouchableOpacity>
                    {/* Delete Button */}
                    <TouchableOpacity onPress={() => onDelete(task.Id)} style={styles.actionButton}>
                        <FontAwesome6 name="trash-can" size={18} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.detailText} numberOfLines={2}>Project: {task.ProjectName}</Text>
            <Text style={styles.detailText}>Assigned To: {task.AssignedToName || 'Unassigned'}</Text>

            <View style={styles.metadataRow}>
                <Text style={[styles.badge, { backgroundColor: getStatusColor(task.Status), color: 'white' }]}>
                    {task.Status}
                </Text>
                <Text style={[styles.badge, { color: getPriorityColor(task.Priority), borderColor: getPriorityColor(task.Priority) }]}>
                    {task.Priority} Priority
                </Text>
                <Text style={styles.detailText}>Due: {formatDate(task.DueDate)}</Text>
            </View>
        </View>
    );
};

// --- Custom Dropdown Component (Modal) (NO CHANGE) ---
const CustomDropdown = ({ isVisible, items, onSelect, onClose, selectedId, placeholder, type }) => {
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.dropdownItem,
                (item.Id?.toString() === selectedId.toString() || item.value === selectedId) && styles.dropdownItemSelected
            ]}
            onPress={() => onSelect(item)}
        >
            <Text style={styles.dropdownItemText}>{item.Name || item.value}</Text>
            {(item.Id?.toString() === selectedId.toString() || item.value === selectedId) && (
                <FontAwesome6 name="check" size={16} color="#007AFF" />
            )}
        </TouchableOpacity>
    );

    const data = type === 'status' ? items.map(val => ({ value: val })) : items;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.dropdownOverlay} onPress={onClose}>
                <View style={styles.dropdownContainer} onStartShouldSetResponder={() => true}>
                    <Text style={styles.dropdownTitle}>{placeholder}</Text>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item.Id?.toString() || item.value || index.toString()}
                        ItemSeparatorComponent={() => <View style={styles.dropdownSeparator} />}
                        ListFooterComponent={() => type !== 'status' && (
                            <TouchableOpacity style={styles.dropdownItem} onPress={() => onSelect({ Id: null, Name: 'Unassigned' })}>
                                <Text style={styles.dropdownItemText}>Unassigned</Text>
                                {selectedId === '' && <FontAwesome6 name="check" size={16} color="#007AFF" />}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
};


// --- Task Form Modal Component (For Create/Update) (NO CHANGE) ---
const TaskFormModal = ({ isVisible, onClose, onSave, editingTask, availableProjects, availableEmployees }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [status, setStatus] = useState('To Do');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState(''); // YYYY-MM-DD
    const [progress, setProgress] = useState('0');

    // State for managing custom dropdown visibility
    const [isProjectDropdownVisible, setIsProjectDropdownVisible] = useState(false);
    const [isEmployeeDropdownVisible, setIsEmployeeDropdownVisible] = useState(false);
    const [isStatusDropdownVisible, setIsStatusDropdownVisible] = useState(false);
    const [isPriorityDropdownVisible, setIsPriorityDropdownVisible] = useState(false);


    const isEditing = !!editingTask;

    // Static list for Status and Priority
    const statuses = ['To Do', 'In Progress', 'Pending', 'Done'];
    const priorities = ['High', 'Medium', 'Low'];

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.Title);
            setDescription(editingTask.Description);
            setProjectId(editingTask.ProjectId.toString());
            // Set to '' (empty string) for unassigned/null employeeId
            setEmployeeId(editingTask.EmployeeId ? editingTask.EmployeeId.toString() : '');
            setStatus(editingTask.Status);
            setPriority(editingTask.Priority);
            setProgress(editingTask.Progress.toString());

            const date = editingTask.DueDate ? new Date(editingTask.DueDate).toISOString().substring(0, 10) : '';
            setDueDate(date);
        } else {
            // Reset for creation
            setTitle('');
            setDescription('');
            setProjectId('');
            setEmployeeId('');
            setStatus('To Do');
            setPriority('Medium');
            setDueDate(new Date().toISOString().substring(0, 10));
            setProgress('0');
        }
    }, [editingTask]);

    const handleSave = () => {
        if (!title || !projectId) {
            Alert.alert('Error', 'Title and Project are required.');
            return;
        }

        const payload = {
            title,
            description,
            projectId: parseInt(projectId),
            // Pass null for unassigned employees
            employeeId: employeeId ? parseInt(employeeId) : null,
            status,
            priority,
            dueDate,
            progress: parseFloat(progress),
        };

        onSave(isEditing ? editingTask.Id : null, payload);
    };

    const currentProject = availableProjects.find(p => p.Id.toString() === projectId);
    const currentEmployee = availableEmployees.find(e => e.Id.toString() === employeeId);

    const getEmployeeName = () => {
        return currentEmployee ? currentEmployee.Name : 'Unassigned';
    };

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={onClose}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>{isEditing ? 'Update Task' : 'Create New Task'}</Text>

                        <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
                        <TextInput style={[styles.input, styles.textArea]} placeholder="Description" value={description} onChangeText={setDescription} multiline />

                        {/* Project Dropdown Trigger */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.pickerLabel}>Project:</Text>
                            <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setIsProjectDropdownVisible(true)}>
                                <Text style={styles.dropdownTriggerText}>{currentProject ? currentProject.Name : 'Select Project'}</Text>
                                <FontAwesome6 name="caret-down" size={16} color="#888" />
                            </TouchableOpacity>
                        </View>

                        {/* Employee Dropdown Trigger */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.pickerLabel}>Assigned To:</Text>
                            <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setIsEmployeeDropdownVisible(true)}>
                                <Text style={styles.dropdownTriggerText}>{getEmployeeName()}</Text>
                                <FontAwesome6 name="caret-down" size={16} color="#888" />
                            </TouchableOpacity>
                        </View>

                        {/* Status Dropdown Trigger */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.pickerLabel}>Status:</Text>
                            <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setIsStatusDropdownVisible(true)}>
                                <Text style={styles.dropdownTriggerText}>{status}</Text>
                                <FontAwesome6 name="caret-down" size={16} color="#888" />
                            </TouchableOpacity>
                        </View>

                        {/* Priority Dropdown Trigger */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.pickerLabel}>Priority:</Text>
                            <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setIsPriorityDropdownVisible(true)}>
                                <Text style={styles.dropdownTriggerText}>{priority}</Text>
                                <FontAwesome6 name="caret-down" size={16} color="#888" />
                            </TouchableOpacity>
                        </View>

                        <TextInput style={styles.input} placeholder="Due Date (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} />
                        <TextInput style={styles.input} placeholder="Progress (%)" value={progress} onChangeText={setProgress} keyboardType="numeric" />

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleSave}>
                                <Text style={styles.textStyle}>{isEditing ? 'Update' : 'Create'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Project Dropdown Modal */}
            <CustomDropdown
                isVisible={isProjectDropdownVisible}
                items={availableProjects}
                selectedId={projectId}
                placeholder="Select Project"
                onSelect={(item) => {
                    setProjectId(item.Id.toString());
                    setIsProjectDropdownVisible(false);
                }}
                onClose={() => setIsProjectDropdownVisible(false)}
                type="project"
            />

            {/* Employee Dropdown Modal */}
            <CustomDropdown
                isVisible={isEmployeeDropdownVisible}
                items={availableEmployees}
                selectedId={employeeId}
                placeholder="Select Employee"
                onSelect={(item) => {
                    // Set employeeId to ID string or empty string for null
                    setEmployeeId(item.Id ? item.Id.toString() : '');
                    setIsEmployeeDropdownVisible(false);
                }}
                onClose={() => setIsEmployeeDropdownVisible(false)}
                type="employee"
            />

            {/* Status Dropdown Modal */}
            <CustomDropdown
                isVisible={isStatusDropdownVisible}
                items={statuses}
                selectedId={status}
                placeholder="Select Status"
                onSelect={(item) => {
                    setStatus(item.value);
                    setIsStatusDropdownVisible(false);
                }}
                onClose={() => setIsStatusDropdownVisible(false)}
                type="status"
            />

            {/* Priority Dropdown Modal */}
            <CustomDropdown
                isVisible={isPriorityDropdownVisible}
                items={priorities}
                selectedId={priority}
                placeholder="Select Priority"
                onSelect={(item) => {
                    setPriority(item.value);
                    setIsPriorityDropdownVisible(false);
                }}
                onClose={() => setIsPriorityDropdownVisible(false)}
                type="status" // Reusing 'status' type for priorities, as they are simple string arrays
            />
        </>
    );
};


// --- Main Tasks Component (MODIFIED) ---
export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Filter state simplified to only handle status/all
    const [filterType, setFilterType] = useState('all'); // 'all' or 'status'
    const [filterValue, setFilterValue] = useState('All'); // 'All' status filter value

    // Filter data lists
    const statusFilters = ['All', 'To Do', 'In Progress', 'Pending', 'Done'];


    // 1. Fetch Utility Function
    const fetchData = useCallback(async (endpoint, setter, errorMsg) => {
        try {
            const response = await axios.get(endpoint);
            setter(response.data);
            return response.data;
        } catch (e) {
            console.error(errorMsg, e.message);
            return [];
        }
    }, []);

    // 2. Fetch Tasks (Includes filtering logic)
    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            let url = TASKS_API;

            // Only apply status filter
            if (filterType === 'status' && filterValue && filterValue !== 'All') {
                url = `${TASKS_API}filter/status/${filterValue}`;
            } else {
                url = TASKS_API;
            }

            const response = await axios.get(url);
            setTasks(response.data.sort((a, b) => b.Id - a.Id));
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.message;
            console.error('Fetch Tasks Error:', errorMessage);
            setError(`Could not fetch tasks. Is the API server running? Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [filterType, filterValue]);

    // 3. Fetch dependencies (Projects and Employees)
    useEffect(() => {
        fetchData(`${BASE_API}/projects/`, setProjects, 'Error fetching projects for dropdown');
        fetchData(`${BASE_API}/employees/`, setEmployees, 'Error fetching employees for dropdown');
    }, [fetchData]);

    // Fetch tasks whenever component loads or filters change
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const onRefresh = () => {
        setIsRefreshing(true);
        fetchTasks();
    };

    // 4. CRUD handlers (No significant change)

    const handleSaveTask = async (id, payload) => {
        const isUpdate = !!id;
        // The endpoint is corrected to remove the trailing slash for POST (create)
        const url = isUpdate ? `${TASKS_API}${id}` : TASKS_API.slice(0, -1);
        const method = isUpdate ? 'put' : 'post';
        const action = isUpdate ? 'Updated' : 'Created';

        try {
            await axios({ method, url, data: payload });
            Alert.alert('Success', `Task ${action} successfully!`);
            fetchTasks();
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.message;
            console.error(`${action} Task Error:`, e.response?.data || e.message);
            Alert.alert('Error', `Could not ${action.toLowerCase()} task: ${errorMessage}`);
        }
    };

    const handleOpenEdit = (task) => {
        setEditingTask(task);
        setIsModalVisible(true);
    };

    const handleOpenCreate = () => {
        setEditingTask(null);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingTask(null);
    };

    const handleDeleteTask = (taskId) => {
        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete Task ID ${taskId}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.delete(`${TASKS_API}${taskId}`);
                            Alert.alert('Success', `Task ID ${taskId} deleted.`);
                            fetchTasks();
                        } catch (e) {
                            const errorMessage = e.response?.data?.message || e.message;
                            console.error('Delete Task Error:', e.response?.data || e.message);
                            Alert.alert('Error', `Could not delete task: ${errorMessage}`);
                        }
                    },
                },
            ]
        );
    };

    // Updated handler for status filter buttons
    const handleFilterButtonPress = (status) => {
        if (status === 'All') {
            setFilterType('all');
            setFilterValue('All');
        } else {
            setFilterType('status');
            setFilterValue(status);
        }
    };

    // --- Render Logic ---

    if (isLoading && !isRefreshing) {
        return (
            <View style={styles.fullScreenCenter}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{ marginTop: 10 }}>Loading tasks...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Task Manager 📝</Text>

            <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filter By Status:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    {statusFilters.map(status => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filterButton,
                                (filterType === 'status' && filterValue === status) || (filterType === 'all' && status === 'All') ? styles.filterButtonActive : {},
                            ]}
                            onPress={() => handleFilterButtonPress(status)} // Call with only status
                        >
                            <Text style={[
                                styles.filterButtonText,
                                (filterType === 'status' && filterValue === status) || (filterType === 'all' && status === 'All') ? styles.filterButtonTextActive : {},
                            ]}>{status}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                {/* REMOVED: filterActionRow containing Employee and Project filter buttons */}
            </View>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    renderItem={({ item }) => (
                        <TaskCard task={item} onDelete={handleDeleteTask} onEdit={handleOpenEdit} />
                    )}
                    keyExtractor={(item) => item.Id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>
                            {filterType === 'all' ? 'No tasks found. Tap "+" to add one!' : 'No tasks match the current filter.'}
                        </Text>
                    )}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={handleOpenCreate}
            >
                <FontAwesome6 name="plus" size={24} color="white" />
            </TouchableOpacity>

            <TaskFormModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onSave={handleSaveTask}
                editingTask={editingTask}
                availableProjects={projects}
                availableEmployees={employees}
            />
        </View>
    );
}

// --- Styles (MODIFIED to remove unused styles) ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    fullScreenCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        color: '#1C1C1E',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        paddingRight: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    metadataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    badge: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        borderWidth: 1,
        overflow: 'hidden',
    },
    actionButton: {
        marginLeft: 15,
        padding: 5,
    },
    // Filtering Styles
    filterContainer: {
        paddingVertical: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    filterScroll: {
        paddingLeft: 20,
        paddingRight: 20, // Adjusted padding
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#007AFF',
        backgroundColor: '#fff',
        marginRight: 8,
        marginBottom: 5,
    },
    filterButtonActive: {
        backgroundColor: '#007AFF',
    },
    filterButtonText: {
        color: '#007AFF',
        fontWeight: '500',
        fontSize: 13,
    },
    filterButtonTextActive: {
        color: 'white',
    },
    // REMOVED: filterActionRow and filterActionButton styles
    // FAB Styles
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 100,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    // Modal Styles for Form (NO CHANGE)
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 30,
        alignItems: 'stretch',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        height: 44,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 80,
        paddingTop: 10,
        textAlignVertical: 'top',
    },
    pickerLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 5,
    },
    inputGroup: {
        marginBottom: 10,
    },
    dropdownTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 44,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
    },
    dropdownTriggerText: {
        fontSize: 16,
        color: '#333',
    },
    // Custom Dropdown Modal Styles (NO CHANGE)
    dropdownOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    dropdownContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '80%',
        maxHeight: '70%',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    dropdownTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownItemSelected: {
        backgroundColor: '#F0F8FF',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownSeparator: {
        height: 1,
        backgroundColor: '#eee',
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        borderRadius: 8,
        padding: 12,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonClose: {
        backgroundColor: '#8E8E93',
    },
    buttonSave: {
        backgroundColor: '#007AFF',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    errorContainer: {
        padding: 20,
        backgroundColor: '#FFE5E5',
        borderRadius: 8,
        margin: 20,
        alignItems: 'center',
    },
    errorText: {
        color: '#CC0000',
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#999',
    }
});