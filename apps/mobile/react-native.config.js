const path = require('path');

module.exports = {
  dependencies: {
    '@react-native-google-signin/google-signin': {
      // Points to the LOCAL node_modules inside apps/mobile
      root: path.join(__dirname, 'node_modules/@react-native-google-signin/google-signin'),
    },
  },
};