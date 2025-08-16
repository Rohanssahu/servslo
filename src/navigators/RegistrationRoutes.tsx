import 'react-native-gesture-handler';
import React, { FunctionComponent } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import _routes from '../routes/routes';
import TabNavigator from './TabNavigator';
import ScreenNameEnum from '../routes/screenName.enum';

const Stack = createNativeStackNavigator();

const RegistrationRoutes: FunctionComponent = React.memo(() => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNameEnum.SPLASH_SCREEN}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      
      {/* Auth & feature screens */}
      {_routes.REGISTRATION_ROUTE.map(screen => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.Component}
          options={
            screen.name === ScreenNameEnum.LANGUAGE_SELECT
              ? { animation: 'fade' }
              : undefined
          }
        />
      ))}

      {/* ✅ TabNavigator registered separately */}
      <Stack.Screen
        name={ScreenNameEnum.TabNavigator}
        component={TabNavigator}
      />
    </Stack.Navigator>
  );
});

export default RegistrationRoutes;
