import { Stack } from 'expo-router';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import { ImageSourcePropType } from 'react-native';

export default function Layout() {
  const queryClient = new QueryClient();
  const [assets] = useAssets([require('../assets/images/logo-iovf.png')]);
  return (
    <QueryClientProvider client={queryClient}>
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
          }}
        />
      </PaperProvider>
    </QueryClientProvider>
  );
}
