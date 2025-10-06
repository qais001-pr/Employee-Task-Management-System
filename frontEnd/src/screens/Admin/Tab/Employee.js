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
  Switch
} from 'react-native';
import axios from 'axios';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { ipAddress } from '../../../../config';
// Base API URL
const EMPLOYEES_API = `${ipAddress}/employees/`;

// --- Employee Card Component ---
const EmployeeCard = ({ employee, onDelete, onEdit }) => {
  const isActiveColor = employee.IsActive ? '#34C759' : '#FF3B30'; // Green for Active, Red for Inactive

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.employeeName}>{employee.Name}</Text>
        <View style={{ flexDirection: 'row' }}>
          {/* Edit Button */}
          <TouchableOpacity onPress={() => onEdit(employee)} style={styles.actionButton}>
            <FontAwesome6 name="pen-to-square" size={18} color="#007AFF" />
          </TouchableOpacity>
          {/* Delete Button */}
          <TouchableOpacity onPress={() => onDelete(employee.Id)} style={styles.actionButton}>
            <FontAwesome6 name="trash-can" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.employeeEmail}>{employee.Email}</Text>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[styles.statusText, { color: isActiveColor, borderColor: isActiveColor }]}>
          {employee.IsActive ? 'ACTIVE' : 'INACTIVE'}
        </Text>
      </View>
    </View>
  );
};

const EmployeeFormModal = ({ isVisible, onClose, onSave, editingEmployee }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);

  const isEditing = !!editingEmployee;

  useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.Name);
      setEmail(editingEmployee.Email);
      setIsActive(editingEmployee.IsActive);
      setPassword(''); // Never pre-fill password for security
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setIsActive(true);
    }
  }, [editingEmployee]);

  const handleSave = () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and Email are required.');
      return;
    }

    if (!isEditing && !password) {
      Alert.alert('Error', 'Password is required for new employees.');
      return;
    }

    const payload = {
      name,
      email,
      // Only include password if creating or if a new one is provided during update
      ...(password && { password }),
      ...(isEditing && { isActive }), // Only send isActive during update
    };

    onSave(editingEmployee ? editingEmployee.Id : null, payload);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{isEditing ? 'Update Employee' : 'Add New Employee'}</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder={isEditing ? 'New Password (optional)' : 'Password (required)'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          {isEditing && (
            <View style={styles.switchRow}>
              <Text style={styles.statusLabel}>Active Status:</Text>
              <Switch
                onValueChange={setIsActive}
                value={isActive}
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor={isActive ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>
          )}

          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={handleSave}
            >
              <Text style={styles.textStyle}>{isEditing ? 'Update' : 'Create'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- Main Employee Component ---
export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null); // Employee object for editing

  // 1. READ (Fetch All Employees)
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(EMPLOYEES_API);
      setEmployees(response.data.sort((a, b) => b.Id - a.Id));
    } catch (e) {
      setError('Could not fetch employees. Is the API server running?');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchEmployees();
  };

  const handleSaveEmployee = async (id, payload) => {
    const isUpdate = !!id;
    const url = isUpdate ? `${EMPLOYEES_API}${id}` : EMPLOYEES_API;
    const method = isUpdate ? 'put' : 'post';
    const action = isUpdate ? 'Updated' : 'Created';

    try {
      await axios({ method, url, data: payload });
      Alert.alert('Success', `Employee ${action} successfully!`);
      fetchEmployees();
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message;
      Alert.alert('Error', `Could not ${action.toLowerCase()} employee: ${errorMessage}`);
    }
  };

  const handleOpenEdit = (employee) => {
    setEditingEmployee(employee);
    setIsModalVisible(true);
  };

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (employeeId) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete Employee ID ${employeeId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${EMPLOYEES_API}${employeeId}`);
              Alert.alert('Success', `Employee ID ${employeeId} deleted.`);
              fetchEmployees();
            } catch (e) {
              const errorMessage = e.response?.data?.message || e.message;
              console.error('Delete Employee Error:', e.response?.data || e.message);
              Alert.alert('Error', `Could not delete employee: ${errorMessage}`);
            }
          },
        },
      ]
    );
  };

  // --- Render Logic ---

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.fullScreenCenter}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading employees...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Employee Directory 🧑‍💻</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={employees}
          renderItem={({ item }) => (
            <EmployeeCard
              employee={item}
              onDelete={handleDeleteEmployee}
              onEdit={handleOpenEdit}
            />
          )}
          keyExtractor={(item) => item.Id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No employees found. Tap '+' to add one!</Text>
          )}
        />
      )}

      {/* Floating Action Button (FAB) for Create */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleOpenCreate}
      >
        <FontAwesome6 name="user-plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Employee Form Modal */}
      <EmployeeFormModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        editingEmployee={editingEmployee}
      />
    </View>
  );
}

// --- Styles ---

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
    paddingBottom: 100, // Make space for FAB
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
    marginBottom: 5,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  employeeEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
  },
  actionButton: {
    marginLeft: 15,
    padding: 5,
  },
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
  // Modal Styles
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
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