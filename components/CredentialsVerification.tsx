import { CameraView, useCameraPermissions } from 'expo-camera';
import { Card } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { View } from './Themed';
import { useIsFocused } from '@react-navigation/core';
import { verifyJWTSignature } from '../utils/helpers';
import CredentialData from './CredentialData';
import React from 'react';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Payload } from './CredentialData';
import Toast from 'react-native-root-toast';
import { useTranslation } from 'react-i18next';
import { useSecureStore } from '@/providers/SecureStoreProvider';
import { tenantBrand } from '@/constants/brand';

export default function CredentialsVerification() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanData, setScanData] = useState<string>('');
  const isFocused = useIsFocused();
  const [isValidSignature, setIsValidSignature] = useState<boolean>(false);
  const [isJwtExpired, setIsJwtExpired] = useState<boolean>(false);
  const [credPayload, setCredPayload] = useState<Payload | null>(null);
  const { t } = useTranslation();
  const {issuerPubKey} = useSecureStore();

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    try {
      setScanData(data);
      if (!Boolean(issuerPubKey?.length) || !issuerPubKey) {
        console.log(
          'ERROR: There is no issuer public key to be used for VC signature verification',
        );
        Toast.show(t('Cannot validate VC. Issuer key is missing.'), {
          duration: Toast.durations.LONG,
        });
        return;
      }

      const { payload, isExpired } =  verifyJWTSignature(data, issuerPubKey) ?? {};
      if (!isExpired && Boolean(payload)) {
        setIsValidSignature(true);
        if (payload?.vc) {
          setCredPayload(payload);
        }
        Toast.show(t('VC has been validated'), {
          duration: Toast.durations.LONG,
        });
        return;
      } else if(!isExpired && !Boolean(payload)) {
        Toast.show(t('Invalid VC'), {
          duration: Toast.durations.LONG,
        });
      }else if(isExpired){
        setIsValidSignature(false);
        setIsJwtExpired(true);
        if (payload?.vc) {
          setCredPayload(payload);
        }
        Toast.show(t('VC has expired'), {
          duration: Toast.durations.LONG,
        });
        return;
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        console.error('handleBarCodeScanned', e);
        setIsValidSignature(false);
        Toast.show(t('There was a problem verifying the VC'), {
          duration: Toast.durations.LONG,
        });
        return;
      }
    }
  };

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, []);

  if (!permission) {
    // Permissions have not been loaded yet
    return <Text>{t('Loading')}...</Text>;
  }

  if (permission && !permission.granted) {
    // Permission is not granted
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {t('Camera access is required for scanning the credential.')}
        </Text>
        <View style={styles.buttons}>
          <Button
            labelStyle={styles.buttonLabel}
            style={styles.button}
            onPress={requestPermission}
          >
            {t('Grant Permission')}
          </Button>
        </View>
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
            <View style={styles.errorCard}>
            <Text style={styles.textCard}>{t('INVALID CREDENTIAL')}</Text>
            {isJwtExpired && <Text style={styles.paragraph}>{t('VC has expired')}</Text> }
            </View>
            <Button
              labelStyle={styles.buttonLabel}
              style={styles.button}
              onPress={() => router.replace('/')}
            >
              {t('Ok')}
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
  errorCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'transparent',
    marginBottom:40,
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
    width: 300,
    height: 300,
    borderRadius: 10,
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
  },
  paragraph:{
    padding: 5,
    fontSize: 12,
    color: '#cc0000',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  button: {
    borderRadius: 10,
    padding: 2,
    position: 'absolute',
    right: 2,
    bottom: 2,
    backgroundColor: tenantBrand.primary,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: tenantBrand.onPrimary,
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
