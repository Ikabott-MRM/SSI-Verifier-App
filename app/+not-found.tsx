import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text, View } from '@/components/Themed';
import React from 'react';
import { Button } from 'react-native-paper';

export default function NotFoundScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Not found message')}</Text>

      <Button
        labelStyle={styles.buttonLabel}
        style={styles.button}
        onPress={() => router.replace('/')}
      >
        {t('Home')}
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
