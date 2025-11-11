import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function StyleGuideScreen({ navigation }) {
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

  // Color Block Component
  const ColorBlock = ({ color, name, hexCode }) => (
    <View style={styles.colorBlockContainer}>
      <View style={[styles.colorBlock, { backgroundColor: color }]} />
      <View style={styles.colorInfo}>
        <Text style={styles.colorName}>{name}</Text>
        <Text style={styles.colorHex}>{hexCode}</Text>
      </View>
    </View>
  );

  // Typography Sample Component
  const TypographySample = ({ fontFamily, fontName, sampleText }) => (
    <View style={styles.typographyContainer}>
      <Text style={styles.fontName}>{fontName}</Text>
      <Text style={[styles.sampleText, { fontFamily }]}>{sampleText}</Text>
    </View>
  );

  // Icon Display Component
  const IconDisplay = ({ iconName, label }) => (
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name={iconName} size={40} color="#3B6FE8" />
      <Text style={styles.iconLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.pageTitle}>Hello World</Text>

        {/* Colors Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Colors</Text>
          <ColorBlock 
            color="#3B6FE8" 
            name="Otter Blue" 
            hexCode="#3B6FE8" 
          />
          <ColorBlock 
            color="#F5F5F7" 
            name="Light Gray" 
            hexCode="#F5F5F7" 
          />
          <ColorBlock 
            color="#E8504C" 
            name="Coral Red" 
            hexCode="#E8504C" 
          />
        </View>

        {/* Typography Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Typography</Text>
          <TypographySample 
            fontFamily="System"
            fontName="Inter (body text)"
            sampleText="The quick brown fox jumps over the lazy dog"
          />
          <TypographySample 
            fontFamily="System"
            fontName="Roboto Bold (headers)"
            sampleText="The Quick Brown Fox Jumps Over"
          />
          <TypographySample 
            fontFamily="System"
            fontName="Noto Sans SC (Chinese text)"
            sampleText="快速的棕色狐狸跳过懒狗"
          />
        </View>

        {/* Icons Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Icons</Text>
          <View style={styles.iconsRow}>
            <IconDisplay iconName="microphone" label="microphone" />
            <IconDisplay iconName="web" label="globe" />
            <IconDisplay iconName="content-save" label="save" />
          </View>
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

  // Page Title
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  // Section Styles
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  // Color Block Styles
  colorBlockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  colorBlock: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  colorInfo: {
    flex: 1,
  },
  colorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  colorHex: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },

  // Typography Styles
  typographyContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  fontName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  sampleText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },

  // Icons Styles
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },

  // Bottom Spacer
  bottomSpacer: {
    height: 20,
  },
});

