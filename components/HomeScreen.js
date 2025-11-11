import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Header Component
function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle1} />
        <View style={styles.logoCircle2} />
        <View style={styles.logoCircle3} />
        <Text style={styles.logoText}>Otter</Text>
      </View>
      <TouchableOpacity>
        <MaterialCommunityIcons name="account-circle-outline" size={32} color="#A0A0A0" />
      </TouchableOpacity>
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
function FileGrid({ navigation }) {
  const files = [
    { id: 'new', name: 'NEW', type: 'new' },
    { id: '1', name: 'CIS 515', type: 'folder' },
    { id: '2', name: 'CIS 512', type: 'folder' },
    { id: '3', name: 'CIS 520', type: 'folder' },
    { id: '4', name: 'Journey', type: 'folder' },
    { id: '5', name: 'Guest Speaker', type: 'folder' },
  ];

  const renderFileItem = ({ item }) => {
    if (item.type === 'new') {
      return (
        <TouchableOpacity style={styles.fileItem}>
          <View style={styles.newBox}>
            <MaterialCommunityIcons name="plus" size={48} color="#3B6FE8" />
          </View>
          <Text style={styles.fileName}>{item.name}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.fileItem}
        onPress={() => navigation.navigate('FolderDetail', { folderName: item.name })}
      >
        <View style={styles.folderBox}>
          <MaterialCommunityIcons name="folder" size={64} color="#7AC5F8" />
        </View>
        <Text style={styles.fileName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={files}
      renderItem={renderFileItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.fileGridContainer}
    />
  );
}

// Main HomeScreen Component
export default function HomeScreen({ navigation }) {
  const [sortBy, setSortBy] = useState('date');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />
        <SortToggle sortBy={sortBy} setSortBy={setSortBy} navigation={navigation} />
        <FileGrid navigation={navigation} />
      </View>
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
});

