import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import React from 'react';
import { Button } from 'react-native-paper';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>

      <Button
        labelStyle={styles.buttonLabel}
        style={styles.button}
        onPress={() => router.replace('/')}
      >
        Home
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 15,
  },
  button: {
    backgroundColor: '#4e957d',
    borderRadius: 15,
    padding: 5,
  },
  buttonLabel: {
    color: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
