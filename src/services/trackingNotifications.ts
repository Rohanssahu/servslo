// src/services/trackingNotifications.ts
// Push notification layer for provider tracking.
// Handles foreground banners, background ETA pings, and kill-state FCM payloads.

import { AppState, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookingStatus } from './api';
import { TrackingMilestone } from './trackingEngine';

// ─── Channel IDs ──────────────────────────────────────────────────────────────

const CH_TRACKING = 'servslo-tracking-v2';
const CH_ETA = 'servslo-eta-v2';

// AsyncStorage key to persist pending navigation target (for kill-state resume)
const STORAGE_PENDING_NAV = '@servslo/pendingNav';

// ETA update interval when backgrounded (ms)
const BG_ETA_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes

let bgEtaTimer: ReturnType<typeof setInterval> | null = null;
let lastEtaMin = 0;
let lastDistKm = 0;
let activeBookingId = '';

// ─── FCM Background handler (called from index.js at module level) ────────────

// index.js must call:
//   messaging().setBackgroundMessageHandler(handleFCMBackground);
// before AppRegistry.registerComponent() for Android kill-state support.
export async function handleFCMBackground(remoteMsg: any): Promise<void> {
  const data = (remoteMsg as any).data ?? {};
  if (data.type === 'tracking_status' && data.bookingId) {
    await AsyncStorage.setItem(
      STORAGE_PENDING_NAV,
      JSON.stringify({ bookingId: data.bookingId, ts: Date.now() }),
    );
    _showLocal(
      CH_TRACKING,
      (data.title as string) ?? 'ServSLO Update',
      (data.body as string) ?? 'आपकी booking में update है।',
      { bookingId: data.bookingId },
      true,
    );
  }
}

// ─── Setup ────────────────────────────────────────────────────────────────────

export function initTrackingNotifications(): void {
  // Create channels (Android only; iOS uses default)
  PushNotification.createChannel(
    {
      channelId: CH_TRACKING,
      channelName: 'Provider Tracking',
      channelDescription: 'Live updates about your service provider',
      playSound: true,
      soundName: 'default',
      importance: 4, // HIGH
      vibrate: true,
    },
    () => {},
  );

  PushNotification.createChannel(
    {
      channelId: CH_ETA,
      channelName: 'ETA Updates',
      channelDescription: 'Background estimated arrival time updates',
      playSound: false,
      soundName: 'default',
      importance: 3, // DEFAULT
      vibrate: false,
    },
    () => {},
  );

  // Note: FCM background handler is registered in index.js via handleFCMBackground()
}

// ─── Status-change notification ───────────────────────────────────────────────

export function notifyStatusChange(
  status: BookingStatus,
  bookingId: string,
  partnerName: string,
  etaMin?: number,
): void {
  activeBookingId = bookingId;
  const { title, body } = _statusMessage(status, partnerName, etaMin);
  _showLocal(CH_TRACKING, title, body, { bookingId }, true);
}

// ─── Milestone notification (NEARBY, ARRIVED) ─────────────────────────────────

export function notifyMilestone(
  milestone: TrackingMilestone,
  bookingId: string,
  partnerName: string,
): void {
  activeBookingId = bookingId;
  let title = '';
  let body = '';

  if (milestone === 'NEARBY') {
    title = '📍 Partner पास आ गया!';
    body = `${partnerName} लगभग 300 मीटर दूर है — दरवाज़ा खोल कर रखें!`;
  } else if (milestone === 'ARRIVED') {
    title = '🔔 Partner पहुँच गया!';
    body = `${partnerName} आपके दरवाज़े पर है। OTP शेयर करके service शुरू करें।`;
  } else {
    return;
  }

  _showLocal(CH_TRACKING, title, body, { bookingId }, true);
}

// ─── Background ETA pings ─────────────────────────────────────────────────────

export function startBackgroundEtaPings(bookingId: string): void {
  stopBackgroundEtaPings();
  activeBookingId = bookingId;

  bgEtaTimer = setInterval(() => {
    if (AppState.currentState !== 'active' && lastEtaMin > 0) {
      _showLocal(
        CH_ETA,
        `🚗 ${lastEtaMin} min में पहुँचेगा`,
        `Partner ${lastDistKm.toFixed(1)} km दूर — ServSLO`,
        { bookingId },
        false,
        CH_ETA + '_eta_ongoing', // stable id so it replaces the previous one
      );
    }
  }, BG_ETA_INTERVAL_MS);
}

