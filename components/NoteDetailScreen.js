import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRecording } from '../contexts/RecordingContext';
import { useAuth } from '../contexts/AuthContext';
import { getTranscriptsByLectureId, createTranscript } from '../services/database';

export default function NoteDetailScreen({ route, navigation }) {
  const { lectureId, lectureTitle, lectureDate, courseName } = route.params;
  const [activeTab, setActiveTab] = useState('Transcript');
  const [transcripts, setTranscripts] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [transcriptInput, setTranscriptInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const { user } = useAuth();
  const { registerHandler, unregisterHandler, isProcessing, isRecording, toggleRecording } = useRecording();
  const scrollViewRef = useRef(null);

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

  // Handle manual transcript input
  const handleSendTranscript = async () => {
    if (!transcriptInput.trim()) {
      return;
    }

    try {
      await createTranscript(lectureId, user.id, transcriptInput.trim(), currentTimestamp);
      setTranscriptInput('');
      loadTranscripts();
      setCurrentTimestamp(prev => prev + 1);
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transcript');
      console.error('Error saving transcript:', error);
    }
  };

  // Handle manual note input
  const handleSendNote = async () => {
    if (!noteInput.trim()) {
      return;
    }

    // For now, save notes as transcripts with a special marker
    // In a real app, you might have a separate notes table
    try {
      const noteContent = `[Note] ${noteInput.trim()}`;
      await createTranscript(lectureId, user.id, noteContent, currentTimestamp);
      setNoteInput('');
      loadTranscripts();
      setCurrentTimestamp(prev => prev + 1);
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
      console.error('Error saving note:', error);
    }
  };

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
          <Text style={styles.emptySubtext}>Use voice recording or type below to add transcripts</Text>
        </View>
      );
    }

    const formatTimestamp = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <ScrollView
        ref={scrollViewRef}
        style={styles.transcriptScroll}
        contentContainerStyle={styles.transcriptContent}
        keyboardShouldPersistTaps="handled"
      >
        {transcripts.filter(item => !item.content.startsWith('[Note]')).map((item, index) => (
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

  // Note Content
  const NoteContent = () => {
    const noteItems = transcripts.filter(item => item.content.startsWith('[Note]'));

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B6FE8" />
        </View>
      );
    }

    if (noteItems.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="note-text-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No notes yet</Text>
          <Text style={styles.emptySubtext}>Use voice or type below to add notes</Text>
        </View>
      );
    }

    const formatTimestamp = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <ScrollView
        style={styles.transcriptScroll}
        contentContainerStyle={styles.transcriptContent}
        keyboardShouldPersistTaps="handled"
      >
        {noteItems.map((item, index) => (
          <View key={item.id} style={styles.noteItem}>
            <View style={styles.transcriptHeader}>
              <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
              <Text style={styles.speaker}>{user.username}</Text>
            </View>
            <Text style={styles.transcriptText}>{item.content.replace('[Note] ', '')}</Text>
          </View>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    );
  };

  // Summary placeholder content
  const SummaryContent = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="text-box-outline" size={64} color="#CCC" />
      <Text style={styles.emptyText}>No summary yet</Text>
      <TouchableOpacity
        style={styles.generateButton}
        onPress={() => Alert.alert('Coming Soon', 'Summary generation feature coming soon')}
      >
        <MaterialCommunityIcons name="auto-fix" size={20} color="white" />
        <Text style={styles.generateButtonText}>Generate Summary</Text>
      </TouchableOpacity>
    </View>
  );

  // Bottom Input Bar for Transcript
  const TranscriptInputBar = () => (
    <View style={styles.inputBarContainer}>
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Type transcript here..."
          placeholderTextColor="#999"
          value={transcriptInput}
          onChangeText={setTranscriptInput}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.micButton, isRecording && styles.micButtonRecording]}
          onPress={toggleRecording}
        >
          <MaterialCommunityIcons
            name={isRecording ? "stop" : "microphone"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendButton, !transcriptInput.trim() && styles.sendButtonDisabled]}
          onPress={handleSendTranscript}
          disabled={!transcriptInput.trim()}
        >
          <MaterialCommunityIcons name="send" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Bottom Input Bar for Notes
  const NoteInputBar = () => (
    <View style={styles.inputBarContainer}>
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Type note here..."
          placeholderTextColor="#999"
          value={noteInput}
          onChangeText={setNoteInput}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.micButton, isRecording && styles.micButtonRecording]}
          onPress={toggleRecording}
        >
          <MaterialCommunityIcons
            name={isRecording ? "stop" : "microphone"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendButton, !noteInput.trim() && styles.sendButtonDisabled]}
          onPress={handleSendNote}
          disabled={!noteInput.trim()}
        >
          <MaterialCommunityIcons name="send" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Header />
        <TabBar />

        {isProcessing && (
          <View style={styles.processingBanner}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.processingText}>Processing audio...</Text>
          </View>
        )}

        <View style={styles.contentContainer}>
          {activeTab === 'Transcript' && <TranscriptContent />}
          {activeTab === 'Summary' && <SummaryContent />}
          {activeTab === 'Note' && <NoteContent />}
        </View>

        {activeTab === 'Transcript' && <TranscriptInputBar />}
        {activeTab === 'Note' && <NoteInputBar />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
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
    paddingBottom: 20,
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
  noteItem: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB800',
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
    height: 20,
  },
  // Input bar styles
  inputBarContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F5F5F7',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 8,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B6FE8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  micButtonRecording: {
    backgroundColor: '#E8504C',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B6FE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#B0C4E8',
  },
  // Generate summary button
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B6FE8',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 20,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});