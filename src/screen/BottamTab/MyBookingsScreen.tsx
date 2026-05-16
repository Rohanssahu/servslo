import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenNameEnum from '../../routes/screenName.enum';

const C = {
  purple: '#6E39F7',
  purpleL: '#f3eeff',
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'] as string[],
  bg: '#f4f3fb',
  card: '#fff',
  text: '#1a1a2e',
  sub: '#888',
  border: '#efefef',
  green: '#13B36B',
  orange: '#F59E0B',
  red: '#EF4444',
};

const TABS = [
  {key: 'active', label: 'चालू', icon: 'time-outline'},
  {key: 'completed', label: 'पूर्ण', icon: 'checkmark-circle-outline'},
  {key: 'cancelled', label: 'रद्द', icon: 'close-circle-outline'},
];

const ALL_BOOKINGS = [
  {
    id: 'BK-102938',
    service: 'AC Repair',
    emoji: '❄️',
    address: 'Flat 203, Green Heights, Andheri East',
    datetime: 'आज, 03:00 PM',
    amount: 398,
    status: 'active',
    step: 'EN_ROUTE',
    partner: 'Ravi Kumar',
    partnerRating: '4.8',
    eta: '8 min',
  },
  {
    id: 'BK-101245',
    service: 'Home Cleaning',
    emoji: '🧹',
    address: '12, MG Road, Sector 5, Nagpur',
    datetime: 'कल, 11:00 AM',
    amount: 348,
    status: 'active',
    step: 'ASSIGNED',
    partner: 'Suresh Yadav',
    partnerRating: '4.6',
    eta: '25 min',
  },
  {
    id: 'BK-099871',
    service: 'Plumber',
    emoji: '🔧',
    address: 'B-204, IT Park, Hingna',
    datetime: '24 July, 10:30 AM',
    amount: 198,
    status: 'completed',
    step: 'COMPLETED',
    partner: 'Ajay Shinde',
    partnerRating: '4.9',
    eta: null,
  },
  {
    id: 'BK-098533',
    service: 'Electrician',
    emoji: '⚡',
    address: 'Ram Nagar, Indore',
    datetime: '22 July, 3:00 PM',
    amount: 248,
    status: 'completed',
    step: 'COMPLETED',
    partner: 'Mohit Gupta',
    partnerRating: '4.7',
    eta: null,
  },
  {
    id: 'BK-097120',
    service: 'Pest Control',
    emoji: '🐛',
    address: 'Sector 7, Noida',
    datetime: '20 July, 9:00 AM',
    amount: 648,
    status: 'cancelled',
    step: 'CANCELLED',
    partner: null,
    partnerRating: null,
    eta: null,
  },
];

const STEP_LABELS: Record<string, string> = {
  ASSIGNED: 'Partner Assigned',
  EN_ROUTE: 'On the Way',
  ARRIVED: 'Partner Arrived',
  IN_PROGRESS: 'Service in Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const STATUS_COLOR: Record<string, string> = {
  active: C.orange,
  completed: C.green,
  cancelled: C.red,
};

const STATUS_BG: Record<string, string> = {
  active: '#FFF7ED',
  completed: '#F0FDF4',
  cancelled: '#FFF1F2',
};

function PulseDot() {
  const anim = useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {toValue: 1.6, duration: 700, useNativeDriver: true}),
        Animated.timing(anim, {toValue: 1, duration: 700, useNativeDriver: true}),
      ]),
    ).start();
  }, []);
  return (
    <View style={{width: 18, height: 18, alignItems: 'center', justifyContent: 'center'}}>
      <Animated.View
        style={{
          position: 'absolute',
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: C.orange + '44',
          transform: [{scale: anim}],
        }}
      />
      <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: C.orange}} />
    </View>
  );
}

type Props = {navigation: any};

