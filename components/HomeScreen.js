import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { getCoursesByUserId, createCourse, deleteCourse } from '../services/database';

// Header Component
function Header({ onLogout, username }) {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle1} />
        <View style={styles.logoCircle2} />
        <View style={styles.logoCircle3} />
        <Text style={styles.logoText}>Otter</Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.usernameText}>{username}</Text>
        <TouchableOpacity onPress={onLogout}>
          <MaterialCommunityIcons name="logout" size={28} color="#A0A0A0" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// SortToggle Component with Style Guide Button
function SortToggle({ sortBy, setSortBy, navigation }) {
  return (
    <View style={styles.sortToggleContainer}>
      <TouchableOpacity
        style={styles.styleGuideButton}
        onPress={() => navigation.navigate('StyleGuide')}
      >
        <Text style={styles.styleGuideButtonText}>Style Guide</Text>
      </TouchableOpacity>

      <View style={styles.sortButtonsGroup}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'date' && styles.sortButtonActive,
          ]}
          onPress={() => setSortBy('date')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortBy === 'date' && styles.sortButtonTextActive,
            ]}
          >
            Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === 'name' && styles.sortButtonActive,
          ]}
          onPress={() => setSortBy('name')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortBy === 'name' && styles.sortButtonTextActive,
            ]}
          >
            Name
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// FileGrid Component
function FileGrid({ navigation, courses, onNewCourse, onDeleteCourse, loading }) {
  const renderFileItem = ({ item }) => {
    if (item.type === 'new') {
      return (
        <TouchableOpacity style={styles.fileItem} onPress={onNewCourse}>
          <View style={styles.newBox}>
            <MaterialCommunityIcons name="plus" size={48} color="#3B6FE8" />
          </View>
          <Text style={styles.fileName}>NEW</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.fileItem}
        onPress={() => navigation.navigate('FolderDetail', {
          courseId: item.id,
          courseName: item.name
        })}
        onLongPress={() => {
          Alert.alert(
            'Delete Course',
            `Are you sure you want to delete "${item.name}"? This will also delete all lectures and transcripts.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => onDeleteCourse(item.id) },
            ]
          );
        }}
      >
        <View style={styles.folderBox}>
          <MaterialCommunityIcons name="folder" size={64} color="#7AC5F8" />
        </View>
        <Text style={styles.fileName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const data = [{ id: 'new', type: 'new' }, ...courses];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B6FE8" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderFileItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.fileGridContainer}
    />
  );
}

// Main HomeScreen Component
export default function HomeScreen({ navigation }) {
  const [sortBy, setSortBy] = useState('date');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userCourses = await getCoursesByUserId(user.id);

      // Sort courses
      const sorted = [...userCourses].sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.created_at) - new Date(a.created_at);
        } else {
          return a.name.localeCompare(b.name);
        }
      });

      setCourses(sorted);
    } catch (error) {
      Alert.alert('Error', 'Failed to load courses');
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [sortBy]);

  const handleNewCourse = () => {
    setModalVisible(true);
  };

  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) {
      Alert.alert('Error', 'Please enter a course name');
      return;
    }

    try {
      await createCourse(user.id, newCourseName.trim());
      setNewCourseName('');
      setModalVisible(false);
      loadCourses();
    } catch (error) {
      Alert.alert('Error', 'Failed to create course');
      console.error('Error creating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId, user.id);
      loadCourses();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete course');
      console.error('Error deleting course:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header onLogout={handleLogout} username={user?.username || 'User'} />
        <SortToggle sortBy={sortBy} setSortBy={setSortBy} navigation={navigation} />
        <FileGrid
          navigation={navigation}
          courses={courses}
          onNewCourse={handleNewCourse}
          onDeleteCourse={handleDeleteCourse}
          loading={loading}
        />
      </View>

      {/* New Course Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Course</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter course name"
              value={newCourseName}
              onChangeText={setNewCourseName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setModalVisible(false);
                  setNewCourseName('');
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCreate]}
                onPress={handleCreateCourse}
              >
                <Text style={styles.modalButtonTextCreate}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle1: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B6FE8',
    marginRight: 3,
  },
  logoCircle2: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B6FE8',
    marginRight: 3,
  },
  logoCircle3: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B6FE8',
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B6FE8',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  usernameText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  // SortToggle Styles
  sortToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginBottom: 1,
  },
  styleGuideButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#3B6FE8',
  },
  styleGuideButtonText: {
    fontSize: 13,
    color: 'white',
    fontWeight: '600',
  },
  sortButtonsGroup: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  sortButtonActive: {
    backgroundColor: '#4A4A4A',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  // FileGrid Styles
  fileGridContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 100,
  },
  fileItem: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    maxWidth: '45%',
  },
  newBox: {
    width: 106,
    height: 106,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#3B6FE8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  folderBox: {
    width: 106,
    height: 106,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileName: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#E0E0E0',
  },
  modalButtonCreate: {
    backgroundColor: '#3B6FE8',
  },
  modalButtonTextCancel: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextCreate: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

