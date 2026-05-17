// src/services/socket.ts
// Backward-compatibility shim — delegates to trackingEngine.
// Existing callers that import startFakeLocation / stopFakeLocation / onLocation
// continue to work without any changes.

import { LatLng } from './api';
import {
  startTracking,
  stopTracking,
  onLocationUpdate,
  TrackingLocationUpdate,
} from './trackingEngine';

type Listener = (loc: LatLng) => void;

export function startFakeLocation(from: LatLng, to: LatLng): void {
  startTracking(from, to);
}

export function stopFakeLocation(): void {
  stopTracking();
}

export function onLocation(cb: Listener): () => void {
  return onLocationUpdate((update: TrackingLocationUpdate) => {
    cb(update.location);
  });
}
