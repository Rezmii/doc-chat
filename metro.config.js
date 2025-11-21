const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Dodano opcję inlineRem: 16
module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