export function stopBackgroundEtaPings(): void {
  if (bgEtaTimer) clearInterval(bgEtaTimer);
  bgEtaTimer = null;
}

// Called by BookingTrackScreen so the background ping stays current
export function updateEtaCache(distKm: number, etaMin: number): void {
  lastDistKm = distKm;
  lastEtaMin = etaMin;
}

// ─── Kill-state resume helper ─────────────────────────────────────────────────

export async function consumePendingNavigation(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_PENDING_NAV);
    if (!raw) return null;
    const { bookingId, ts } = JSON.parse(raw);
    // Ignore if stale (> 30 minutes)
    if (Date.now() - ts > 30 * 60 * 1000) {
      await AsyncStorage.removeItem(STORAGE_PENDING_NAV);
      return null;
    }
    await AsyncStorage.removeItem(STORAGE_PENDING_NAV);
    return bookingId;
  } catch {
    return null;
  }
}

// ─── Notification tap handler ─────────────────────────────────────────────────

// Call once during app boot; onTap receives the bookingId to navigate to.
export function setupTapHandler(onTap: (bookingId: string) => void): void {
  // Foreground / background tap via react-native-push-notification
  PushNotification.configure({
    onNotification: (notification: any) => {
      const bookingId =
        notification?.userInfo?.bookingId ?? notification?.data?.bookingId;
      if (bookingId) onTap(bookingId);
    },
    popInitialNotification: true,
    requestPermissions: false, // we request separately in Notification.js
  });

  // Background FCM tap (app was in background, user tapped)
  messaging().onNotificationOpenedApp(remoteMsg => {
    const bId = remoteMsg?.data?.bookingId;
    if (bId) onTap(bId as string);
  });

  // Kill-state FCM tap (app was killed, user tapped notification to open)
  messaging()
    .getInitialNotification()
    .then(remoteMsg => {
      if (remoteMsg?.data?.bookingId) {
        onTap(remoteMsg.data.bookingId as string);
      }
    });
}

// ─── Private helper ───────────────────────────────────────────────────────────

function _showLocal(
  channelId: string,
  title: string,
  message: string,
  userInfo: object,
  vibrate: boolean,
  id?: string,
): void {
  const notifId = id
    ? _hashId(id)
    : _hashId(title + Date.now().toString());

  PushNotification.localNotification({
    channelId,
    title,
    message,
    playSound: vibrate,
    soundName: vibrate ? 'default' : undefined,
    priority: vibrate ? 'high' : 'default',
    vibrate,
    vibration: vibrate ? 300 : 0,
    userInfo,
    smallIcon: 'ic_notification',
    largeIcon: '',
    id: notifId,
  });
}

function _hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % 90000 + 10000;
}

function _statusMessage(
  status: BookingStatus,
  name: string,
  eta?: number,
): { title: string; body: string } {
  switch (status) {
    case 'ASSIGNED':
      return {
        title: '✅ Partner मिल गया!',
        body: `${name} आपकी service के लिए assign हुए — थोड़ी देर में निकलेंगे।`,
      };
    case 'EN_ROUTE':
      return {
        title: '🚗 Partner रास्ते में है!',
        body: eta
          ? `${name} लगभग ${eta} min में पहुँचेगा।`
          : `${name} आपकी तरफ आ रहा है।`,
      };
    case 'ARRIVED':
      return {
        title: '📍 Partner पहुँच गया!',
        body: `${name} आपके दरवाज़े पर है। OTP शेयर करें।`,
      };
    case 'OTP_VERIFIED':
      return {
        title: '🔑 OTP Verified!',
        body: 'Service अभी शुरू होने वाली है।',
      };
    case 'IN_PROGRESS':
      return {
        title: '🔧 Service चल रही है',
        body: `${name} आपकी service complete कर रहे हैं।`,
      };
    case 'COMPLETED':
      return {
        title: '🎉 Service पूरी हो गई!',
        body: 'Rating दें और feedback share करें।',
      };
    default:
      return { title: 'ServSLO', body: 'आपकी booking में update है।' };
  }
}
