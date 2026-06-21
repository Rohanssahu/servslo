import React, {useCallback, useRef, useState} from 'react';
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
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenNameEnum from '../../routes/screenName.enum';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import {getBookings, BookingItem} from '../../api/bookingApi';

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

// TABS built inside component to use translations

// STEP_LABELS built inside component to use translations

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
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {lang} = useLanguage();
  const t = languageStrings[lang];

  const fetchBookings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (e: any) {
      setError(e?.message ?? 'बुकिंग लोड नहीं हो सकी');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const TABS = [
    {key: 'active', label: t.activeTab, icon: 'time-outline'},
    {key: 'completed', label: t.completedTab, icon: 'checkmark-circle-outline'},
    {key: 'cancelled', label: t.cancelledTab, icon: 'close-circle-outline'},
  ];

  const STEP_LABELS: Record<string, string> = {
    ASSIGNED: t.stepAssigned,
    EN_ROUTE: t.stepEnRoute,
    ARRIVED: t.stepArrived,
    IN_PROGRESS: t.stepInProgress,
    COMPLETED: t.stepCompleted,
    CANCELLED: t.stepCancelled,
  };

  const filtered = bookings.filter(b => b.status === activeTab);

  const renderEmpty = () => (
    <View style={s.emptyBox}>
      <Text style={s.emptyEmoji}>
        {activeTab === 'active' ? '📋' : activeTab === 'completed' ? '✅' : '❌'}
      </Text>
      <Text style={s.emptyTitle}>
        {activeTab === 'active'
          ? t.noActiveBookings
          : activeTab === 'completed'
          ? t.noCompletedBookings
          : t.noCancelledBookings}
      </Text>
      <Text style={s.emptySub}>{t.goToHomeMsg}</Text>
    </View>
  );

  const renderItem = ({item}: {item: BookingItem}) => {
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
            <Text style={s.amtLabel}>{t.totalPaid}</Text>
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
                <Text style={s.trackText}>{t.track}</Text>
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
                <Text style={s.outlineBtnText}>{t.invoice}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.outlineBtn}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(ScreenNameEnum.AllServicesScreen)}>
                <Ionicons name="repeat" size={14} color={C.purple} />
                <Text style={s.outlineBtnText}>{t.bookAgain}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={s.outlineBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(ScreenNameEnum.AllServicesScreen)}>
              <Ionicons name="add-circle-outline" size={14} color={C.purple} />
              <Text style={s.outlineBtnText}>{t.newBook}</Text>
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
          <Text style={s.headerTitle}>{t.myBookings}</Text>
          <Text style={s.headerSub}>{t.allServiceBookings}</Text>
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
          const count = bookings.filter(b => b.status === tab.key).length;
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

      {loading && !refreshing ? (
        <View style={s.centeredState}>
          <ActivityIndicator size="large" color={C.purple} />
        </View>
      ) : error ? (
        <View style={s.centeredState}>
          <Text style={s.errorEmoji}>⚠️</Text>
          <Text style={s.errorTitle}>{error}</Text>
          <TouchableOpacity
            style={s.retryBtn}
            onPress={() => fetchBookings()}
            activeOpacity={0.8}>
            <Text style={s.retryText}>दोबारा कोशिश करें</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchBookings(true)}
              colors={[C.purple]}
              tintColor={C.purple}
            />
          }
        />
      )}
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

  centeredState: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60},
  errorEmoji: {fontSize: 40, marginBottom: 12},
  errorTitle: {fontSize: 14, color: C.sub, textAlign: 'center', marginBottom: 16, paddingHorizontal: 24},
  retryBtn: {
    backgroundColor: C.purple,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {color: '#fff', fontWeight: '700', fontSize: 14},
});
