import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Alert,
    Platform,
  } from 'react-native';
  
import {
  getEncryptedAsyncStorageInstance,
  SecureStore,
} from '@/services/secure-store';
import { KEY_ISSUER_PK_SECURE_STORE } from '@/utils/helpers';

 type SecureStoreContextType = {
   secureStoreInstance: SecureStore| null;
   issuerPubKey: string | null;
   setIssuerPubKey: React.Dispatch<React.SetStateAction<string | null>>;
 };

const SecureStoreContext = createContext<SecureStoreContextType | undefined>(undefined);

export const useSecureStore = () => {
  const context = useContext(SecureStoreContext);
  if (!context) {
    throw new Error('useSecureStore must be used within a SecureStoreProvider');
  }
  return context;
};

export const SecureStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [secureStoreInstance, setSecureStore] = useState<SecureStore| null>(null);
  const [issuerPubKey, setIssuerPubKey] = useState<string | null>(null);

  useEffect(() => {
    const initializeSecureStore = async () => {
      if (Platform.OS !== 'web') {
        try {
          const store = await getEncryptedAsyncStorageInstance();
          if (store) {
            setSecureStore(store);
            const issuerPubKey = await store!.getItem(KEY_ISSUER_PK_SECURE_STORE);
            if (issuerPubKey) {
              setIssuerPubKey(issuerPubKey);
            }
          } else {
            Alert.alert('Error', 'Failed to initialize secure storage.');
          }
        } catch (error) {
          console.error('Failed to initialize secure store:', error);
          Alert.alert('Error', 'An unexpected error occurred.');
        }
      } else {
        console.warn('Secure storage is not available on the web platform.');
      }
    };

    initializeSecureStore();

  }, []);

  return (
    <SecureStoreContext.Provider value={{ secureStoreInstance, issuerPubKey, setIssuerPubKey }} >
      {children}
    </SecureStoreContext.Provider>
  );
};
