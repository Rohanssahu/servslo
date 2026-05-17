/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Register FCM background/killed-state handler.
// Must be called BEFORE AppRegistry — but wrapped in try/catch so a Firebase
// init failure (e.g. first cold start before google-services plugin runs)
// never prevents the app from booting.
try {
  const messaging = require('@react-native-firebase/messaging').default;
  const {handleFCMBackground} = require('./src/services/trackingNotifications');
  messaging().setBackgroundMessageHandler(handleFCMBackground);
} catch (e) {
  // Firebase initializes via the native google-services plugin on first build.
  // This warning is safe to ignore — handler will be active from the next launch.
  console.warn('[ServSLO] FCM background handler skipped:', e?.message);
}

AppRegistry.registerComponent(appName, () => App);
