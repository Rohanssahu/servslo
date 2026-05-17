// src/screen/bookingflow/LiveTrackingMap.tsx
// Premium live-tracking map with smooth animated provider marker, bearing rotation,
// curved route polyline, and status-aware UX.

import React, { useEffect, useRef, useState } from 'react';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  AnimatedRegion,
} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, ViewStyle, Platform, StyleSheet, Animated, Text } from 'react-native';
import { LatLng } from '../../services/api';

const BRAND = {
  purple: '#6E39F7',
  purpleLight: '#B78CFF',
  green: '#13B36B',
  orange: '#F59E0B',
  card: '#fff',
};

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  partnerLoc: LatLng;
  bearing: number;            // degrees for marker rotation
  drop: LatLng;
  routeRemaining?: LatLng[];  // waypoints from engine for realistic polyline
  status?: string;            // 'EN_ROUTE' | 'NEARBY' | 'ARRIVED' | …
  onMapRef?: (ref: MapView | null) => void;
  style?: ViewStyle;
};

// ─── Component ────────────────────────────────────────────────────────────────

const LiveTrackingMap: React.FC<Props> = ({
  partnerLoc,
  bearing,
  drop,
  routeRemaining,
  status = 'EN_ROUTE',
  onMapRef,
  style,
}) => {
  const mapRef = useRef<MapView | null>(null);
  const markerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  // AnimatedRegion drives smooth iOS movement; Android uses animateMarkerToCoordinate
  const animCoord = useRef(
    new AnimatedRegion({
      latitude: partnerLoc.latitude,
      longitude: partnerLoc.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  ).current;

  // Animated bearing for smooth rotation
  const bearingAnim = useRef(new Animated.Value(bearing)).current;
  const bearingRef = useRef(bearing);

  // ─── Smooth position animation ───────────────────────────────────────────

  useEffect(() => {
    const newCoord = {
      latitude: partnerLoc.latitude,
      longitude: partnerLoc.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    };

    if (Platform.OS === 'android') {
      // animateMarkerToCoordinate is the most reliable on Android
      markerRef.current?.animateMarkerToCoordinate(
        { latitude: partnerLoc.latitude, longitude: partnerLoc.longitude },
        UPDATE_DURATION,
      );
    } else {
      animCoord
        .timing({ ...newCoord, duration: UPDATE_DURATION, useNativeDriver: false })
        .start();
    }
  }, [partnerLoc]);

  // ─── Smooth bearing animation ────────────────────────────────────────────

  useEffect(() => {
    // Normalise to shortest arc to avoid spinning the wrong way
    let delta = bearing - bearingRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    bearingRef.current = bearing;

    Animated.timing(bearingAnim, {
      toValue: (bearingAnim as any)._value + delta,
      duration: UPDATE_DURATION,
      useNativeDriver: false,
    }).start();
  }, [bearing]);

  // ─── Map camera ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const arrived = status === 'ARRIVED';
    mapRef.current.fitToCoordinates(arrived ? [partnerLoc, drop] : [partnerLoc, drop], {
      edgePadding: { top: 90, bottom: 340, left: 60, right: 60 },
      animated: true,
    });
  }, [partnerLoc, drop, mapReady, status]);

  // ─── Polyline coords ──────────────────────────────────────────────────────

  const polyline =
    routeRemaining && routeRemaining.length >= 2 ? routeRemaining : [partnerLoc, drop];

  // ─── Marker icons ─────────────────────────────────────────────────────────

  const isNearby = status === 'NEARBY';
  const isArrived = status === 'ARRIVED';

  return (
    <MapView
      ref={r => {
        mapRef.current = r;
        onMapRef?.(r);
      }}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      style={[{ flex: 1 }, style]}
      onMapReady={() => setMapReady(true)}
      showsUserLocation={false}
      showsCompass={false}
      showsTraffic={false}
      toolbarEnabled={false}
      initialRegion={{
        latitude: (partnerLoc.latitude + drop.latitude) / 2,
        longitude: (partnerLoc.longitude + drop.longitude) / 2,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }}>

      {/* ── Route polyline ── */}
      <Polyline
        coordinates={polyline}
        strokeColor={BRAND.purple + 'AA'}
        strokeWidth={5}
        lineDashPattern={[10, 5]}
      />

      {/* ── Destination marker ── */}
      <Marker coordinate={drop} title="Your Location" anchor={{ x: 0.5, y: 0.5 }}>
        <View style={ms.markerHome}>
          <Ionicons name="home" size={20} color={BRAND.green} />
        </View>
      </Marker>

      {/* ── Provider marker (smooth animated) ── */}
      <Marker.Animated
        ref={markerRef}
        coordinate={animCoord}
        title="Provider"
        anchor={{ x: 0.5, y: 0.5 }}
        flat
        rotation={bearing}
        tracksViewChanges={false}>
        <ProviderMarker
          isNearby={isNearby}
          isArrived={isArrived}
          bearingAnim={bearingAnim}
        />
      </Marker.Animated>
    </MapView>
  );
};

// ─── Provider marker visual ───────────────────────────────────────────────────

type MarkerProps = {
  isNearby: boolean;
  isArrived: boolean;
  bearingAnim: Animated.Value;
};

function ProviderMarker({ isNearby, isArrived }: MarkerProps) {
  const color = isArrived ? BRAND.green : isNearby ? BRAND.orange : BRAND.purple;
  const iconName = isArrived ? 'person' : 'bicycle';

  return (
    <View style={ms.markerWrap}>
      {/* Pulse ring when nearby */}
      {isNearby && !isArrived && <PulseRing color={BRAND.orange} />}
      <View style={[ms.markerBike, { borderColor: color }]}>
        <Ionicons name={iconName} size={20} color={color} />
      </View>
    </View>
  );
}

// ─── Pulse ring animation ─────────────────────────────────────────────────────

function PulseRing({ color }: { color: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 2.2, duration: 900, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.7, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        ms.pulseRing,
        {
          borderColor: color,
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const UPDATE_DURATION = 400; // ms — matches trackingEngine UPDATE_MS

// ─── Styles ───────────────────────────────────────────────────────────────────

const ms = StyleSheet.create({
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
  },
  pulseRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  markerBike: {
    backgroundColor: BRAND.card,
    borderRadius: 22,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: BRAND.purple,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  markerHome: {
    backgroundColor: BRAND.card,
    borderRadius: 22,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: BRAND.green,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default LiveTrackingMap;
