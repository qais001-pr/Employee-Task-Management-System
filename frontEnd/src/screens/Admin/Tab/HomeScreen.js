import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { ipAddress } from '../../../../config';
// --- API Endpoints ---
const PROJECTS_API = `${ipAddress}/projects/`;
const EMPLOYEES_API = `${ipAddress}/employees/`;
const TASKS_API = `${ipAddress}/tasks/`;

const ProjectItem = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.Name}</Text>
    <Text style={styles.cardDetail}>Status: {item.Status}</Text>
    <Text style={styles.cardDetail}>Budget: {item.Budget.toLocaleString()}</Text>
  </View>
);

const EmployeeItem = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.Name}</Text>
    <Text style={styles.cardDetail}>{item.Email}</Text>
    <Text style={[styles.cardDetail, { color: item.IsActive ? 'green' : 'red' }]}>
      {item.IsActive ? 'Active' : 'Inactive'}
    </Text>
  </View>
);

const TaskItem = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.Title}</Text>
    <Text style={styles.cardDetail}>Project: {item.ProjectName}</Text>
    <Text style={styles.cardDetail}>Priority: {item.Priority}</Text>
    <Text style={styles.cardDetail}>Assigned: {item.AssignedToName || 'Unassigned'}</Text>
  </View>
);

// --- Main HomeScreen Component ---

export default function HomeScreen() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from a given URL
  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (e) {
      return null;
    }
  };
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [projectData, employeeData, taskData] = await Promise.all([
          fetchData(PROJECTS_API),
          fetchData(EMPLOYEES_API),
          fetchData(TASKS_API),
        ]);

        if (projectData && employeeData && taskData) {
          setProjects(projectData);
          setEmployees(employeeData);
          setTasks(taskData);
        } else {
          setError('Failed to load all data. Check server status.');
        }
      } catch (e) {
        setError('An unexpected error occurred during data fetching.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);


  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard Overview 📊</Text>

      <View>
        <Text style={styles.sectionTitle}>All Projects ({projects.length})</Text>
        <FlatList
          data={projects}
          renderItem={({ item }) => <ProjectItem item={item} />}
          keyExtractor={(item) => item.Id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <View style={styles.separator} />

      <View>
        <Text style={styles.sectionTitle}>All Employees ({employees.length})</Text>
        <FlatList
          data={employees}
          renderItem={({ item }) => <EmployeeItem item={item} />}
          keyExtractor={(item) => item.Id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <View style={styles.separator} />

      <View>
        <Text style={styles.sectionTitle}>All Tasks ({tasks.length})</Text>
        <FlatList
          data={tasks}
          renderItem={({ item }) => <TaskItem item={item} />}
          keyExtractor={(item) => item.Id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <View style={{ height: 50 }} /> 
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 15,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 15,
    color: '#555',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginRight: 15,
    width: 200, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007AFF',
  },
  cardDetail: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
    marginHorizontal: 20,
  }
});