import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, ActivityIndicator } from 'react-native-paper';
import '../shim';
import useIssuerPubKeyQuery from '@/hooks/useIssuerPubKey';
import {
  getPubKeyFromStore,
  savePubKeyToStore,
  KEY_DID_SECURE_STORE,
} from '../utils/helpers';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const [issuerPubKey, setIssuerPubKey] = useState<string | null>(
    Platform.OS !== 'web' ? getPubKeyFromStore() : null,
  );
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useIssuerPubKeyQuery();
  const {t} = useTranslation();

  const handleFetch = () => {
    console.log('fetching issuer pub keys');
    refetch(); // Trigger the fetch when the button is pressed
  };

  useEffect(() => {
    if (data) {
      console.log('Data fetched successfully:', data);
      // Extract the 'x' property
      const x = data.x;
      savePubKeyToStore(KEY_DID_SECURE_STORE, x);
      setIssuerPubKey(x!);
    }
  }, [data, setIssuerPubKey]);

  return (
    <View style={styles.container}>
      {!isLoading ? (
        <>
          <Text style={styles.title}>{t('Verifier App')}</Text>
          <View style={styles.buttons}>
            {issuerPubKey ? (
              <Button
                labelStyle={styles.buttonLabel}
                style={styles.button}
                onPress={() => router.replace('/walletScreen')}
              >
                {t('Open scanner')}
              </Button>
            ) : (
              <Button
                labelStyle={styles.buttonLabel}
                style={styles.button}
                onPress={async () => handleFetch()}
              >
                {t('Import issuer key')}
              </Button>
            )}
          </View>
        </>
      ) : isError ? (
        <>
          <Text style={styles.errorText}>{t('An error occurred')}</Text>
          <Button
            labelStyle={styles.buttonLabel}
            style={styles.button}
            onPress={() => handleFetch()}
          >
            {t('Retry')}
          </Button>
        </>
      ) : (
        <ActivityIndicator size="large" color="#4e957d" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#98999b',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4e957d',
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    color: 'white',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: '#4e957d',
    fontSize: 16,
  },
  inputAndroid: {
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: '#4e957d',
    fontSize: 16,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});