import {useNavigation} from '@react-navigation/native';
import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import Video from 'react-native-video';
import ScreenNameEnum from '../../routes/screenName.enum';
import { color } from '../../constant';

export default function Splash() {
  const playerRef = useRef(null);
  const navigation = useNavigation();
  const [paused, setPaused] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true); // black screen to prevent blink

  const handleVideoLoad = () => {
    // Seek to 3rd second once video is ready
    playerRef.current?.seek(0);
  };

  const handleSeek = () => {
    // Unpause after seek completes
    setPaused(false);
    setShowOverlay(false); // remove black screen
  };

  const handleProgress = data => {
    if (data.currentTime >= 5) {
       navigation.navigate(ScreenNameEnum.TabNavigator);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#4B0082'} />
      <Video
        ref={playerRef}
        source={require('./animated.mov')}
        style={styles.video}
        resizeMode="cover"
        paused={paused}
        muted
        controls={false}
        onLoad={handleVideoLoad}
        onSeek={handleSeek}
        onProgress={handleProgress}
      />

      {/* Black overlay to hide blinking */}
      {showOverlay && <View style={styles.overlay} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 1,
  },
});
