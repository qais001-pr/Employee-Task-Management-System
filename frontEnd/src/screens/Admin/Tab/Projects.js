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
} from 'react-native';
import { ipAddress } from '../../../../config';
const PROJECTS_API = `${ipAddress}/projects/`;

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const ProjectCard = ({ project, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return '#007AFF'; // Blue
      case 'Pending': return '#FF9500'; // Orange
      case 'Planning': return '#5AC8FA'; // Light Blue
      case 'Completed': return '#34C759'; // Green
      default: return '#8E8E93'; // Gray
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.projectName}>{project.Name}</Text>
        <TouchableOpacity onPress={() => onDelete(project.Id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.statusText, { color: getStatusColor(project.Status) }]}>
        {project.Status}
      </Text>

      <Text style={styles.descriptionText} numberOfLines={2}>
        {project.Description}
      </Text>

      <View style={styles.detailRow}>
        <Text style={styles.detailText}>Start: {formatDate(project.StartDate)}</Text>
        <Text style={styles.detailText}>End: {formatDate(project.EndDate)}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailText}>Budget: {project.Budget}</Text>
        <Text style={styles.detailText}>Progress: {project.Progress}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${project.Progress}%`, backgroundColor: getStatusColor(project.Status) }]} />
      </View>
    </View>
  );
};

const CreateProjectModal = ({ isVisible, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(formatDate(new Date())); // Default to today
  const [endDate, setEndDate] = useState(formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))); // Default to 30 days later
  const [budget, setBudget] = useState('10000');
  const [status, setStatus] = useState('Planning');

  const handleSave = () => {
    if (!name || !description || !budget || !status) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }


    onSave({
      name,
      description,
      startDate: startDate.replace(/\//g, '-'),
      endDate: endDate.replace(/\//g, '-'),
      budget: parseFloat(budget),
      status,
    });

    // Reset state and close
    setName('');
    setDescription('');
    setBudget('10000');
    setStatus('Planning');
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
          <Text style={styles.modalTitle}>Add New Project</Text>

          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Start Date (YYYY-MM-DD)"
            value={startDate}
            onChangeText={setStartDate}
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            placeholder="End Date (YYYY-MM-DD)"
            value={endDate}
            onChangeText={setEndDate}
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            placeholder="Budget (e.g., 25000)"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Status (e.g., Planning)"
            value={status}
            onChangeText={setStatus}
          />

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
              <Text style={styles.textStyle}>Save Project</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(PROJECTS_API);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data.sort((a, b) => b.Id - a.Id)); // Sort by ID descending
    } catch (e) {
      console.error('Fetch Projects Error:', e);
      setError('Could not fetch projects. Is the API server running?');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Pull-to-Refresh Handler
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchProjects();
  };

  // 2. Create Project (POST)
  const handleSaveProject = async (newProjectData) => {
    try {
      const response = await fetch(PROJECTS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProjectData),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to create project. Status: ${response.status}. Details: ${errorBody}`);
      }

      Alert.alert('Success', 'Project created successfully!');
      fetchProjects(); // Refresh the list
    } catch (e) {
      console.error('Create Project Error:', e);
      Alert.alert('Error', `Could not create project: ${e.message}`);
    }
  };

  const handleDeleteProject = (projectId) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete Project ID ${projectId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${PROJECTS_API}${projectId}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Failed to delete project. Details: ${errorBody}`);
              }

              Alert.alert('Success', `Project ID ${projectId} deleted.`);
              fetchProjects(); // Refresh the list
            } catch (e) {
              console.error('Delete Project Error:', e);
              Alert.alert('Error', `Could not delete project: ${e.message}`);
            }
          },
        },
      ]
    );
  };


  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.fullScreenCenter}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading projects...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Project Management 💼</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={({ item }) => (
            <ProjectCard project={item} onDelete={handleDeleteProject} />
          )}
          keyExtractor={(item) => item.Id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No projects found. Tap '+' to add one!</Text>
          )}
        />
      )}

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <CreateProjectModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveProject}
      />
    </View>
  );
}


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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    flex: 1,
    paddingRight: 10,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#FF3B30',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
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
  fabText: {
    fontSize: 30,
    color: 'white',
    lineHeight: 32,
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
  },
  // Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 35,
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
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    padding: 10,
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
});