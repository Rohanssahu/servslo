import 'react-native-gesture-handler';
import React, {FunctionComponent, useEffect} from 'react';

import ScreenNameEnum from '../routes/screenName.enum';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import _routes from '../routes/routes';
import { getCurrentLocation, locationPermission } from '../component/helperFunction';
import { useLocation } from '../component/LocationContext';
const Stack = createNativeStackNavigator();

const RegistrationRoutes: FunctionComponent = React.memo(() => {
  const { locationName, setLocationName } = useLocation();

  useEffect(() => {
    let isMounted = true;
    const fetchLocationData = async () => {
      try {
        const locPermission = await locationPermission();
        if (locPermission !== 'granted') return;

        const { latitude, longitude } = await getCurrentLocation();
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_KEY`;
        const res = await fetch(url);
        const json = await res.json();

        if (isMounted && json.status === 'OK' && json.results.length) {
          const city = json.results[0].formatted_address;
          if (!locationName) setLocationName(city);
        }
      } catch (error) {
        console.log("Error fetching location:", error);
      }
    };

    fetchLocationData();
    return () => { isMounted = false; };
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={ScreenNameEnum.SPLASH_SCREEN}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      {_routes.REGISTRATION_ROUTE.map(screen => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.Component}
          options={screen.name === ScreenNameEnum.LANGUAGE_SELECT ? { animation: 'fade' } : undefined}
        />
      ))}
    </Stack.Navigator>
  );
});

export default RegistrationRoutes;
