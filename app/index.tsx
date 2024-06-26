import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button, ActivityIndicator } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';

import '../shim';
import useIssuerPubKeyQuery from '@/hooks/useIssuerPubKey';
import {
  getPubKeyFromStore,
  savePubKeyToStore,
  KEY_DID_SECURE_STORE,
} from '../utils/helpers';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-root-toast';

export default function HomeScreen() {
  const [issuerPubKey, setIssuerPubKey] = useState<string | null>(
    Platform.OS !== 'web' ? getPubKeyFromStore() : null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useIssuerPubKeyQuery();
  const { t } = useTranslation();

  const handleFetch = () => {
    if (issuerPubKey) {
      setModalVisible(true);
    } else {
      refetch(); // Trigger the fetch when the button is pressed
    }
  };

  const confirmFetch = () => {
    setModalVisible(false);
    refetch();
  };

  useEffect(() => {
    if (data) {
      console.log('Data fetched successfully:', data);
      // Extract the 'x' property
      const x = data.x;
      savePubKeyToStore(KEY_DID_SECURE_STORE, x);
      setIssuerPubKey(x!);
      Toast.show(t('Issuer public key has been saved'), {
        duration: Toast.durations.LONG,
      });
    }
  }, [data, setIssuerPubKey]);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              {t('Are you sure you want to import a new key?')}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>{t('No')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={async () => confirmFetch()}
              >
                <Text style={styles.modalButtonText}>{t('Yes')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {!isLoading ? (
        <>
          <Text style={styles.h1}>{t('Verifier App')}</Text>
          <View>
            {issuerPubKey && (
              <Button
                labelStyle={styles.buttonLabel}
                style={styles.button}
                contentStyle={styles.buttonContent}
                onPress={() => router.replace('/walletScreen')}
              >
                <View style={styles.buttonContent}>
                  <Ionicons
                    name="qr-code-outline"
                    size={20}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonLabel}>{t('Open scanner')}</Text>
                </View>
              </Button>
            )}
            <Button
              labelStyle={styles.buttonLabelImport}
              style={styles.buttonImport}
              onPress={async () => handleFetch()}
            >
              {t('Import key')}
            </Button>
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 50,
    marginBottom: 0,
  },
  scrollView: {
    marginTop: 10,
    marginBottom: 0,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    width: 250,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 25,
    fontSize: 16,
    fontFamily: 'Roboto',
    backgroundColor: '#374D6B',
  },
  buttonImport: {
    marginTop: 400,
    width: 250,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 25,
    fontSize: 16,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#374D6B',
  },
  buttonLabelImport: {
    fontSize: 16,
    textAlign: 'left',
    paddingHorizontal: 0,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#374D6B',
    marginLeft: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    textAlign: 'left',
    paddingHorizontal: 0,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#ffffff',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#374D6B',
    textAlign: 'center',
    marginBottom: 40,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374D6B',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Roboto',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    backgroundColor: '#4e957d',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
