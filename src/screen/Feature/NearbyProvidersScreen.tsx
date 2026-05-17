import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenNameEnum from '../../routes/screenName.enum';

const { width, height } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.46;

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'] as string[],
  purple: '#6E39F7',
  purpleL: '#f3eeff',
  green: '#13B36B',
  greenL: '#e8fbf0',
  orange: '#F59E0B',
  orangeL: '#FFF7ED',
  text: '#1a1a2e',
  sub: '#888',
  card: '#fff',
  bg: '#F4F3FB',
  border: '#efefef',
};

// ─── Types & constants ────────────────────────────────────────────────────────
type ProviderStatus = 'available' | 'on_way' | 'arriving';

type Provider = {
  id: string;
  name: string;
  initial: string;
  emoji: string;
  category: string;
  rating: string;
  jobs: number;
  dist: number;
  eta: number;
  status: ProviderStatus;
  lat: number;
  lng: number;
  phone: string;
};

const STATUS_META: Record<
  ProviderStatus,
  { label: string; color: string; bg: string; icon: string }
> = {
  available: {
    label: 'Available',
    color: C.green,
    bg: C.greenL,
    icon: 'checkmark-circle',
  },
  on_way: {
    label: 'On the Way',
    color: C.orange,
    bg: C.orangeL,
    icon: 'navigate',
  },
  arriving: {
    label: 'Arriving Soon',
    color: C.purple,
    bg: C.purpleL,
    icon: 'time',
  },
};

const USER_LOC = { latitude: 19.1723, longitude: 72.9446 };

const INIT_PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Ravi Kumar',
    initial: 'R',
    emoji: '⚡',
    category: 'Electrician',
    rating: '4.8',
    jobs: 312,
    dist: 1.2,
    eta: 8,
    status: 'available',
    lat: 19.1797,
    lng: 72.9506,
    phone: '+91 98765 43210',
  },
  {
    id: '2',
    name: 'Amit Sharma',
    initial: 'A',
    emoji: '🔧',
    category: 'Plumber',
    rating: '4.7',
    jobs: 245,
    dist: 1.8,
    eta: 12,
    status: 'available',
    lat: 19.1622,
    lng: 72.9482,
    phone: '+91 98765 43211',
  },
  {
    id: '3',
    name: 'Suresh Patel',
    initial: 'S',
    emoji: '❄️',
    category: 'AC Expert',
    rating: '4.9',
    jobs: 178,
    dist: 0.9,
    eta: 6,
    status: 'arriving',
    lat: 19.1745,
    lng: 72.9380,
    phone: '+91 98765 43212',
  },
  {
    id: '4',
    name: 'Karan Singh',
    initial: 'K',
    emoji: '🧹',
    category: 'Cleaner',
    rating: '4.8',
    jobs: 420,
    dist: 2.4,
    eta: 16,
    status: 'on_way',
    lat: 19.1854,
    lng: 72.9345,
    phone: '+91 98765 43213',
  },
  {
    id: '5',
    name: 'Deepak Yadav',
    initial: 'D',
    emoji: '🪚',
    category: 'Carpenter',
    rating: '4.6',
    jobs: 156,
    dist: 3.1,
    eta: 20,
    status: 'available',
    lat: 19.1658,
    lng: 72.9290,
    phone: '+91 98765 43214',
  },
];

const CATEGORY_FILTERS = [
  { key: 'all', label: '🗺 All' },
  { key: 'Electrician', label: '⚡ Electrician' },
  { key: 'Plumber', label: '🔧 Plumber' },
  { key: 'AC Expert', label: '❄️ AC' },
  { key: 'Cleaner', label: '🧹 Cleaner' },
  { key: 'Carpenter', label: '🪚 Carpenter' },
];

// ─── User location marker ─────────────────────────────────────────────────────
function UserMarker() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 2.4,
          duration: 1400,
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    ).start();
    return () => pulse.stopAnimation();
  }, [pulse]);

  return (
    <View style={mk.userWrap}>
      <Animated.View
        style={[
          mk.userRing,
          {
            transform: [{ scale: pulse }],
            opacity: pulse.interpolate({
              inputRange: [1, 2.4],
              outputRange: [0.5, 0],
            }),
          },
        ]}
      />
      <LinearGradient colors={['#13B36B', '#0EA65A']} style={mk.userDot}>
        <Ionicons name="home" size={15} color="#fff" />
      </LinearGradient>
      <View style={mk.userLabel}>
        <Text style={mk.userLabelTxt}>You</Text>
      </View>
    </View>
  );
}

