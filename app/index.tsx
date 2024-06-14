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

export default function HomeScreen() {
  const [issuerPubKey, setIssuerPubKey] = useState<string | null>(
    Platform.OS !== 'web' ? getPubKeyFromStore() : null,
  );

  const router = useRouter();
  const { data, isLoading, isError, refetch } = useIssuerPubKeyQuery();

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
          <Text style={styles.title}>Verifier App</Text>
          <View style={styles.buttons}>
            {issuerPubKey ? (
              <Button
                labelStyle={styles.buttonLabel}
                style={styles.button}
                onPress={() => router.replace('/walletScreen')}
              >
                Open scanner
              </Button>
            ) : (
              <Button
                labelStyle={styles.buttonLabel}
                style={styles.button}
                onPress={async () => handleFetch()}
              >
                Import issuer key
              </Button>
            )}
          </View>
        </>
      ) : isError ? (
        <>
          <Text style={styles.errorText}>An error occurred</Text>
          <Button
            labelStyle={styles.buttonLabel}
            style={styles.button}
            onPress={() => handleFetch()}
          >
            Retry
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
