import { CameraView, useCameraPermissions } from 'expo-camera';
import { Card } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { View } from './Themed';
import { useIsFocused } from '@react-navigation/core';
import { getPubKeyFromStore, verifyJWTSignature } from '../utils/helpers';
import CredentialData from './CredentialData';
import React from 'react';
import { useRouter } from 'expo-router';
// import { Image } from 'react-native';
import { Image } from 'expo-image';
import { Payload } from './CredentialData';

export default function CredentialsVerification() {
  const router = useRouter();
  const issuerPubKey = Platform.OS !== 'web' ? getPubKeyFromStore() : '';
  const [permission, requestPermission] = useCameraPermissions();
  const [scanData, setScanData] = useState<string>('');
  const isFocused = useIsFocused();
  const [isValidSignature, setIsValidSignature] = useState<boolean>(false);
  const [credPayload, setCredPayload] = useState<Payload | null>(null);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    try {
      setScanData(data);
      console.log(issuerPubKey);
      if (!Boolean(issuerPubKey?.length) || !issuerPubKey) {
        console.log(
          'ERROR: There is no issuer public key to be used for VC signature verification',
        );
        return;
      }

      const res = await verifyJWTSignature(data, issuerPubKey);
      if (res) {
        console.log(res);
        setIsValidSignature(true);
        if (res.vc) {
          setCredPayload(res);
          console.log(res);
          console.log(res.vc);
        }
        return;
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        console.error('handleBarCodeScanned', e);
        setIsValidSignature(false);
        return;
      }
    }
  };

  useEffect(() => {
    if (!permission || permission.status !== 'granted') {
      requestPermission();
    }
  }, [permission]);

  const handleRequestPermission = () => {
    requestPermission();
  };

  if (!permission) {
    // Permissions have not been loaded yet
    return <Text>Loading...</Text>;
  }

  if (permission.status !== 'granted') {
    // Permission is not granted
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Camera access is required for scanning the credential.
        </Text>
        <Button
          labelStyle={styles.buttonLabel}
          style={styles.button}
          onPress={handleRequestPermission}
        >
          Grant Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && !Boolean(scanData?.length) && (
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanData ? undefined : handleBarCodeScanned}
        />
      )}
      {Boolean(scanData?.length) && isValidSignature && credPayload && (
        <CredentialData credPayload={credPayload} />
      )}
      {Boolean(scanData?.length) && !isValidSignature && (
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Image
              style={styles.image}
              source={require('../assets/images/invalid-icon.png')}
            />
            <Text style={styles.textCard}>INVALID CREDENTIAL</Text>
            <Button
              labelStyle={styles.buttonLabel}
              style={styles.button}
              onPress={() => router.replace('/')}
            >
              Home
            </Button>
          </Card.Content>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#98999b',
    gap: 15,
    width: '100%',
  },
  text: {
    padding: 5,
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
  camera: {
    width: 250,
    height: 250,
  },
  card: {
    borderRadius: 10,
    padding: 8,
    margin: 10,
  },
  cardContent: {
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  textCard: {
    fontWeight: 'bold',
    color: 'rgba(255, 0, 0, 0.7)',
    marginBottom: 80,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  button: {
    backgroundColor: '#4e957d',
    borderRadius: 10,
    padding: 5,
    position: 'absolute',
    right: 2,
    bottom: 2,
  },
  buttonLabel: {
    color: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  separator: {
    marginVertical: 20,
  },
});
