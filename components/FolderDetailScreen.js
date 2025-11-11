import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FolderDetailScreen({ route, navigation }) {
  const { folderName } = route.params;

  // Hardcoded lecture data
  const lectures = [
    { id: 'new', type: 'new', title: 'NEW', date: '' },
    { id: '1', type: 'lecture', number: '1', title: 'Lecture 1', date: 'Apr.5.' },
    { id: '2', type: 'lecture', number: '2', title: 'Lecture 2', date: 'Apr.7.' },
    { id: '3', type: 'lecture', number: '3', title: 'Lecture 3', date: 'Apr.8.' },
    { id: '4', type: 'lecture', number: '4', title: 'Lecture 4', date: 'Apr.16.' },
    { id: '5', type: 'lecture', number: '5', title: 'Lecture 5', date: 'Apr.17.' },
  ];

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
          onPress={() => console.log('Create new lecture')}
        >
          <View style={styles.newLectureContent}>
            <MaterialCommunityIcons name="plus" size={60} color="#7AC5F8" />
          </View>
          <Text style={styles.lectureTitle}>{item.title}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.lectureCard}
        onPress={() => navigation.navigate('NoteDetail', {
          lectureTitle: item.title,
          lectureDate: item.date,
          folderName: folderName
        })}
      >
        <View style={styles.lectureNumberBox}>
          <Text style={styles.lectureNumber}>{item.number}</Text>
        </View>
        <Text style={styles.lectureTitle}>{item.title}</Text>
        <Text style={styles.lectureDate}>{item.date}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Title */}
        <Text style={styles.courseTitle}>{folderName}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Time Sort Button */}
        <TimeSortButton />

        {/* Lecture Grid */}
        <View style={styles.lectureGrid}>
          {lectures.map((lecture, index) => (
            <View key={lecture.id} style={styles.lectureItemWrapper}>
              <LectureItem item={lecture} />
            </View>
          ))}
        </View>

        {/* Bottom spacing for navigation bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
});