export default function MyBookingsScreen({navigation}: Props) {
  const [activeTab, setActiveTab] = useState('active');

  const filtered = ALL_BOOKINGS.filter(b => b.status === activeTab);

  const renderEmpty = () => (
    <View style={s.emptyBox}>
      <Text style={s.emptyEmoji}>
        {activeTab === 'active' ? '📋' : activeTab === 'completed' ? '✅' : '❌'}
      </Text>
      <Text style={s.emptyTitle}>
        {activeTab === 'active'
          ? 'कोई चालू बुकिंग नहीं'
          : activeTab === 'completed'
          ? 'कोई पूर्ण बुकिंग नहीं'
          : 'कोई रद्द बुकिंग नहीं'}
      </Text>
      <Text style={s.emptySub}>New service book करने के लिए Home पर जाएं</Text>
    </View>
  );

  const renderItem = ({item}: {item: (typeof ALL_BOOKINGS)[0]}) => {
    const isActive = item.status === 'active';
    const isCancelled = item.status === 'cancelled';
    const statusColor = STATUS_COLOR[item.status];
    const statusBg = STATUS_BG[item.status];

    return (
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() =>
          navigation.navigate(ScreenNameEnum.BookingDetailsScreen, {booking: item})
        }
        style={s.card}>
        {/* Top row: emoji + service info + status */}
        <View style={s.cardTop}>
          <LinearGradient colors={[C.purpleL, '#e6d5ff']} style={s.serviceEmoji}>
            <Text style={s.emojiText}>{item.emoji}</Text>
          </LinearGradient>

          <View style={s.serviceInfo}>
            <Text style={s.serviceName}>{item.service}</Text>
            <Text style={s.bookingId}>{item.id}</Text>
            <Text style={s.datetime} numberOfLines={1}>
              <Ionicons name="calendar-outline" size={11} color={C.sub} /> {item.datetime}
            </Text>
          </View>

          <View style={[s.statusPill, {backgroundColor: statusBg}]}>
            {isActive && <PulseDot />}
            <Text style={[s.statusText, {color: statusColor}]}>
              {isActive ? item.eta : isCancelled ? 'रद्द' : 'पूर्ण'}
            </Text>
          </View>
        </View>

        {/* Step label for active */}
        {isActive && (
          <View style={s.stepRow}>
            <Ionicons name="navigate" size={13} color={C.orange} />
            <Text style={s.stepLabel}>{STEP_LABELS[item.step]}</Text>
          </View>
        )}

        {/* Address */}
        <View style={s.addrRow}>
          <Ionicons name="location-outline" size={13} color={C.sub} />
          <Text style={s.addrText} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        <View style={s.divider} />

        {/* Bottom row: amount + action */}
        <View style={s.cardBottom}>
          <View>
            <Text style={s.amtLabel}>Total Paid</Text>
            <Text style={s.amtVal}>₹{item.amount}</Text>
          </View>

          {isActive ? (
            <TouchableOpacity
              style={s.trackBtn}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate(ScreenNameEnum.BookingTrackScreen, {
                  bookingId: item.id,
                })
              }>
              <LinearGradient colors={C.grad} style={s.trackGrad}>
                <Ionicons name="navigate" size={14} color="#fff" />
                <Text style={s.trackText}>Track</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : item.status === 'completed' ? (
            <View style={s.actionRow}>
              <TouchableOpacity
                style={s.outlineBtn}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate(ScreenNameEnum.InvoiceScreen, {
                    bookingId: item.id,
                  })
                }>
                <Ionicons name="receipt-outline" size={14} color={C.purple} />
                <Text style={s.outlineBtnText}>Invoice</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.outlineBtn}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate(ScreenNameEnum.AllServicesScreen)
                }>
                <Ionicons name="repeat" size={14} color={C.purple} />
                <Text style={s.outlineBtnText}>फिर बुक करें</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={s.outlineBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(ScreenNameEnum.AllServicesScreen)}>
              <Ionicons name="add-circle-outline" size={14} color={C.purple} />
              <Text style={s.outlineBtnText}>New Book</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={C.grad}
        start={{x: 0.1, y: 0}}
        end={{x: 1, y: 1}}
        style={s.header}>
        <View>
          <Text style={s.headerTitle}>मेरी बुकिंग्स</Text>
          <Text style={s.headerSub}>सभी service bookings</Text>
        </View>
        <TouchableOpacity
          style={s.bellBtn}
          onPress={() => navigation.navigate(ScreenNameEnum.NotificationList)}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
          <View style={s.bellDot} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Tabs */}
      <View style={s.tabBar}>
        {TABS.map(tab => {
          const count = ALL_BOOKINGS.filter(b => b.status === tab.key).length;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[s.tab, activeTab === tab.key && s.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}>
              <Ionicons
                name={tab.icon as any}
                size={15}
                color={activeTab === tab.key ? C.purple : C.sub}
              />
              <Text style={[s.tabText, activeTab === tab.key && s.tabTextActive]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View
                  style={[
                    s.countBadge,
                    {backgroundColor: activeTab === tab.key ? C.purple : '#e0e0e0'},
                  ]}>
                  <Text
                    style={[
                      s.countText,
                      {color: activeTab === tab.key ? '#fff' : C.sub},
                    ]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},

  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 12 : 12,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {fontSize: 22, fontWeight: '900', color: '#fff'},
  headerSub: {fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2},
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.orange,
    borderWidth: 1.5,
    borderColor: C.purple,
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 13,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabActive: {borderBottomColor: C.purple},
  tabText: {fontSize: 13, fontWeight: '600', color: C.sub},
  tabTextActive: {color: C.purple},
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: {fontSize: 10, fontWeight: '800'},

  list: {paddingHorizontal: 14, paddingTop: 14, paddingBottom: 32},

  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: {width: 0, height: 4}},
      android: {elevation: 3},
    }),
  },

  cardTop: {flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10},
  serviceEmoji: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {fontSize: 24},
  serviceInfo: {flex: 1},
  serviceName: {fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 2},
  bookingId: {fontSize: 11, color: C.purple, fontWeight: '600', marginBottom: 3},
  datetime: {fontSize: 11, color: C.sub},

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {fontSize: 12, fontWeight: '800'},

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  stepLabel: {fontSize: 12, color: C.orange, fontWeight: '600'},

  addrRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  addrText: {flex: 1, fontSize: 12, color: C.sub},

  divider: {height: 1, backgroundColor: C.border, marginVertical: 10},

  cardBottom: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  amtLabel: {fontSize: 11, color: C.sub},
  amtVal: {fontSize: 18, fontWeight: '900', color: C.text},

  trackBtn: {borderRadius: 12, overflow: 'hidden'},
  trackGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  trackText: {color: '#fff', fontWeight: '800', fontSize: 13},

  actionRow: {flexDirection: 'row', gap: 8},
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.purple + '55',
    backgroundColor: C.purpleL,
  },
  outlineBtnText: {fontSize: 12, fontWeight: '700', color: C.purple},

  emptyBox: {alignItems: 'center', paddingTop: 60},
  emptyEmoji: {fontSize: 52, marginBottom: 16},
  emptyTitle: {fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 6},
  emptySub: {fontSize: 13, color: C.sub, textAlign: 'center'},
});
