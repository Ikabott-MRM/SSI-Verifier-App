import React from 'react';
import { View, StyleSheet } from 'react-native';
import CredentialsVerification from '../components/CredentialsVerification';

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <CredentialsVerification />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#98999b',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
