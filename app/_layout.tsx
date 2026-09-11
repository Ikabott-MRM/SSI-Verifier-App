import { Stack, useRouter, useSegments } from 'expo-router';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  IconButton,
} from 'react-native-paper';
import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import { ImageSourcePropType, View, StyleSheet } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import '@/utils/language/i18nextConfig';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SecureStoreProvider } from '@/providers/SecureStoreProvider';
import { tenantBrand } from '@/constants/brand';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: tenantBrand.primary,
    onPrimary: tenantBrand.onPrimary,
    secondary: tenantBrand.accent,
    onSecondary: tenantBrand.onPrimary,
  },
};

export default function Layout() {
  const queryClient = new QueryClient();
  const [assets] = useAssets([tenantBrand.logo]);
  const { i18n } = useTranslation();
  const segments = useSegments();
  const router = useRouter();

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
  };

  const headerTint =
    tenantBrand.slug === 'geyser' ? tenantBrand.primaryDark : '#fff';

  return (
    <SecureStoreProvider>
    <QueryClientProvider client={queryClient}>
      <RootSiblingParent>
        <PaperProvider theme={theme}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: tenantBrand.headerBackground,
              },
              headerTintColor: headerTint,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTitleAlign: 'center',
              headerTitle: () =>
                assets ? (
                  <View style={styles.headerContainer}>
                    <Image
                      style={styles.headerImage}
                      source={assets[0] as ImageSourcePropType}
                    />
                  </View>
                ) : null,
              headerLeft: () =>
                segments.length > 0 &&
                segments[0] !== '' && (
                  <IconButton
                    icon={() => (
                      <Ionicons name="home-outline" size={24} color={headerTint} />
                    )}
                    onPress={() => router.replace('/')}
                  />
                ),
              /* Se comenta Lenguaje para mantener sincronia de diseño entre ciudadano y verificador, esto debe ser implementado en Ciudadano para poder habilitarlo */
              /*headerRight: () => (
                <View style={{ paddingRight: 5 }}>
                  <CustomDropdown />
                </View>
              ),*/
            }}
          />
        </PaperProvider>
      </RootSiblingParent>
    </QueryClientProvider>
    </SecureStoreProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: 148,
    height: 36,
    padding: 2,
  },
});
