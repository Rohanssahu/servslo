import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import LottieView from 'lottie-react-native';
import locationPinAnimation from './locationpin.json'; // loading animation
import LocationAnimation from './LocationAnimation.json'; // location fetched animation
import {hp, wp} from '../../component/utils/Constant';
import ScreenNameEnum from '../../routes/screenName.enum';
import { api_key } from '../../utils/config';

export default function LocationFetcher({navigation}) {
  const [locationFetched, setLocationFetched] = useState(false);
  const [addressMain, setAddressMain] = useState('');
  const [addressDesc, setAddressDesc] = useState('');
  const [showLocationUI, setShowLocationUI] = useState(false);

  const lottieLoadingRef = useRef(null);
  const lottieLocationRef = useRef(null);

  const apiKey = api_key // 👈 isko .env file me rakho

  async function getAddressFromCoordinates(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const fullAddress = data.results[0].formatted_address;
        const [main, ...rest] = fullAddress.split(',');
        return {main: main.trim(), desc: rest.join(',').trim()};
      } else {
        return {main: 'Address not found', desc: ''};
      }
    } catch (error) {
      console.error(error);
      return {main: 'Failed to fetch address', desc: ''};
    }
  }

  useEffect(() => {
    let timeoutId;

    async function requestPermissionAndGetLocation() {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission Denied',
              'Location permission is required.',
            );
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        async position => {
          const {main, desc} = await getAddressFromCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );
          setAddressMain(main);
          setAddressDesc(desc);
          setLocationFetched(true);
          setShowLocationUI(true);

          timeoutId = setTimeout(() => {
            navigation.replace(ScreenNameEnum.PhoneLogin);
          }, 3000);
        },
        error => {
          Alert.alert('Error', error.message);
          timeoutId = setTimeout(() => {
            navigation.replace(ScreenNameEnum.PhoneLogin);
          }, 3000);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }

    requestPermissionAndGetLocation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      {!showLocationUI ? (
        <>
          <LottieView
            ref={lottieLoadingRef}
            source={locationPinAnimation}
            autoPlay
            loop
            style={{width: wp(100), height: hp(50)}}
          />
          <Text style={styles.fetchingText}>Fetching your location...</Text>
        </>
      ) : (
        <>
          <LottieView
            ref={lottieLocationRef}
            source={LocationAnimation}
            autoPlay
            loop={false} // ✅ only play once
            style={{width: 80, height: 80}}
            onAnimationFinish={() => {
              console.log('Location animation finished');
            }}
          />

          {locationFetched && (
            <>
              <Text style={styles.deliveringText}>Delivering service at</Text>
              <Text style={styles.addressMain}>{addressMain}</Text>
              <Text style={styles.addressDesc}>{addressDesc}</Text>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  fetchingText: {
    fontSize: 18,
    color: '#555',
    marginTop: 20,
  },
  deliveringText: {
    fontSize: 16,
    color: '#2e7d32',
    marginTop: 24,
    fontWeight: '600',
  },
  addressMain: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 8,
    textAlign: 'center',
  },
  addressDesc: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
    textAlign: 'center',
  },
});

  