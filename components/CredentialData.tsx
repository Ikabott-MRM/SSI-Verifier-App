import { Card, Button } from 'react-native-paper';
import { Text, StyleSheet } from 'react-native';
import { View } from './Themed';
import React from 'react';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

interface CredentialSubject {
  firstname: string;
  id: string;
  lastname: string;
  licenseCategory: string;
}

interface VC {
  '@context': string[];
  credentialSubject: CredentialSubject;
  expirationDate: string;
  id: string;
  issuanceDate: string;
  issuer: string;
  type: string[];
}

export interface Payload {
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  nbf: number;
  sub: string;
  vc: VC;
}

export default function CredentialData({
  credPayload,
}: {
  credPayload: Payload;
}) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Card style={styles.card}>
      <Image
        style={styles.image}
        source={require('../assets/images/valid-icon.png')}
      />
      <Card.Content>
        <Text style={styles.title}>{t('Drivers License')}</Text>
        <View style={styles.separator} />
        <Text style={styles.textCard}>
          <Text style={styles.label}>{t('Name')}: </Text>
          {credPayload.vc.credentialSubject?.firstname}
        </Text>
        <Text style={styles.textCard}>
          <Text style={styles.label}>{t('Lastname')}: </Text>
          {credPayload.vc.credentialSubject?.lastname}
        </Text>
        <Text style={styles.textCard}>
          <Text style={styles.label}>{t('Category')}: </Text>
          {credPayload.vc.credentialSubject?.licenseCategory}
        </Text>
        <Text style={styles.textCard}>
          <Text style={styles.label}>{t('Expiration date')}: </Text>
          {new Date(credPayload.vc.expirationDate).toISOString().split('T')[0]}
        </Text>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => router.replace('/')}
        >
          {t('Home')}
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    elevation: 3,
    margin: 10,
    padding: 10,
  },
  button: {
    backgroundColor: '#374D6B',
  },
  image: {
    marginLeft: '30%',
    width: 100,
    height: 100,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    color: '#374D6B',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  textCard: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 30,
  },
});
