import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Keyboard,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRecording } from '../contexts/RecordingContext';
import { useAuth } from '../contexts/AuthContext';
import { getTranscriptsByLectureId, createTranscript, deleteTranscript, updateTranscript } from '../services/database';

export default function NoteDetailScreen({ route, navigation }) {
  const { lectureId, lectureTitle, lectureDate, courseName } = route.params;
  const [activeTab, setActiveTab] = useState('Transcript');
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transcriptInput, setTranscriptInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useAuth();
  const { registerHandler, unregisterHandler, isProcessing, isRecording, toggleRecording } = useRecording();
  const scrollViewRef = useRef(null);
  const transcriptInputRef = useRef(null);
  const noteInputRef = useRef(null);

  useEffect(() => {
    loadTranscripts();
  }, [loadTranscripts]);

  const loadTranscripts = useCallback(async () => {
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
  }, [lectureId, user.id]);

  // Handle transcription result from voice recording
  const handleTranscription = useCallback(async (result) => {
    if (result && result.transcription) {
      try {
        let content = result.transcription;
        // If currently in Note tab, save as a note
        if (activeTab === 'Note') {
          content = `[Note] ${content}`;
        }

        await createTranscript(lectureId, user.id, content, 0);
        loadTranscripts();
      } catch (error) {
        Alert.alert('Error', 'Failed to save transcript');
        console.error('Error saving transcript:', error);
      }
    }
  }, [lectureId, user.id, loadTranscripts, activeTab]);

  useEffect(() => {
    registerHandler(handleTranscription);
    return () => unregisterHandler();
  }, [handleTranscription, registerHandler, unregisterHandler]);

  // Format time from ISO string to HH:MM
  // Format time from ISO string to YYYY/MM/DD-HH:mm
  const formatTime = useCallback((isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day}-${hours}:${minutes}`;
  }, []);

  // Handle manual transcript input
  const handleSendTranscript = useCallback(async () => {
    if (!transcriptInput.trim()) {
      return;
    }

    try {
      await createTranscript(lectureId, user.id, transcriptInput.trim(), 0);
      setTranscriptInput('');
      Keyboard.dismiss(); // Dismiss keyboard after sending
      loadTranscripts();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transcript');
      console.error('Error saving transcript:', error);
    }
  }, [transcriptInput, lectureId, user.id, loadTranscripts]);

  // Handle manual note input
  const handleSendNote = useCallback(async () => {
    if (!noteInput.trim()) {
      return;
    }

    try {
      const noteContent = `[Note] ${noteInput.trim()}`;
      await createTranscript(lectureId, user.id, noteContent, 0);
      setNoteInput('');
      Keyboard.dismiss(); // Dismiss keyboard after sending
      loadTranscripts();
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
      console.error('Error saving note:', error);
    }
  }, [noteInput, lectureId, user.id, loadTranscripts]);

  // Handle delete
  const handleDelete = useCallback((item) => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTranscript(item.id, user.id);
              loadTranscripts();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
              console.error('Error deleting item:', error);
            }
          }
        }
      ]
    );
  }, [user.id, loadTranscripts]);

  // Handle edit
  const handleEdit = useCallback((item) => {
    const content = item.content.startsWith('[Note] ')
      ? item.content.replace('[Note] ', '')
      : item.content;
    setEditingItem(item);
    setEditContent(content);
    setShowEditModal(true);
  }, []);

  // Save edited content
  const handleSaveEdit = useCallback(async () => {
    if (!editContent.trim() || !editingItem) {
      return;
    }

    try {
      const newContent = editingItem.content.startsWith('[Note] ')
        ? `[Note] ${editContent.trim()}`
        : editContent.trim();
      await updateTranscript(editingItem.id, user.id, newContent);
      setShowEditModal(false);
      setEditingItem(null);
      setEditContent('');
      loadTranscripts();
    } catch (error) {
      Alert.alert('Error', 'Failed to update item');
      console.error('Error updating item:', error);
    }
  }, [editContent, editingItem, user.id, loadTranscripts]);

  // Header Component
  const renderHeader = () => (
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
  const renderTabBar = () => (
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
  const renderTranscriptContent = () => {
    const transcriptItems = transcripts.filter(item => !item.content.startsWith('[Note]'));

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B6FE8" />
        </View>
      );
    }

    if (transcriptItems.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="microphone-off" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No transcripts yet</Text>
          <Text style={styles.emptySubtext}>Use voice recording or type below to add transcripts</Text>
        </View>
      );
    }

    return (
      <ScrollView
        ref={scrollViewRef}
        style={styles.transcriptScroll}
        contentContainerStyle={styles.transcriptContent}
        keyboardShouldPersistTaps="handled"
      >
        {transcriptItems.map((item) => (
          <View key={item.id} style={styles.transcriptItem}>
            <View style={styles.itemHeader}>
              <View style={styles.itemHeaderLeft}>
                <Text style={styles.timestamp}>{formatTime(item.created_at)}</Text>
                <Text style={styles.speaker}>{user.username}</Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEdit(item)}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={18} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDelete(item)}
                >
                  <MaterialCommunityIcons name="delete-outline" size={18} color="#E8504C" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.transcriptText}>{item.content}</Text>
          </View>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    );
  };

  // Note Content
  const renderNoteContent = () => {
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

    return (
      <ScrollView
        style={styles.transcriptScroll}
        contentContainerStyle={styles.transcriptContent}
        keyboardShouldPersistTaps="handled"
      >
        {noteItems.map((item) => (
          <View key={item.id} style={styles.noteItem}>
            <View style={styles.itemHeader}>
              <View style={styles.itemHeaderLeft}>
                <Text style={styles.timestampNote}>{formatTime(item.created_at)}</Text>
                <Text style={styles.speaker}>{user.username}</Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEdit(item)}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={18} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDelete(item)}
                >
                  <MaterialCommunityIcons name="delete-outline" size={18} color="#E8504C" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.transcriptText}>{item.content.replace('[Note] ', '')}</Text>
          </View>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    );
  };

  // Summary placeholder content
  const renderSummaryContent = () => (
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
  const renderTranscriptInputBar = () => (
    <View style={styles.inputBarContainer}>
      <View style={styles.inputBar}>
        <TextInput
          ref={transcriptInputRef}
          style={styles.textInput}
          placeholder="Type transcript here..."
          placeholderTextColor="#999"
          value={transcriptInput}
          onChangeText={setTranscriptInput}
          multiline
          maxLength={1000}
          blurOnSubmit={false}
          returnKeyType="default"
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
  const renderNoteInputBar = () => (
    <View style={styles.inputBarContainer}>
      <View style={styles.inputBar}>
        <TextInput
          ref={noteInputRef}
          style={styles.textInput}
          placeholder="Type note here..."
          placeholderTextColor="#999"
          value={noteInput}
          onChangeText={setNoteInput}
          multiline
          maxLength={1000}
          blurOnSubmit={false}
          returnKeyType="default"
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

  // Edit Modal
  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowEditModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.modalInput}
            value={editContent}
            onChangeText={setEditContent}
            multiline
            autoFocus
            placeholder="Enter content..."
            placeholderTextColor="#999"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalSaveButton, !editContent.trim() && styles.modalSaveButtonDisabled]}
              onPress={handleSaveEdit}
              disabled={!editContent.trim()}
            >
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {renderHeader()}
        {renderTabBar()}

        {isProcessing && (
          <View style={styles.processingBanner}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.processingText}>Processing audio...</Text>
          </View>
        )}

        <View style={styles.contentContainer}>
          {activeTab === 'Transcript' && renderTranscriptContent()}
          {activeTab === 'Summary' && renderSummaryContent()}
          {activeTab === 'Note' && renderNoteContent()}
        </View>

        {activeTab === 'Transcript' && renderTranscriptInputBar()}
        {activeTab === 'Note' && renderNoteInputBar()}
      </KeyboardAvoidingView>

      {renderEditModal()}
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
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
    marginRight: 12,
  },
  timestampNote: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E6A800',
    marginRight: 12,
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
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 90 : 80, // Account for bottom tab bar (70px) + safe area
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  modalSaveButton: {
    backgroundColor: '#3B6FE8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalSaveButtonDisabled: {
    backgroundColor: '#B0C4E8',
  },
  modalSaveText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});