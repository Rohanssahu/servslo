// src/components/LiveTrackingMap.tsx
import React, { useEffect, useRef } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ViewStyle } from 'react-native';
import { LatLng } from '../services/api';

const BRAND = { purple: '#6E39F7', green: '#13B36B' };

type Props = {
  partnerLoc: LatLng;
  drop: LatLng;
  onMapRef?: (ref: MapView | null) => void;
  style?: ViewStyle;
};

const LiveTrackingMap: React.FC<Props> = ({ partnerLoc, drop, onMapRef, style }) => {
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([partnerLoc, drop], {
        edgePadding: { top: 80, bottom: 320, left: 60, right: 60 },
        animated: true,
      });
    }
  }, [partnerLoc, drop]);

  return (
    <MapView
      ref={(r) => {
        mapRef.current = r;
        onMapRef?.(r);
      }}
      style={style}
      initialRegion={{
        latitude: drop.latitude,
        longitude: drop.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }}
    >
      <Marker coordinate={partnerLoc} title="Partner">
        <Ionicons name="bicycle" size={28} color={BRAND.purple} />
      </Marker>
      <Marker coordinate={drop} title="Your Location">
        <Ionicons name="home" size={28} color={BRAND.green} />
      </Marker>
      <Polyline coordinates={[partnerLoc, drop]} strokeColor={BRAND.purple} strokeWidth={4} />
    </MapView>
  );
};

export default LiveTrackingMap;
