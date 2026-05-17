// src/services/trackingEngine.ts
// Real-time provider tracking engine — simulates realistic city movement.
// Replace startTracking() internals with a WebSocket/Firebase listener in production.

import { AppState, AppStateStatus } from 'react-native';
import { LatLng } from './api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TrackingLocationUpdate = {
  location: LatLng;
  bearing: number;       // degrees 0-360, for marker rotation
  speedKmh: number;      // current speed
  distanceKm: number;    // distance remaining to destination
  etaMin: number;        // estimated minutes to arrival
  routeRemaining: LatLng[]; // remaining waypoints (for polyline)
};

export type TrackingMilestone =
  | 'EN_ROUTE'       // partner has started moving
  | 'NEARBY'         // within 300 m
  | 'ARRIVED'        // within 80 m
  | 'SERVICE_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED';

type LocationListener = (update: TrackingLocationUpdate) => void;
type MilestoneListener = (milestone: TrackingMilestone) => void;

// ─── Constants ────────────────────────────────────────────────────────────────

const UPDATE_MS = 350;            // tick interval
const BASE_SPEED_KMH = 22;        // average Indian city speed
const SPEED_JITTER = 0.30;        // ±30 % random variance per tick
const NEARBY_KM = 0.30;           // trigger NEARBY milestone
const ARRIVED_KM = 0.08;          // trigger ARRIVED milestone
const WAYPOINT_COUNT = 5;         // intermediate points for realistic path

// ─── Module state ─────────────────────────────────────────────────────────────

let locationListeners: LocationListener[] = [];
let milestoneListeners: MilestoneListener[] = [];
let timer: ReturnType<typeof setInterval> | null = null;
let allWaypoints: LatLng[] = [];   // full route (start → … → dest)
let wpIndex = 0;                   // index of next waypoint to head toward
let current: LatLng | null = null;
let dest: LatLng | null = null;
let milestones = new Set<TrackingMilestone>();
let appState: AppStateStatus = 'active';
let appStateSub: ReturnType<typeof AppState.addEventListener> | null = null;

// ─── Math helpers ─────────────────────────────────────────────────────────────

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function calcBearing(a: LatLng, b: LatLng): number {
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// Generate waypoints with slight jitter to simulate road curves
function generateWaypoints(from: LatLng, to: LatLng): LatLng[] {
  const pts: LatLng[] = [{ ...from }];
  for (let i = 1; i <= WAYPOINT_COUNT; i++) {
    const t = i / (WAYPOINT_COUNT + 1);
    // Perpendicular jitter: bigger in the middle, zero at endpoints
    const jitterScale = 0.003 * Math.sin(t * Math.PI); // max ~300 m
    const jLat = (Math.random() - 0.5) * jitterScale * 2;
    const jLon = (Math.random() - 0.5) * jitterScale * 2;
    pts.push({
      latitude: from.latitude + (to.latitude - from.latitude) * t + jLat,
      longitude: from.longitude + (to.longitude - from.longitude) * t + jLon,
    });
  }
  pts.push({ ...to });
  return pts;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function startTracking(from: LatLng, to: LatLng): void {
  stopTracking();
  milestones.clear();
  allWaypoints = generateWaypoints(from, to);
  wpIndex = 0;
  current = { ...from };
  dest = { ...to };

  appStateSub = AppState.addEventListener('change', (s: AppStateStatus) => {
    appState = s;
  });

  // Emit EN_ROUTE immediately
  _fireMilestone('EN_ROUTE');

  timer = setInterval(_tick, UPDATE_MS);
}

export function stopTracking(): void {
  if (timer) clearInterval(timer);
  timer = null;
  appStateSub?.remove();
  appStateSub = null;
}

export function isTracking(): boolean {
  return timer !== null;
}

export function getCurrentLocation(): LatLng | null {
  return current;
}

export function getFullRoute(): LatLng[] {
  return allWaypoints;
}

export function onLocationUpdate(cb: LocationListener): () => void {
  locationListeners = [...locationListeners, cb];
  return () => {
    locationListeners = locationListeners.filter(x => x !== cb);
  };
}

export function onMilestone(cb: MilestoneListener): () => void {
  milestoneListeners = [...milestoneListeners, cb];
  return () => {
    milestoneListeners = milestoneListeners.filter(x => x !== cb);
  };
}

// ─── Internal tick ────────────────────────────────────────────────────────────

function _tick(): void {
  if (!current || !dest || wpIndex >= allWaypoints.length - 1) {
    stopTracking();
    return;
  }

  const nextWp = allWaypoints[wpIndex + 1];

  // Randomised speed (simulate traffic, lights, turns)
  const speed = BASE_SPEED_KMH * (1 + (Math.random() - 0.5) * SPEED_JITTER * 2);

  // Metres to travel this tick
  const moveDist = (speed / 3600) * (UPDATE_MS / 1000); // km

  const distToNext = haversineKm(current, nextWp);
  const currentBearing = calcBearing(current, nextWp);

  if (distToNext <= moveDist) {
    // Snap to waypoint and advance
    current = { ...nextWp };
    wpIndex++;
  } else {
    const fraction = moveDist / distToNext;
    current = {
      latitude: current.latitude + (nextWp.latitude - current.latitude) * fraction,
      longitude: current.longitude + (nextWp.longitude - current.longitude) * fraction,
    };
  }

  const distToDest = haversineKm(current, dest);
  const etaMin = Math.max(1, Math.round((distToDest / BASE_SPEED_KMH) * 60));

  // Remaining route for polyline
  const routeRemaining: LatLng[] = [{ ...current }, ...allWaypoints.slice(wpIndex + 1)];

  const update: TrackingLocationUpdate = {
    location: { ...current },
    bearing: currentBearing,
    speedKmh: Math.round(speed),
    distanceKm: distToDest,
    etaMin,
    routeRemaining,
  };

  locationListeners.forEach(cb => cb(update));

  // Milestone detection
  if (distToDest < NEARBY_KM && !milestones.has('NEARBY')) {
    _fireMilestone('NEARBY');
  }
  if (distToDest < ARRIVED_KM && !milestones.has('ARRIVED')) {
    _fireMilestone('ARRIVED');
    stopTracking(); // partner has arrived — stop engine
  }
}

function _fireMilestone(m: TrackingMilestone): void {
  milestones.add(m);
  milestoneListeners.forEach(cb => cb(m));
}

export function getAppState(): AppStateStatus {
  return appState;
}
