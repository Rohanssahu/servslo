import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import MapView from 'react-native-maps';

// ─── Constants ────────────────────────────────────────────────────────────────
const BOTTOM_SHEET_H = 336;

type AddressType = 'home' | 'office' | 'other';

const TYPE_OPTIONS: {key: AddressType; emoji: string; label: string}[] = [
  {key: 'home',   emoji: '🏠', label: 'Home'},
  {key: 'office', emoji: '💼', label: 'Office'},
  {key: 'other',  emoji: '👥', label: 'Other'},
];

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  purple:  '#4d2b98',
  purpleL: '#F0EBFF',
  text:    '#1A1A2E',
  sub:     '#888888',
  border:  '#E5E5EA',
};

// ─── Screen ───────────────────────────────────────────────────────────────────
const LocationPickerScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [region, setRegion] = useState({
    latitude:       19.1712,
    longitude:      72.9565,
    latitudeDelta:  0.01,
    longitudeDelta: 0.01,
  });
  const [searchText, setSearchText]   = useState('');
  const [addressType, setAddressType] = useState<AddressType>('home');
  const [landmark, setLandmark]       = useState('');
  const [isMoving, setIsMoving]       = useState(false);

  const handleConfirm = () => {
    navigation.goBack();
  };

  const handleLocateMe = () => {
    console.log('Locating user…');
  };

  const displayAddress =
    searchText.trim().length > 0
      ? searchText
      : `${region.latitude.toFixed(4)}°N, ${region.longitude.toFixed(4)}°E`;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ── Map area (flex: 1 takes all space above the bottom sheet) ──── */}
      <View style={s.mapContainer}>

        {/* Map fills its container completely */}
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          onRegionChange={() => setIsMoving(true)}
          onRegionChangeComplete={r => {
            setRegion(r);
            setIsMoving(false);
          }}
        />

        {/* Fixed center pin — positioned absolutely inside mapContainer */}
        <View style={s.centerPinWrap} pointerEvents="none">
          <Image
            source={require('../../assets/icons/pin.png')}
            style={[s.centerPin, isMoving && s.centerPinUp]}
            resizeMode="contain"
          />
          <View style={[s.pinShadow, isMoving && s.pinShadowSmall]} />
        </View>

        {/* Back button + Search bar — top overlay */}
        <View style={s.topOverlay}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={s.searchBar}>
            <Text style={s.searchIcon}>🔍</Text>
            <TextInput
              style={s.searchInput}
              placeholder="Search area, street, landmark…"
              placeholderTextColor="#aaa"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Text style={s.clearText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* GPS locate-me button — bottom-right of map area */}
        <TouchableOpacity
          style={s.gpsBtn}
          onPress={handleLocateMe}
          activeOpacity={0.85}>
          <Text style={s.gpsEmoji}>🎯</Text>
        </TouchableOpacity>

      </View>

      {/* ── Bottom sheet — in normal flow (not absolute) ──────────────── */}
      <View style={s.bottomSheet}>
        {/* Handle */}
        <View style={s.handle} />

        <Text style={s.sheetTitle}>Set delivery location</Text>

        {/* Detected / searched address */}
        <View style={s.addressRow}>
          <Text style={s.pinDot}>📍</Text>
          <Text style={s.addressText} numberOfLines={2}>{displayAddress}</Text>
          <TouchableOpacity
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            onPress={() => setSearchText('')}>
            <Text style={s.editIcon}>✎</Text>
          </TouchableOpacity>
        </View>

        {/* Save as — address type chips */}
        <Text style={s.saveAsLabel}>Save as</Text>
        <View style={s.typeRow}>
          {TYPE_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[s.typeChip, addressType === opt.key && s.typeChipOn]}
              onPress={() => setAddressType(opt.key)}
              activeOpacity={0.8}>
              <Text style={s.typeEmoji}>{opt.emoji}</Text>
              <Text style={[s.typeLabel, addressType === opt.key && s.typeLabelOn]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Flat / Landmark */}
        <TextInput
          style={s.landmarkInput}
          placeholder="Flat no. / Building / Landmark (optional)"
          placeholderTextColor="#bbb"
          value={landmark}
          onChangeText={setLandmark}
        />

        {/* Confirm */}
        <TouchableOpacity
          style={s.confirmBtn}
          onPress={handleConfirm}
          activeOpacity={0.88}>
          <Text style={s.confirmBtnText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default LocationPickerScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({

  safe: {flex: 1, backgroundColor: '#fff'},

  // Map container takes all space above the bottom sheet
  mapContainer: {
    flex: 1,
    // DO NOT use position:absolute here — flex handles the height
  },

  // Pin fixed at center of mapContainer
  centerPinWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  centerPin: {
    width: 38,
    height: 38,
    marginBottom: 4,
  },
  centerPinUp: {
    transform: [{translateY: -8}],
  },
  pinShadow: {
    width: 12,
    height: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  pinShadowSmall: {
    width: 8,
    height: 4,
    opacity: 0.12,
  },

  // Top bar (back + search)
  topOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 10 : 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    ...Platform.select({
      ios:     {shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 6, shadowOffset: {width: 0, height: 2}},
      android: {elevation: 5},
    }),
  },
  backArrow: {fontSize: 20, fontWeight: '700', color: C.text},
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    ...Platform.select({
      ios:     {shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: {width: 0, height: 2}},
      android: {elevation: 5},
    }),
  },
  searchIcon:  {fontSize: 16, marginRight: 8},
  searchInput: {flex: 1, fontSize: 14, color: C.text},
  clearText:   {color: '#bbb', fontSize: 15, paddingLeft: 6},

  // GPS button
  gpsBtn: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...Platform.select({
      ios:     {shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 8, shadowOffset: {width: 0, height: 3}},
      android: {elevation: 6},
    }),
  },
  gpsEmoji: {fontSize: 24},

  // Bottom sheet — normal flex flow, NOT absolute
  bottomSheet: {
    height: BOTTOM_SHEET_H,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.select({ios: 24, android: 12}) ?? 12,
    ...Platform.select({
      ios:     {shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: {width: 0, height: -4}},
      android: {elevation: 12},
    }),
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.text,
    marginBottom: 12,
  },

  // Address preview
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F6FB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  pinDot:      {fontSize: 18, marginRight: 8},
  addressText: {flex: 1, fontSize: 13, color: C.text, lineHeight: 18},
  editIcon:    {fontSize: 18, color: C.purple, paddingLeft: 8},

  // Save as
  saveAsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.sub,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  typeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: '#FAFAFA',
    marginRight: 10,
  },
  typeChipOn: {
    backgroundColor: C.purpleL,
    borderColor: C.purple,
  },
  typeEmoji:    {fontSize: 17, marginRight: 5},
  typeLabel:    {fontSize: 13, fontWeight: '600', color: C.sub},
  typeLabelOn:  {color: C.purple},

  // Landmark
  landmarkInput: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: C.text,
    backgroundColor: '#FAFAFA',
    marginBottom: 12,
  },

  // Confirm
  confirmBtn: {
    backgroundColor: C.purple,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    ...Platform.select({
      ios:     {shadowColor: C.purple, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: {width: 0, height: 4}},
      android: {elevation: 4},
    }),
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
