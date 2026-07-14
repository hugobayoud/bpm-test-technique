const { getDefaultConfig } = require('expo/metro-config');

// SVGs are imported as React components (react-native-svg-transformer),
// e.g. the bpm logo used as the home tab icon.
const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer/expo',
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg',
);
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;
