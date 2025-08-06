import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Toast from 'react-native-toast-message';
import toastConfig from '../configs/customToast';

import RegistrationRoutes from './RegistrationRoutes';

import { ThemeProvider } from '../component/utils/ThemeProvider';
import { persistor, store } from '../redux/Store';
import { locationPermission } from '../component/helperFunction';
import { LocationProvider } from '../component/LocationContext';
import { LanguageProvider } from '../language/LanguageContext';

export default function AppNavigator() {


  return (
    <Provider store={store}>

      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <LocationProvider>
             <LanguageProvider>
                <NavigationContainer>
                  <RegistrationRoutes />
                  <Toast config={toastConfig} />
                </NavigationContainer>
              </LanguageProvider>
            </LocationProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
