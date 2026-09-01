const appJson = require('./app.json');

const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL || '';
const envKey = process.env.EXPO_PUBLIC_API_KEY || '';
const useEnvUrl =
  envUrl.includes('api.ssi-api.xyz') || envUrl.includes('32.193.115.213');
const useEnvKey =
  Boolean(envKey) &&
  envKey !== 'e8be2a7d799ac712e250317b1edf276c' &&
  !envKey.includes('api-key-for-interacting');

const publicEnv = {
  EXPO_PUBLIC_API_BASE_URL: useEnvUrl ? envUrl : 'https://api.ssi-api.xyz',
  EXPO_PUBLIC_API_KEY: useEnvKey
    ? envKey
    : '456b365c6e9f8ebe37ec54809064402f',
  EXPO_PUBLIC_IPFS_GATEWAY_BASE_URL:
    process.env.EXPO_PUBLIC_IPFS_GATEWAY_BASE_URL ||
    'https://gateway.pinata.cloud',
};

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      publicEnv,
    },
  },
};
