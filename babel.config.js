module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-classname-to-dynamic-style',
      [
        'react-native-platform-specific-extensions',
        {
          extensions: ['scss', 'svg'],
        },
      ],
      'react-native-reanimated/plugin', // Add this line
    ],
  };
};
