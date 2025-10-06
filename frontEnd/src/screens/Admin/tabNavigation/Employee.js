/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { styles } from '../../../styles/Admin/tabNavigation/EmployeeScreen';

export default function Employee() {
    // Sample departments
    const departments = [
        { Id: 1, Name: 'Human Resources' },
        { Id: 3, Name: 'Information Technology' },
        { Id: 2, Name: 'IT' },
        { Id: 4, Name: 'Procurement' },
    ];

    // Sample roles
    const roles = [
        { Id: 3, Name: 'Employee', Permissions: '{"can_view_tasks": true, "can_update_own_progress": true}' },
        { Id: 2, Name: 'Manager', Permissions: '{"can_assign_tasks": true, "can_update_progress": true}' },
        { Id: 1, Name: 'Super Admin', Permissions: 'ALL' },
    ];

    // Employees list
    const [employees, setEmployees] = useState([
        {
            Id: 4,
            Name: 'John Doe',
            Email: 'john.doe@example.com',
            RoleId: 1,
            DepartmentId: 2,
            IsActive: false,
            RoleName: 'Super Admin',
            DepartmentName: 'IT',
        },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [departmentModal, setDepartmentModal] = useState(false);
    const [roleModal, setRoleModal] = useState(false);

    // Form states
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [form, setForm] = useState({
        Name: '',
        Email: '',
        RoleId: null,
        DepartmentId: null,
        IsActive: true,
    });

    // Save or update employee
    const handleSave = () => {
        if (!form.Name || !form.Email || !form.RoleId || !form.DepartmentId) {
            alert('Please fill all fields.');
            return;
        }

        if (selectedEmployee) {
            setEmployees((prev) =>
                prev.map((emp) =>
                    emp.Id === selectedEmployee.Id
                        ? {
                            ...emp,
                            ...form,
                            RoleName: roles.find((r) => r.Id === form.RoleId)?.Name,
                            DepartmentName: departments.find((d) => d.Id === form.DepartmentId)?.Name,
                        }
                        : emp
                )
            );
        } else {
            const newEmployee = {
                ...form,
                Id: Math.floor(Math.random() * 10000),
                RoleName: roles.find((r) => r.Id === form.RoleId)?.Name,
                DepartmentName: departments.find((d) => d.Id === form.DepartmentId)?.Name,
            };
            setEmployees((prev) => [...prev, newEmployee]);
        }

        // Reset form
        setModalVisible(false);
        setSelectedEmployee(null);
        setForm({ Name: '', Email: '', RoleId: null, DepartmentId: null, IsActive: true });
    };

    // Edit employee
    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setForm({
            Name: employee.Name,
            Email: employee.Email,
            RoleId: employee.RoleId,
            DepartmentId: employee.DepartmentId,
            IsActive: employee.IsActive,
        });
        setModalVisible(true);
    };

    // Delete employee
    const handleDelete = (id) => {
        setEmployees((prev) => prev.filter((emp) => emp.Id !== id));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headerText}>Employee Management</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Employees</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                        <FontAwesome6 name="plus" size={18} color="#fff" />
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                {/* Employee List */}
                <FlatList
                    data={employees}
                    keyExtractor={(item) => item.Id.toString()}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#777' }}>No employees found</Text>}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>{item.Name}</Text>
                                <Text style={styles.cardText}>Email: {item.Email}</Text>
                                <Text style={styles.cardText}>Role: {item.RoleName}</Text>
                                <Text style={styles.cardText}>Department: {item.DepartmentName}</Text>
                                <Text style={[styles.cardText, { color: item.IsActive ? 'green' : 'red' }]}>
                                    {item.IsActive ? 'Active' : 'Inactive'}
                                </Text>
                            </View>
                            <View style={styles.cardActions}>
                                <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                                    <FontAwesome6 name="pen-to-square" size={18} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.Id)}>
                                    <FontAwesome6 name="trash" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </ScrollView>

            {/* Add/Edit Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{selectedEmployee ? 'Edit Employee' : 'Add Employee'}</Text>

                        <TextInput
                            placeholder="Full Name"
                            style={styles.input}
                            value={form.Name}
                            onChangeText={(text) => setForm({ ...form, Name: text })}
                        />
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            value={form.Email}
                            onChangeText={(text) => setForm({ ...form, Email: text })}
                        />

                        {/* Department Dropdown */}
                        <TouchableOpacity style={styles.dropdown} onPress={() => setDepartmentModal(true)}>
                            <Text style={styles.dropdownText}>
                                {form.DepartmentId
                                    ? departments.find((d) => d.Id === form.DepartmentId)?.Name
                                    : 'Select Department'}
                            </Text>
                            <FontAwesome6 name="angle-down" size={20} color="#666" />
                        </TouchableOpacity>

                        {/* Role Dropdown */}
                        <TouchableOpacity style={styles.dropdown} onPress={() => setRoleModal(true)}>
                            <Text style={styles.dropdownText}>
                                {form.RoleId ? roles.find((r) => r.Id === form.RoleId)?.Name : 'Select Role'}
                            </Text>
                            <FontAwesome6 name="angle-down" size={20} color="#666" />
                        </TouchableOpacity>

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.btnText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Department Modal */}
            <Modal visible={departmentModal} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.selectModal}>
                        <Text style={styles.modalTitle}>Select Department</Text>
                        {departments.map((dep) => (
                            <TouchableOpacity
                                key={dep.Id}
                                style={styles.selectItem}
                                onPress={() => {
                                    setForm({ ...form, DepartmentId: dep.Id });
                                    setDepartmentModal(false);
                                }}>
                                <Text style={styles.selectText}>{dep.Name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            {/* Role Modal */}
            <Modal visible={roleModal} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.selectModal}>
                        <Text style={styles.modalTitle}>Select Role</Text>
                        {roles.map((role) => (
                            <TouchableOpacity
                                key={role.Id}
                                style={styles.selectItem}
                                onPress={() => {
                                    setForm({ ...form, RoleId: role.Id });
                                    setRoleModal(false);
                                }}>
                                <Text style={styles.selectText}>{role.Name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