// ─── Provider marker ──────────────────────────────────────────────────────────
function ProviderMarker({
  provider,
  isSelected,
}: {
  provider: Provider;
  isSelected: boolean;
}) {
  const pulse = useRef(new Animated.Value(1)).current;
  const meta = STATUS_META[provider.status];

  useEffect(() => {
    if (provider.status === 'arriving') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.7,
            duration: 600,
            useNativeDriver: false,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    } else if (provider.status === 'available') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.5,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    }
    return () => pulse.stopAnimation();
  }, [provider.status, pulse]);

  return (
    <View style={mk.provWrap}>
      {/* Pulse ring */}
      {provider.status !== 'on_way' && (
        <Animated.View
          style={[
            mk.provRing,
            {
              transform: [{ scale: pulse }],
              opacity: pulse.interpolate({
                inputRange: [1, 1.7],
                outputRange: [0.4, 0],
              }),
              backgroundColor: meta.color,
            },
          ]}
        />
      )}

      {/* Avatar */}
      <View
        style={[
          mk.provAvatar,
          {
            borderColor: meta.color,
            borderWidth: isSelected ? 3 : 2,
            backgroundColor: isSelected ? meta.color : C.card,
          },
        ]}>
        {provider.status === 'on_way' ? (
          <Text style={{ fontSize: 16 }}>🚗</Text>
        ) : (
          <Text
            style={[
              mk.provInitial,
              { color: isSelected ? '#fff' : meta.color },
            ]}>
            {provider.initial}
          </Text>
        )}
      </View>

      {/* Service emoji badge */}
      <View style={[mk.emojiBadge, { backgroundColor: meta.bg }]}>
        <Text style={{ fontSize: 8 }}>{provider.emoji}</Text>
      </View>

      {/* ETA callout for selected */}
      {isSelected && (
        <View style={[mk.etaCallout, { backgroundColor: meta.color }]}>
          <Text style={mk.etaCalloutTxt}>{provider.eta} min</Text>
        </View>
      )}
    </View>
  );
}

