const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

if (!defaultConfig.resolver) {
  defaultConfig.resolver = {};
}

if (!defaultConfig.resolver.extraNodeModules) {
  defaultConfig.resolver.extraNodeModules = {};
}

defaultConfig.resolver.extraNodeModules = {
  ...defaultConfig.resolver.extraNodeModules,
  crypto: require.resolve('react-native-crypto'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  process: require.resolve('process/browser'),
  util: require.resolve('util'),
  assert: require.resolve('assert'),
  events: require.resolve('events'),
  path: require.resolve('path-browserify'),
};

defaultConfig.resolver.assetExts = [
  ...defaultConfig.resolver.assetExts,
  'png',
  'jpg',
  'jpeg',
];

module.exports = defaultConfig;
