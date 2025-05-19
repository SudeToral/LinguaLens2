// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

// __dirname (çift alt çizgi!) doğru şekilde kullanılmalı
const defaultConfig = getDefaultConfig(__dirname);

// Özel ayarlar ekleniyor
defaultConfig.resolver.sourceExts.push("cjs");
defaultConfig.resolver.unstable_enablePackageExports = false;

// Export config at the end
module.exports = defaultConfig;