// ─── Provider card (horizontal scroll) ───────────────────────────────────────
function ProviderCard({
  provider,
  isSelected,
  onPress,
  onBook,
}: {
  provider: Provider;
  isSelected: boolean;
  onPress: () => void;
  onBook: () => void;
}) {
  const meta = STATUS_META[provider.status];
  return (
    <TouchableOpacity
      style={[st.pCard, isSelected && st.pCardSel]}
      onPress={onPress}
      activeOpacity={0.88}>
      <LinearGradient colors={C.grad} style={st.pCardAvatar}>
        <Text style={st.pCardAvatarTxt}>{provider.initial}</Text>
      </LinearGradient>
      <Text style={st.pCardName} numberOfLines={1}>
        {provider.name}
      </Text>
      <Text style={st.pCardCat}>
        {provider.emoji} {provider.category}
      </Text>
      <Text style={st.pCardRating}>⭐ {provider.rating}</Text>
      <View style={[st.pCardBadge, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon as any} size={9} color={meta.color} />
        <Text style={[st.pCardBadgeTxt, { color: meta.color }]}>
          {meta.label}
        </Text>
      </View>
      <View style={st.pCardFooter}>
        <Text style={st.pCardEta}>🕐 {provider.eta} min</Text>

      </View>
      <TouchableOpacity
        style={st.pCardBookBtn}
        onPress={onBook}
        activeOpacity={0.9}>
        <Text style={st.pCardBookTxt}>Book</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ─── Selected provider detail card ───────────────────────────────────────────
function SelectedProviderCard({
  provider,
  onBook,
  onCall,
  onClose,
}: {
  provider: Provider;
  onBook: () => void;
  onCall: () => void;
  onClose: () => void;
}) {
  const meta = STATUS_META[provider.status];
  const slide = useRef(new Animated.Value(28)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    slide.setValue(28);
    fade.setValue(0);
    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [provider.id, slide, fade]);

  return (
    <Animated.View
      style={[
        st.selCard,
        { opacity: fade, transform: [{ translateY: slide }] },
      ]}>
      {/* Header row */}
      <View style={st.selHeader}>
        <LinearGradient colors={C.grad} style={st.selAvatar}>
          <Text style={st.selAvatarTxt}>{provider.initial}</Text>
        </LinearGradient>
        <View style={st.selInfo}>
          <Text style={st.selName}>{provider.name}</Text>
          <Text style={st.selMeta}>
            ⭐ {provider.rating}  ·  {provider.jobs} jobs done
          </Text>
          <View style={[st.selBadge, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.icon as any} size={10} color={meta.color} />
            <Text style={[st.selBadgeTxt, { color: meta.color }]}>
              {meta.label}
            </Text>
          </View>
        </View>
        <View style={st.selActions}>
          <TouchableOpacity
            style={st.callBtn}
            onPress={onCall}
            activeOpacity={0.85}>
            <Ionicons name="call" size={17} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={st.chatBtn}
            onPress={onClose}
            activeOpacity={0.85}>
            <Ionicons name="close" size={17} color={C.sub} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats strip */}
      <View style={st.statsStrip}>
        <View style={st.statBox}>
          <Text style={st.statVal}>{provider.eta} min</Text>
          <Text style={st.statLbl}>ETA</Text>
        </View>
        <View style={st.statDivider} />
        <View style={st.statBox}>
          <Text style={st.statVal}>{provider.dist} km</Text>
          <Text style={st.statLbl}>Distance</Text>
        </View>
        <View style={st.statDivider} />
        <View style={st.statBox}>
          <Text style={st.statVal}>
            {provider.emoji} {provider.category}
          </Text>
          <Text style={st.statLbl}>Specialty</Text>
        </View>
      </View>

      {/* Book CTA */}
      <TouchableOpacity
        style={st.bookNowBtn}
        onPress={onBook}
        activeOpacity={0.9}>
        <LinearGradient colors={C.grad} style={st.bookNowGrad}>
          <Text style={st.bookNowTxt}>
            Book {provider.name.split(' ')[0]} Instantly
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function NearbyProvidersScreen({
  navigation,
  route,
}: any) {
  const paramTitle: string = route?.params?.title ?? 'Nearby Providers';
  const paramCat: string = route?.params?.category ?? 'all';

  const [providers, setProviders] = useState<Provider[]>(INIT_PROVIDERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string>(
    paramCat === 'all' ? 'all' : paramCat,
  );
  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef<MapView>(null);
  const sheetY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const liveCount = useRef(new Animated.Value(0)).current;

  // ── Selected provider ──────────────────────────────────────────
  const selectedProvider = useMemo(
    () => providers.find(p => p.id === selectedId) ?? null,
    [providers, selectedId],
  );

  // ── Filtered list ──────────────────────────────────────────────
  const filteredProviders = useMemo(() => {
    if (filterCat === 'all') {
      return providers;
    }
    return providers.filter(p =>
      p.category.toLowerCase().includes(filterCat.toLowerCase()),
    );
  }, [providers, filterCat]);

  // ── Mount animations ───────────────────────────────────────────
  useEffect(() => {
    Animated.parallel([
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [sheetY, headerFade]);

  // ── Live provider movement simulation ──────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setProviders(prev =>
        prev.map(p => {
          if (p.status === 'on_way') {
            const dLat = (USER_LOC.latitude - p.lat) * 0.06;
            const dLng = (USER_LOC.longitude - p.lng) * 0.06;
            const newEta = Math.max(2, p.eta - 1);
            const newDist = Math.max(0.3, p.dist - 0.07);
            return {
              ...p,
              lat: p.lat + dLat,
              lng: p.lng + dLng,
              eta: newEta,
              dist: parseFloat(newDist.toFixed(1)),
            };
          }
          if (p.status === 'arriving') {
            const dLat = (USER_LOC.latitude - p.lat) * 0.1;
            const dLng = (USER_LOC.longitude - p.lng) * 0.1;
            const newEta = Math.max(1, p.eta - 1);
            const newDist = Math.max(0.1, p.dist - 0.04);
            return {
              ...p,
              lat: p.lat + dLat,
              lng: p.lng + dLng,
              eta: newEta,
              dist: parseFloat(newDist.toFixed(1)),
            };
          }
          return p;
        }),
      );
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // ── Marker tap ─────────────────────────────────────────────────
  const handleMarkerPress = useCallback(
    (prov: Provider) => {
      setSelectedId(prov.id);
      mapRef.current?.animateToRegion(
        {
          latitude: prov.lat - 0.006,
          longitude: prov.lng,
          latitudeDelta: 0.022,
          longitudeDelta: 0.022,
        },
        600,
      );
    },
    [],
  );

  // ── Card tap ───────────────────────────────────────────────────
  const handleCardPress = useCallback(
    (prov: Provider) => {
      handleMarkerPress(prov);
    },
    [handleMarkerPress],
  );

  // ── Recenter map ───────────────────────────────────────────────
  const recenter = useCallback(() => {
    setSelectedId(null);
    mapRef.current?.animateToRegion(
      {
        latitude: USER_LOC.latitude,
        longitude: USER_LOC.longitude,
        latitudeDelta: 0.055,
        longitudeDelta: 0.055,
      },
      600,
    );
  }, []);

  const navigateToBooking = useCallback(
    (prov: Provider) => {
      navigation.navigate(ScreenNameEnum.ServiceBookingScreen, {
        service: {
          label: prov.category,
          emoji: prov.emoji,
          desc: `Expert: ${prov.name}`,
          rating: prov.rating,
          basePrice: 199,
        },
        preSelectedProvider: {
          name: prov.name,
          initial: prov.initial,
          rating: prov.rating,
          jobs: prov.jobs,
          eta: prov.eta,
          dist: prov.dist,
          phone: prov.phone,
          status: prov.status,
        },
      });
    },
    [navigation],
  );

  return (
    <View style={st.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* ── Full-screen map ──────────────────────────────────── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: USER_LOC.latitude,
          longitude: USER_LOC.longitude,
          latitudeDelta: 0.055,
          longitudeDelta: 0.055,
        }}
        onMapReady={() => setMapReady(true)}
        showsCompass={false}
        showsMyLocationButton={false}
        showsUserLocation={false}
        mapType="standard">

        {/* User location */}
        <Marker
          coordinate={USER_LOC}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={false}>
          <UserMarker />
        </Marker>

        {/* Provider markers */}
        {providers.map(prov => (
          <Marker
            key={prov.id}
            coordinate={{ latitude: prov.lat, longitude: prov.lng }}
            anchor={{ x: 0.5, y: 1.1 }}
            onPress={() => handleMarkerPress(prov)}
            tracksViewChanges={selectedId === prov.id}>
            <ProviderMarker
              provider={prov}
              isSelected={selectedId === prov.id}
            />
          </Marker>
        ))}

        {/* Route line from selected provider to user */}
        {selectedProvider && (
          <Polyline
            coordinates={[
              {
                latitude: selectedProvider.lat,
                longitude: selectedProvider.lng,
              },
              USER_LOC,
            ]}
            strokeColor={STATUS_META[selectedProvider.status].color}
            strokeWidth={3}
            lineDashPattern={[8, 5]}
          />
        )}
      </MapView>

      {/* ── Top header ───────────────────────────────────────── */}
      <Animated.View style={[st.topHeader, { opacity: headerFade }]}>
        <SafeAreaView>
          <LinearGradient
            colors={[
              'rgba(255,255,255,0.97)',
              'rgba(255,255,255,0.85)',
              'rgba(255,255,255,0)',
            ]}
            style={st.topGrad}>
            <TouchableOpacity
              style={st.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}>
              <Ionicons name="arrow-back" size={22} color={C.text} />
            </TouchableOpacity>

            <View style={st.topCenter}>
              <Text style={st.topTitle}>{paramTitle}</Text>
              <View style={st.liveRow}>
                <View style={st.liveDotGreen} />
                <Text style={st.liveTxt}>
                  {filteredProviders.length} available · Live
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={st.recenterBtn}
              onPress={recenter}
              activeOpacity={0.85}>
              <Ionicons name="locate" size={20} color={C.purple} />
            </TouchableOpacity>
          </LinearGradient>
        </SafeAreaView>
      </Animated.View>

      {/* ── Live badge overlay ────────────────────────────────── */}
      {mapReady && (
        <View style={st.liveBadge}>
          <View style={st.liveBadgeDot} />
          <Text style={st.liveBadgeTxt}>LIVE MAP</Text>
        </View>
      )}

      {/* ── Bottom sheet ─────────────────────────────────────── */}
      <Animated.View
        style={[st.sheet, { transform: [{ translateY: sheetY }] }]}>
        {/* Drag handle */}
        <View style={st.handle} />

        {/* Category filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={st.filterScroll}>
          {CATEGORY_FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[
                st.filterChip,
                filterCat === f.key && st.filterChipActive,
              ]}
              onPress={() => {
                setFilterCat(f.key);
                setSelectedId(null);
              }}
              activeOpacity={0.8}>
              <Text
                style={[
                  st.filterChipTxt,
                  filterCat === f.key && st.filterChipTxtActive,
                ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sheet header */}
        <View style={st.sheetHead}>
          {selectedProvider ? (
            <Text style={st.sheetTitle}>{selectedProvider.name}</Text>
          ) : (
            <Text style={st.sheetTitle}>
              {filteredProviders.length} Professionals Nearby
            </Text>
          )}
          <View style={st.onlinePill}>
            <View style={st.onlineDot} />
            <Text style={st.onlineTxt}>Online Now</Text>
          </View>
        </View>

        {/* Content: selected detail OR horizontal card list */}
        {selectedProvider ? (
          <SelectedProviderCard
            provider={selectedProvider}
            onBook={() => navigateToBooking(selectedProvider)}
            onCall={() => {
              if (selectedProvider.phone) {
                Linking.openURL(`tel:${selectedProvider.phone}`);
              }
            }}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={st.cardScroll}
            decelerationRate="fast">
            {filteredProviders.map(prov => (
              <ProviderCard
                key={prov.id}
                provider={prov}
                isSelected={selectedId === prov.id}
                onPress={() => handleCardPress(prov)}
                onBook={() => navigateToBooking(prov)}
              />
            ))}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
}

// ─── Marker styles ────────────────────────────────────────────────────────────
const mk = StyleSheet.create({
  // User
  userWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  userRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: C.green,
  },
  userDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  userLabel: {
    position: 'absolute',
    bottom: -2,
    backgroundColor: C.green,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  userLabelTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
  },

  // Provider
  provWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 64,
  },
  provRing: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  provAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  provInitial: {
    fontSize: 16,
    fontWeight: '900',
  },
  emojiBadge: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  etaCallout: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  etaCalloutTxt: {
    fontSize: 9,
    fontWeight: '900',
    color: '#fff',
  },
});

// ─── Screen styles ────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e8e8e8' },

  // Top header
  topHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 8 : 8,
    paddingBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  topCenter: { flex: 1, alignItems: 'center' },
  topTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -0.3,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  liveDotGreen: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.green,
  },
  liveTxt: { fontSize: 12, color: C.sub, fontWeight: '600' },
  recenterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  // Live badge
  liveBadge: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 76 : 96,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  liveBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.green,
  },
  liveBadgeTxt: {
    fontSize: 11,
    fontWeight: '900',
    color: C.green,
    letterSpacing: 0.8,
  },

  // Bottom sheet
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 2,
  },

  // Filter chips
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    height: 32,
    backgroundColor: '#f4f4f8',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: C.purpleL,
    borderColor: C.purple,
  },
  filterChipTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: C.sub,
  },
  filterChipTxtActive: { color: C.purple },

  // Sheet header
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  sheetTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
    color: C.text,
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.greenL,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.green,
  },
  onlineTxt: { fontSize: 11, fontWeight: '800', color: C.green },

  // Provider cards (horizontal scroll)
  cardScroll: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    gap: 12,
  },
  pCard: {
    width: 148,
    backgroundColor: '#fafafa',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: C.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

  },
  pCardSel: {
    borderColor: C.purple,
    backgroundColor: C.purpleL,
  },
  pCardAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  pCardAvatarTxt: { fontSize: 22, fontWeight: '900', color: '#fff' },
  pCardName: {
    fontSize: 15,
    fontWeight: '800',
    color: C.text,
    marginBottom: 2,
  },
  pCardCat: { fontSize: 14, color: C.sub, marginBottom: 2 },
  pCardRating: { fontSize: 14, color: C.sub, marginBottom: 6 },
  pCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  pCardBadgeTxt: { fontSize: 10, fontWeight: '700' },
  pCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pCardEta: { fontSize: 13, fontWeight: '600', color: C.sub },
  pCardBookBtn: {
    backgroundColor: C.purple,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  pCardBookTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },

  // Selected provider card
  selCard: {
    marginHorizontal: 16,
    backgroundColor: '#fafafa',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: C.purple + '33',
  },
  selHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  selAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selAvatarTxt: { fontSize: 24, fontWeight: '900', color: '#fff' },
  selInfo: { flex: 1 },
  selName: { fontSize: 17, fontWeight: '900', color: C.text, marginBottom: 2 },
  selMeta: { fontSize: 12, color: C.sub, marginBottom: 5 },
  selBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  selBadgeTxt: { fontSize: 11, fontWeight: '700' },
  selActions: { gap: 6 },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  // Stats strip
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.purpleL,
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: {
    fontSize: 14,
    fontWeight: '900',
    color: C.purple,
    marginBottom: 2,
  },
  statLbl: { fontSize: 10, color: C.sub, fontWeight: '600' },
  statDivider: { width: 1, height: 32, backgroundColor: C.border },

  // Book CTA
  bookNowBtn: { borderRadius: 14, overflow: 'hidden' },
  bookNowGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  bookNowTxt: { color: '#fff', fontWeight: '900', fontSize: 15 },
});
