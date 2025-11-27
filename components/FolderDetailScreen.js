import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { getLecturesByCourseId, createLecture, deleteLecture } from '../services/database';

export default function FolderDetailScreen({ route, navigation }) {
  const { courseId, courseName } = route.params;
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newLectureTitle, setNewLectureTitle] = useState('');

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    try {
      setLoading(true);
      const courseLectures = await getLecturesByCourseId(courseId, user.id);
      setLectures(courseLectures);
    } catch (error) {
      Alert.alert('Error', 'Failed to load lectures');
      console.error('Error loading lectures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewLecture = () => {
    setModalVisible(true);
  };

  const handleCreateLecture = async () => {
    if (!newLectureTitle.trim()) {
      Alert.alert('Error', 'Please enter a lecture title');
      return;
    }

    try {
      const lectureNumber = lectures.length + 1;
      await createLecture(courseId, user.id, newLectureTitle.trim(), lectureNumber);
      setNewLectureTitle('');
      setModalVisible(false);
      loadLectures();
    } catch (error) {
      Alert.alert('Error', 'Failed to create lecture');
      console.error('Error creating lecture:', error);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    try {
      await deleteLecture(lectureId, user.id);
      loadLectures();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete lecture');
      console.error('Error deleting lecture:', error);
    }
  };

  // Header Component
  const Header = () => (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle1} />
        <View style={styles.logoCircle2} />
        <Text style={styles.logoText}>Otter</Text>
      </View>
      <TouchableOpacity style={styles.userIcon}>
        <MaterialCommunityIcons name="account-circle-outline" size={32} color="#A0A0A0" />
      </TouchableOpacity>
    </View>
  );

  // Time Sort Button
  const TimeSortButton = () => (
    <View style={styles.sortContainer}>
      <TouchableOpacity style={styles.timeSortButton}>
        <Text style={styles.timeSortText}>Time</Text>
        <MaterialCommunityIcons name="unfold-more-horizontal" size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );

  // Lecture Item Component
  const LectureItem = ({ item }) => {
    if (item.type === 'new') {
      return (
        <TouchableOpacity
          style={styles.lectureCard}
          onPress={handleNewLecture}
        >
          <View style={styles.newLectureContent}>
            <MaterialCommunityIcons name="plus" size={60} color="#7AC5F8" />
          </View>
          <Text style={styles.lectureTitle}>NEW</Text>
        </TouchableOpacity>
      );
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      return `${month}.${day}.`;
    };

    return (
      <TouchableOpacity
        style={styles.lectureCard}
        onPress={() => navigation.navigate('NoteDetail', {
          lectureId: item.id,
          lectureTitle: item.title,
          lectureDate: formatDate(item.created_at),
          courseName: courseName
        })}
        onLongPress={() => {
          Alert.alert(
            'Delete Lecture',
            `Are you sure you want to delete "${item.title}"? This will also delete all transcripts.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => handleDeleteLecture(item.id) },
            ]
          );
        }}
      >
        <View style={styles.lectureNumberBox}>
          <Text style={styles.lectureNumber}>{item.lecture_number}</Text>
        </View>
        <Text style={styles.lectureTitle}>{item.title}</Text>
        <Text style={styles.lectureDate}>{formatDate(item.created_at)}</Text>
      </TouchableOpacity>
    );
  };

  const allLectures = [{ id: 'new', type: 'new' }, ...lectures];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Title */}
        <Text style={styles.courseTitle}>{courseName}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Time Sort Button */}
        <TimeSortButton />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B6FE8" />
          </View>
        ) : (
          <View style={styles.lectureGrid}>
            {allLectures.map((lecture, index) => (
              <View key={lecture.id} style={styles.lectureItemWrapper}>
                <LectureItem item={lecture} />
              </View>
            ))}
          </View>
        )}

        {/* Bottom spacing for navigation bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* New Lecture Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Lecture</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter lecture title"
              value={newLectureTitle}
              onChangeText={setNewLectureTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setModalVisible(false);
                  setNewLectureTitle('');
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCreate]}
                onPress={handleCreateLecture}
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
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5F5F7',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle1: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B6FE8',
    marginRight: 4,
  },
  logoCircle2: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B6FE8',
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B6FE8',
  },
  userIcon: {
    padding: 4,
  },

  // Course Title
  courseTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3B6FE8',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },

  // Divider
  divider: {
    height: 3,
    backgroundColor: '#999',
    marginHorizontal: 20,
    marginBottom: 15,
  },

  // Sort Container
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timeSortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timeSortText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
    fontWeight: '500',
  },

  // Lecture Grid
  lectureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  lectureItemWrapper: {
    width: '50%',
    padding: 10,
  },
  lectureCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#7AC5F8',
    padding: 15,
    alignItems: 'center',
    height: 180,
    justifyContent: 'space-between',
  },

  // NEW Lecture Card
  newLectureContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Regular Lecture Card
  lectureNumberBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lectureNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#000',
  },
  lectureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 8,
    textAlign: 'center',
  },
  lectureDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },

  // Bottom Spacer
  bottomSpacer: {
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
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

