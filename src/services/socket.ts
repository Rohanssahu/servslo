// src/services/socket.ts
// Super-light mock of realtime partner movement + status ticks.
// Replace with Socket.IO or Firebase in production.

import { LatLng } from './api';

type Listener = (loc: LatLng) => void;

let timer: any = null;
let current: LatLng | null = null;
let dest: LatLng | null = null;
let listeners: Listener[] = [];

export function startFakeLocation(from: LatLng, to: LatLng) {
  current = { ...from };
  dest = { ...to };
  stopFakeLocation();
  timer = setInterval(tick, 1000);
}

export function stopFakeLocation() {
  if (timer) clearInterval(timer);
  timer = null;
}

function tick() {
  if (!current || !dest) return;
  const f = 0.12;
  current = {
    latitude: current.latitude + (dest.latitude - current.latitude) * f,
    longitude: current.longitude + (dest.longitude - current.longitude) * f,
  };
  listeners.forEach((cb) => cb(current!));
}

export function onLocation(cb: Listener) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((x) => x !== cb);
  };
}
