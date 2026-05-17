import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNavigationContainerRef } from '@react-navigation/native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Toast from 'react-native-toast-message';
import toastConfig from '../configs/customToast';

import RegistrationRoutes from './RegistrationRoutes';

import { ThemeProvider } from '../component/utils/ThemeProvider';
import { persistor, store } from '../redux/Store';
import { LocationProvider } from '../component/LocationContext';
import { LanguageProvider } from '../language/LanguageContext';

import {
  initTrackingNotifications,
  setupTapHandler,
  consumePendingNavigation,
} from '../services/trackingNotifications';

// Navigation ref — usable outside the React tree (notification tap handlers, etc.)
export const navigationRef = createNavigationContainerRef();

export function navigateToBookingTrack(bookingId) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('BookingTrackScreen', { bookingId });
  }
}

export default function AppNavigator() {
  useEffect(() => {
    // Boot notification infrastructure
    initTrackingNotifications();

    // Handle notification taps from all app states
    setupTapHandler((bookingId) => {
      navigateToBookingTrack(bookingId);
    });

    // Handle kill-state resume: if the app was opened via a notification tap,
    // AsyncStorage will have a pending bookingId saved by the FCM background handler.
    consumePendingNavigation().then((bookingId) => {
      if (bookingId) {
        // Slight delay so the navigator has mounted
        setTimeout(() => navigateToBookingTrack(bookingId), 1000);
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <LocationProvider>
              <LanguageProvider>
                <NavigationContainer ref={navigationRef}>
                  <RegistrationRoutes />
                </NavigationContainer>
                <Toast config={toastConfig} />
              </LanguageProvider>
            </LocationProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
