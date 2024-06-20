import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import { ImageSourcePropType, View } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import '@/utils/language/i18nextConfig';
import RNPickerSelect from 'react-native-picker-select';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const queryClient = new QueryClient();
  const [assets] = useAssets([require('../assets/images/logo-iovf.png')]);
  const { i18n } = useTranslation();

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <RootSiblingParent>
        <PaperProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#696d6b',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTitleAlign: 'center',
              headerTitle: () =>
                assets ? (
                  <Image
                    style={{ width: 80, height: 50, padding: 2 }}
                    source={assets[0] as ImageSourcePropType}
                  />
                ) : null,
              headerRight: () => (
                <View style={{ paddingRight: 5 }}>
                  <RNPickerSelect
                    onValueChange={(value: string) => changeLanguage(value)}
                    items={[
                      { key: 0, label: 'Español', value: 'es' },
                      { key: 1, label: 'English', value: 'en' },
                    ]}
                    placeholder={{}}
                    style={{
                      inputIOS: {
                        color: 'white',
                        fontSize: 14,
                      },
                      inputAndroid: {
                        color: 'white',
                        fontSize: 14,
                      },
                    }}
                  />
                </View>
              ),
            }}
          />
        </PaperProvider>
      </RootSiblingParent>
    </QueryClientProvider>
  );
}
