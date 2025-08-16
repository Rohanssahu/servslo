import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../routes/screenName.enum';
import { color } from '../../constant';

export default function Splash() {
  const navigation = useNavigation();

  const scaleAnim = useRef(new Animated.Value(0)).current; // start very small

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,       // final normal size
      duration: 2000,   // 2 seconds animation
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        navigation.navigate(ScreenNameEnum.LocationFetcher);
      }, 500);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={color.primary || '#623bea'} />
      <Animated.Text
        style={[
          styles.logoText,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        ServsLO
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#623bea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
});
