import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LanguageSelectionScreen({ route, navigation }) {
  const { currentLanguage } = route.params || {};
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage || 'Chinese (Simplified)');

  const languages = [
    { id: 'en', name: 'English', nativeName: 'English' },
    { id: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
    { id: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
    { id: 'es', name: 'Spanish', nativeName: 'Español' },
    { id: 'fr', name: 'French', nativeName: 'Français' },
    { id: 'de', name: 'German', nativeName: 'Deutsch' },
    { id: 'ja', name: 'Japanese', nativeName: '日本語' },
    { id: 'ko', name: 'Korean', nativeName: '한국어' },
  ];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
    // Navigate back with selected language
    navigation.navigate('NoteDetail', {
      selectedLanguage: language.name
    });
  };

  // Header Component
  const Header = () => (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.dotContainer}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
        </View>
        <Text style={styles.logoText}>Otter</Text>
      </View>
      <TouchableOpacity>
        <MaterialCommunityIcons name="account-circle-outline" size={32} color="#A0A0A0" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      
      {/* Title with Globe Icon */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>LANGUAGE</Text>
        <MaterialCommunityIcons name="web" size={28} color="#E8504C" />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Language List */}
      <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.id}
            style={styles.languageItem}
            onPress={() => handleLanguageSelect(language)}
          >
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                selectedLanguage === language.name && styles.checkboxSelected
              ]}>
                {selectedLanguage === language.name && (
                  <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                )}
              </View>
            </View>
            <View style={styles.languageTextContainer}>
              <Text style={styles.languageName}>{language.name}</Text>
              <Text style={styles.languageNativeName}>{language.nativeName}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Close Button */}
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>CLOSE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dotContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dot1: {
    backgroundColor: '#3B6FE8',
  },
  dot2: {
    backgroundColor: '#5B8FF9',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B6FE8',
  },

  // Title Section
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B6FE8',
    letterSpacing: 1,
  },

  // Divider
  divider: {
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
    marginBottom: 10,
  },

  // Language List
  languageList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkboxContainer: {
    marginRight: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3B6FE8',
    borderColor: '#3B6FE8',
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  languageNativeName: {
    fontSize: 14,
    color: '#666666',
  },

  // Close Button
  closeButton: {
    backgroundColor: '#3B6FE8',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

