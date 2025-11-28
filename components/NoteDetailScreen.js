import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRecording } from '../contexts/RecordingContext';
import { useAuth } from '../contexts/AuthContext';
import { getTranscriptsByLectureId, createTranscript } from '../services/database';

export default function NoteDetailScreen({ route, navigation }) {
  const { lectureId, lectureTitle, lectureDate, courseName } = route.params;
  const [activeTab, setActiveTab] = useState('Transcript');
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const { user } = useAuth();
  const { registerHandler, unregisterHandler, isProcessing, isRecording, toggleRecording } = useRecording();

  useEffect(() => {
    loadTranscripts();
  }, []);

  const loadTranscripts = async () => {
    try {
      setLoading(true);
      const lectureTranscripts = await getTranscriptsByLectureId(lectureId, user.id);
      setTranscripts(lectureTranscripts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load transcripts');
      console.error('Error loading transcripts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle transcription result
  useEffect(() => {
    const handleTranscription = async (result) => {
      if (result && result.transcription) {
        try {
          // Save transcript to database
          await createTranscript(lectureId, user.id, result.transcription, currentTimestamp);
          // Reload transcripts
          loadTranscripts();
          // Increment timestamp for next recording
          setCurrentTimestamp(prev => prev + 1);
        } catch (error) {
          Alert.alert('Error', 'Failed to save transcript');
          console.error('Error saving transcript:', error);
        }
      }
    };

    registerHandler(handleTranscription);
    return () => unregisterHandler();
  }, [currentTimestamp, lectureId, user.id]);

  // Header Component
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={28} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{lectureTitle}</Text>
        <Text style={styles.headerSubtitle}>{lectureDate}</Text>
      </View>
      <View style={{ width: 28 }} />
    </View>
  );

  // Tab Bar Component
  const TabBar = () => (
    <View style={styles.tabBar}>
      {['Summary', 'Transcript', 'Note'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Transcript Content
  const TranscriptContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B6FE8" />
        </View>
      );
    }

    if (transcripts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="microphone-off" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No transcripts yet</Text>
          <Text style={styles.emptySubtext}>Tap the microphone button to start recording</Text>
        </View>
      );
    }

    const formatTimestamp = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <ScrollView style={styles.transcriptScroll} contentContainerStyle={styles.transcriptContent}>
        {transcripts.map((item, index) => (
          <View key={item.id} style={styles.transcriptItem}>
            <View style={styles.transcriptHeader}>
              <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
              <Text style={styles.speaker}>{user.username}</Text>
            </View>
            <Text style={styles.transcriptText}>{item.content}</Text>
          </View>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    );
  };

  // Summary and Note tabs (placeholder)
  const PlaceholderContent = ({ message, buttonText, onButtonPress }) => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="information-outline" size={64} color="#CCC" />
      <Text style={styles.emptyText}>{message}</Text>
      {buttonText && (
        <TouchableOpacity style={styles.placeholderButton} onPress={onButtonPress}>
          <MaterialCommunityIcons name="plus" size={20} color="white" />
          <Text style={styles.placeholderButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Floating action button for each tab
  const FloatingActionButton = () => {
    if (activeTab === 'Transcript') {
      return (
        <TouchableOpacity
          style={[styles.floatingButton, isRecording && styles.floatingButtonRecording]}
          onPress={toggleRecording}
        >
          <MaterialCommunityIcons
            name={isRecording ? "stop" : "microphone"}
            size={28}
            color="white"
          />
        </TouchableOpacity>
      );
    } else if (activeTab === 'Summary') {
      return (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => Alert.alert('Coming Soon', 'Summary generation feature coming soon')}
        >
          <MaterialCommunityIcons name="text-box-plus-outline" size={28} color="white" />
        </TouchableOpacity>
      );
    } else if (activeTab === 'Note') {
      return (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => Alert.alert('Coming Soon', 'Add note feature coming soon')}
        >
          <MaterialCommunityIcons name="note-plus-outline" size={28} color="white" />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      <TabBar />

      {isProcessing && (
        <View style={styles.processingBanner}>
          <ActivityIndicator size="small" color="white" />
          <Text style={styles.processingText}>Processing audio...</Text>
        </View>
      )}

      {activeTab === 'Transcript' && <TranscriptContent />}
      {activeTab === 'Summary' && (
        <PlaceholderContent
          message="No summary yet"
          buttonText="Generate Summary"
          onButtonPress={() => Alert.alert('Coming Soon', 'Summary generation feature coming soon')}
        />
      )}
      {activeTab === 'Note' && (
        <PlaceholderContent
          message="No notes yet"
          buttonText="Add Note"
          onButtonPress={() => Alert.alert('Coming Soon', 'Add note feature coming soon')}
        />
      )}

      <FloatingActionButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#3B6FE8',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  processingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6FE8',
    paddingVertical: 8,
    gap: 8,
  },
  processingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  transcriptScroll: {
    flex: 1,
  },
  transcriptContent: {
    padding: 20,
  },
  transcriptItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B6FE8',
  },
  speaker: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  transcriptText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  bottomSpacer: {
    height: 100,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B6FE8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingButtonRecording: {
    backgroundColor: '#E8504C',
  },
  placeholderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B6FE8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  placeholderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

