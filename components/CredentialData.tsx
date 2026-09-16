import { Card, Button } from 'react-native-paper';
import { Text, StyleSheet } from 'react-native';
import { View } from './Themed';
import React from 'react';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { tenantBrand } from '@/constants/brand';

interface CredentialSubject {
  firstname?: string;
  id: string;
  lastname?: string;
  licenseCategory?: string;
  projectName?: string;
  role?: string;
  tipo?: string;
  cantidad?: string;
  precio?: string;
  fechaEntrega?: string;
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

const getCredentialTitle = (type: string[] = [], t: (key: string) => string) => {
  const joined = type.join(' ').toLowerCase();
  if (joined.includes('donor')) return t('Donor');
  if (joined.includes('fundraiser')) return t('Fundraiser');
  if (joined.includes('associate')) return t('Associate');
  if (
    joined.includes('productionregistry') ||
    joined.includes('production_registry')
  ) {
    return t('Production Registry');
  }
  if (
    joined.includes('driverslicense') ||
    joined.includes('drivers_license')
  ) {
    return t('Drivers License');
  }
  return t('Credential');
};

export default function CredentialData({
  credPayload,
}: {
  credPayload: Payload;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const subject = credPayload.vc.credentialSubject;

  return (
    <Card style={styles.card}>
      <Image
        style={styles.image}
        source={require('../assets/images/valid-icon.png')}
      />
      <Card.Content>
        <Text style={styles.title}>
          {getCredentialTitle(credPayload.vc.type, t)}
        </Text>
        <View style={styles.separator} />
        {subject?.firstname ? (
          <Text style={styles.textCard}>
            <Text style={styles.label}>{t('Name')}: </Text>
            {subject.firstname}
          </Text>
        ) : null}
        {subject?.lastname ? (
          <Text style={styles.textCard}>
            <Text style={styles.label}>{t('Lastname')}: </Text>
            {subject.lastname}
          </Text>
        ) : null}
        {subject?.projectName ? (
          <Text style={styles.textCard}>
            <Text style={styles.label}>{t('Project name')}: </Text>
            {subject.projectName}
          </Text>
        ) : null}
        {subject?.role ? (
          <Text style={styles.textCard}>
            <Text style={styles.label}>{t('Role')}: </Text>
            {subject.role}
          </Text>
        ) : null}
        {subject?.licenseCategory ? (
          <Text style={styles.textCard}>
            <Text style={styles.label}>{t('Category')}: </Text>
            {subject.licenseCategory}
          </Text>
        ) : null}
        {subject?.tipo ? (
          <Text style={styles.textCard}>
            <Text style={styles.label}>{t('Type')}: </Text>
            {subject.tipo}
          </Text>
        ) : null}
        {subject?.cantidad ? (
          <Text style={styles.textCard}>
            <Text style={styles.label}>{t('Quantity')}: </Text>
            {subject.cantidad}
          </Text>
        ) : null}
        {subject?.precio ? (
          <Text style={styles.textCard}>
            <Text style={styles.label}>{t('Price')}: </Text>
            {subject.precio}
          </Text>
        ) : null}
        {subject?.fechaEntrega ? (
          <Text style={styles.textCard}>
            <Text style={styles.label}>{t('Delivery date')}: </Text>
            {subject.fechaEntrega}
          </Text>
        ) : null}
        {credPayload.vc.expirationDate && (
          <Text style={styles.textCard}>
            <Text style={styles.label}>{t('Expiration date')}: </Text>
            {new Date(credPayload.vc.expirationDate).toISOString().split('T')[0]}
          </Text>
        )}
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
    backgroundColor: tenantBrand.primary,
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
    color: tenantBrand.primaryDark,
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
