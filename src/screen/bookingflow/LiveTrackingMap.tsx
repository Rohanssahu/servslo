// src/components/LiveTrackingMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, ViewStyle, Platform, StyleSheet } from 'react-native';
import { LatLng } from '../../services/api';

const BRAND = { purple: '#6E39F7', green: '#13B36B' };

type Props = {
  partnerLoc: LatLng;
  drop: LatLng;
  onMapRef?: (ref: MapView | null) => void;
  style?: ViewStyle;
};

const LiveTrackingMap: React.FC<Props> = ({ partnerLoc, drop, onMapRef, style }) => {
  const mapRef = useRef<MapView | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapRef.current && mapReady) {
      mapRef.current.fitToCoordinates([partnerLoc, drop], {
        edgePadding: { top: 80, bottom: 320, left: 60, right: 60 },
        animated: true,
      });
    }
  }, [partnerLoc, drop, mapReady]);

  return (
    <MapView
      ref={(r) => {
        mapRef.current = r;
        onMapRef?.(r);
      }}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      style={[{flex: 1}, style]}
      onMapReady={() => setMapReady(true)}
      initialRegion={{
        latitude: (partnerLoc.latitude + drop.latitude) / 2,
        longitude: (partnerLoc.longitude + drop.longitude) / 2,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker coordinate={partnerLoc} title="Partner" anchor={{x: 0.5, y: 0.5}}>
        <View style={ms.markerBike}>
          <Ionicons name="bicycle" size={22} color={BRAND.purple} />
        </View>
      </Marker>
      <Marker coordinate={drop} title="Your Location" anchor={{x: 0.5, y: 0.5}}>
        <View style={ms.markerHome}>
          <Ionicons name="home" size={22} color={BRAND.green} />
        </View>
      </Marker>
      <Polyline
        coordinates={[partnerLoc, drop]}
        strokeColor={BRAND.purple}
        strokeWidth={4}
        lineDashPattern={[8, 4]}
      />
    </MapView>
  );
};

const ms = StyleSheet.create({
  markerBike: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 7,
    borderWidth: 2,
    borderColor: BRAND.purple,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  markerHome: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 7,
    borderWidth: 2,
    borderColor: BRAND.green,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
});

export default LiveTrackingMap;
