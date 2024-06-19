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
          <Text style={styles.title}>{t('Verifier App')}</Text>
          <View style={styles.buttons}>
            <Button
              labelStyle={styles.buttonLabel}
              style={styles.button}
              onPress={() => router.replace('/walletScreen')}
              disabled={issuerPubKey ? false : true}
            >
              {t('Open scanner')}
            </Button>
            <Button
              labelStyle={styles.buttonLabel}
              style={styles.button}
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
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: 'white',
    textAlign: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
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
