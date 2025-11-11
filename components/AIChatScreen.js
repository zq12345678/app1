import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AIChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AI Chat Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

