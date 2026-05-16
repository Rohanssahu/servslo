import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  TextInput,
} from 'react-native';
import ScreenNameEnum from '../../routes/screenName.enum';
import LinearGradient from 'react-native-linear-gradient';
import ServiceBottomSheet, {
  ServiceBottomSheetRef,
} from '../Feature/ServiceBottomSheet';
import {useIsFocused} from '@react-navigation/native';
import SpeakerButton from '../../component/SpeakerButton';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';

const {width} = Dimensions.get('window');
const BOOKED_W = 158;

// ─── Static data (price/rating rows stay outside; label arrays move inside) ──

const DEALS = [
  {time: '60 min', price: '₹149', old: '₹169', off: '11% OFF', label: 'Basic Clean'},
  {time: '90 min', price: '₹219', old: '₹255', off: '14% OFF', label: 'Deep Clean'},
  {time: '120 min',price: '₹289', old: '₹320', off: '10% OFF', label: 'Full Home'},
];

const MOST_BOOKED = [
  {title: 'Bathroom Deep Clean',   rating: '4.8', reviews: '2.8M', price: '₹519', emoji: '🚿'},
  {title: '2 Bathroom Cleaning',   rating: '4.8', reviews: '2.8M', price: '₹950', oldPrice: '₹1,038', off: '8% OFF', emoji: '🏠'},
  {title: 'Washing Machine Clean', rating: '4.8', reviews: '319K', price: '₹160', emoji: '🫧'},
];

// ────────────────────────────────────────────────────────────────────────────

const HOME_SCRIPT_HI =
  'नमस्ते! ServSLO में आपका स्वागत है। यहाँ घर बैठे electrician, plumber, cleaning और 50 से ज़्यादा services बुक करें। हमारे verified expert सिर्फ 10 मिनट में आपके घर पहुँचेंगे। आज कौन सी service चाहिए?';
const HOME_SCRIPT_EN =
  'Welcome to ServSLO! Book electricians, plumbers, cleaning and 50-plus home services right from home. Our verified experts arrive in just 10 minutes. What service do you need today?';

export default function HomeScreen({navigation}: {navigation: any}) {
  const sheetRef = useRef<ServiceBottomSheetRef>(null);
  const [searchText, setSearchText] = useState('');
  const isFocus = useIsFocused();
  const {lang} = useLanguage();
  const t = languageStrings[lang];

  // ── Translated data arrays (depend on `t`) ───────────────────────────────
  const QUICK_SERVICES = [
    {
      label: t.electrician,
      emoji: '⚡',
      desc: t.wiringRepairs,
      rating: '4.8',
      basePrice: 199,
    },
    {
      label: t.plumber,
      emoji: '🔧',
      desc: t.leaksPipesTaps,
      rating: '4.7',
      basePrice: 149,
    },
    {
      label: t.cleaning,
      emoji: '🧹',
      desc: t.fullHomeClean,
      rating: '4.9',
      basePrice: 299,
    },
    {
      label: t.acRepair,
      emoji: '❄️',
      desc: t.serviceRepair,
      rating: '4.8',
      basePrice: 349,
    },
    {
      label: t.carpenter,
      emoji: '🪚',
      desc: t.furnitureDoors,
      rating: '4.6',
      basePrice: 249,
    },
    {
      label: t.painting,
      emoji: '🖌️',
      desc: t.interiorExterior,
      rating: '4.7',
      basePrice: 499,
    },
    {
      label: t.pestControl,
      emoji: '🐛',
      desc: t.allPestTypes,
      rating: '4.8',
      basePrice: 599,
    },
    {label: t.more, emoji: '➕', desc: '', rating: '4.8', basePrice: 0},
  ];
  const SALON_ITEMS = [
    {label: t.waxing, emoji: '✨'},
    {label: t.facial, emoji: '💆'},
    {label: t.manicure, emoji: '💅'},
    {label: t.pedicure, emoji: '🦶'},
  ];
  const APPLIANCE_ITEMS = [
    {label: t.acService, emoji: '❄️'},
    {label: t.washingMachine, emoji: '🫧'},
    {label: t.waterPurifier, emoji: '💧'},
    {label: t.fridgeRepair, emoji: '🧊'},
  ];
  const SMALL_TILES = [
    {label: t.laundry, emoji: '👕'},
    {label: t.dishwashing, emoji: '🍽️'},
    {label: t.bathroom, emoji: '🚿'},
    {label: t.kitchen, emoji: '🍳'},
  ];
  const TRUST_ITEMS = [
    {icon: '⚡', text: t.trustResponse},
    {icon: '✅', text: t.trustVerified},
    {icon: '🏠', text: t.trustFamilies},
  ];

  useEffect(() => {
    sheetRef.current?.close();
  }, [isFocus]);

  const handleSearch = () => {
    console.log('Searching for:', searchText);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#6E39F7', '#8E57FF', '#B78CFF']}
        start={{x: 0.1, y: 0}}
        end={{x: 1, y: 1}}
        style={s.header}>
        <TouchableOpacity
          style={s.addressBlock}
          onPress={() => navigation.navigate(ScreenNameEnum.AddressesScreen)}
          activeOpacity={0.8}>
          <Text style={s.addressLabel}>{t.welcomeBack}</Text>
          <View style={s.addressRow}>
            <Text style={s.addressPin}>📍 </Text>
            <Text style={s.addressText} numberOfLines={1}>
              Mulund Road, Mumbai...
            </Text>
          </View>
        </TouchableOpacity>

        <View style={s.headerRight}>
          <TouchableOpacity
            style={s.bellBtn}
            onPress={() => navigation.navigate(ScreenNameEnum.NotificationList)}
            activeOpacity={0.8}>
            <Text style={s.bellText}>🔔</Text>
          </TouchableOpacity>
          <SpeakerButton
            scriptHi={HOME_SCRIPT_HI}
            scriptEn={HOME_SCRIPT_EN}
            light
            style={s.speakerMargin}
          />
        </View>
      </LinearGradient>

      {/* ── Scroll Body ─────────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Search */}
        <View style={s.searchBox}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder={t.searchPlaceholder}
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} hitSlop={{top:8,bottom:8,left:8,right:8}}>
              <Text style={s.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Trust Strip */}
        <View style={s.trustStrip}>
          {TRUST_ITEMS.map((item, i) => (
            <View key={i} style={s.trustItem}>
              <Text style={s.trustEmoji}>{item.icon}</Text>
              <Text style={s.trustText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* What do you need? */}
        <View style={s.card}>
          <View style={s.cardTitleRow}>
            <Text style={s.cardTitle}>{t.whatDoYouNeed}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(ScreenNameEnum.AllServicesScreen, {category: 'all', title: 'All Services'})}>
              <Text style={s.seeAll}>{t.seeAll}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.storyList}>
            {QUICK_SERVICES.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={s.storyItem}
                onPress={() => {
                  if (item.basePrice === 0) {
                    navigation.navigate(ScreenNameEnum.AllServicesScreen, {category: 'all', title: 'All Services'});
                  } else {
                    navigation.navigate(ScreenNameEnum.ServiceBookingScreen, {service: item});
                  }
                }}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={['#6E39F7', '#C084FC', '#F0ABFC']}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}
                  style={s.storyRing}>
                  <View style={s.storyInner}>
                    <Text style={s.storyEmoji}>{item.emoji}</Text>
                  </View>
                </LinearGradient>
                <Text style={s.storyLabel} numberOfLines={2}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Cleaning Packages */}
        <View style={s.card}>
          <View style={s.cardTitleRow}>
            <Text style={s.cardTitle}>{t.quickCleaning}</Text>
            <View style={s.livePill}>
              <Text style={s.livePillText}>{t.livePill}</Text>
            </View>
          </View>
          <Text style={s.cardSub}>{t.arrivesIn10Min}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hPad}>
            {DEALS.map((d, i) => (
              <View key={i} style={s.dealCard}>
                <View style={s.dealBadge}>
                  <Text style={s.dealBadgeText}>{d.off}</Text>
                </View>
                <Text style={s.dealLabel}>{d.label}</Text>
                <Text style={s.dealTime}>{d.time}</Text>
                <View style={s.dealPriceRow}>
                  <Text style={s.dealPrice}>{d.price}</Text>
                  <Text style={s.dealOld}>{d.old}</Text>
                </View>
                <TouchableOpacity style={s.bookBtnFill} onPress={() => sheetRef.current?.open()} activeOpacity={0.8}>
                  <Text style={s.bookBtnFillText}>{t.bookNow}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Most Booked */}
        <View style={s.card}>
          <View style={s.cardTitleRow}>
            <Text style={s.cardTitle}>{t.mostBooked}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(ScreenNameEnum.AllServicesScreen, {category: 'cleaning', title: 'Most Booked'})}>
              <Text style={s.seeAll}>{t.seeAll}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hPad}>
            {MOST_BOOKED.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[s.bookedCard, {width: BOOKED_W}]}
                onPress={() => sheetRef.current?.open()}
                activeOpacity={0.85}>
                {item.off && (
                  <View style={s.bookedBadge}>
                    <Text style={s.bookedBadgeText}>{item.off}</Text>
                  </View>
                )}
                <View style={s.bookedEmojiBox}>
                  <Text style={s.bookedEmoji}>{item.emoji}</Text>
                </View>
                <Text style={s.bookedTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={s.bookedRating}>⭐ {item.rating} ({item.reviews})</Text>
                <View style={s.bookedFooter}>
                  <View>
                    <Text style={s.bookedPrice}>{item.price}</Text>
                    {item.oldPrice && <Text style={s.bookedOldPrice}>{item.oldPrice}</Text>}
                  </View>
                  <View style={s.addBtn}>
                    <Text style={s.addBtnText}>+</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Our Services */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t.ourServices}</Text>
          <Text style={s.cardSub}>{t.multipleServices}</Text>
          <View style={s.bigRow}>
            <TouchableOpacity style={s.bigTile} activeOpacity={0.8}>
              <Text style={s.bigTileText}>{t.everydayCleaning}</Text>
              <Image source={require('../../assets/images/mop.png')} style={s.bigTileImg} />
            </TouchableOpacity>
            <TouchableOpacity style={s.bigTile} activeOpacity={0.8}>
              <Text style={s.bigTileText}>{t.weeklyCleaning}</Text>
              <Image source={require('../../assets/images/cleaning.jpg')} style={s.bigTileImg} />
            </TouchableOpacity>
          </View>
          <View style={s.smallRow}>
            {SMALL_TILES.map((item, i) => (
              <TouchableOpacity key={i} style={s.smallTile} activeOpacity={0.75}>
                <Text style={s.smallTileEmoji}>{item.emoji}</Text>
                <Text style={s.smallTileLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Salon for Women */}
        <View style={s.card}>
          <View style={s.cardTitleRow}>
            <Text style={s.cardTitle}>{t.salonForWomen}</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={s.seeAll}>{t.seeAll}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hPad}>
            {SALON_ITEMS.map((srv, i) => (
              <TouchableOpacity key={i} style={s.srvTile} onPress={() => sheetRef.current?.open()} activeOpacity={0.8}>
                <View style={s.srvEmojiBox}>
                  <Text style={s.srvEmoji}>{srv.emoji}</Text>
                </View>
                <Text style={s.srvLabel}>{srv.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Appliance Repair */}
        <View style={s.card}>
          <View style={s.cardTitleRow}>
            <Text style={s.cardTitle}>{t.applianceRepair}</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={s.seeAll}>{t.seeAll}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hPad}>
            {APPLIANCE_ITEMS.map((srv, i) => (
              <TouchableOpacity key={i} style={s.srvTile} onPress={() => sheetRef.current?.open()} activeOpacity={0.8}>
                <View style={s.applianceEmojiBox}>
                  <Text style={s.srvEmoji}>{srv.emoji}</Text>
                </View>
                <Text style={s.srvLabel}>{srv.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trained Professionals */}
        <View style={[s.card, s.proCard]}>
          <View style={s.proCardContent}>
            <Text style={s.proTitle}>{t.trainedProfessionals}</Text>
            <Text style={s.proDesc}>{t.backgroundVerified}</Text>
            <View style={s.proBadgeRow}>
              <View style={s.proBadge}>
                <Text style={s.proBadgeText}>{t.verified}</Text>
              </View>
              <View style={s.proBadge}>
                <Text style={s.proBadgeText}>{t.insured}</Text>
              </View>
            </View>
          </View>
          <Image source={require('../../assets/images/glove.jpg')} style={s.proImg} />
        </View>

        <View style={s.bottomSpacer} />
      </ScrollView>

      <ServiceBottomSheet ref={sheetRef} onClose={() => console.log('Sheet closed')} />
    </SafeAreaView>
  );
}

// ─── Color tokens ────────────────────────────────────────────────────────────
const C = {
  purple: '#4d2b98',
  purpleL: '#f3eeff',
  bg: '#f4f3fb',
  card: '#ffffff',
  text: '#1a1a2e',
  sub: '#888888',
  border: '#efefef',
  green: '#21865b',
  greenBg: '#e8fbf0',
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({

  safe: {flex: 1, backgroundColor: C.bg},

  // Header
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressBlock: {flex: 1},
  addressLabel: {color: '#fff', fontSize: 20, fontWeight: '500', marginBottom: 2},
  addressRow: {flexDirection: 'row', alignItems: 'center',marginLeft:-5},
  addressPin: {color: 'rgba(255,255,255,0.85)', fontSize: 13},
  addressText: {color: '#fff', fontWeight: '700', fontSize: 14, flex: 1},
  chevron: {color: '#fff', fontSize: 16, marginLeft: 4},
  headerRight: {flexDirection: 'row', alignItems: 'center'},
  headerPill: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerPillText: {color: '#fff', fontWeight: '700', fontSize: 13},
  walletPill: {backgroundColor: '#fff'},
  walletText: {color: C.purple, fontWeight: '700', fontSize: 13},
  bellBtn: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellText: {fontSize: 17},

  // Scroll
  scroll: {paddingBottom: 96, paddingTop: 4},

  // Search
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    ...Platform.select({
      ios:     {shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: {width: 0, height: 2}},
      android: {elevation: 3},
    }),
  },
  searchIcon: {fontSize: 18, marginRight: 8},
  searchInput: {flex: 1, fontSize: 15, color: C.text},
  clearText: {color: '#bbb', fontSize: 16, paddingLeft: 8},

  // Trust strip
  trustStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: C.purpleL,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  trustItem: {flexDirection: 'row', alignItems: 'center'},
  trustEmoji: {fontSize: 14, marginRight: 4},
  trustText: {fontSize: 11, fontWeight: '600', color: C.purple},

  // Cards (sections)
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    ...Platform.select({
      ios:     {shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: {width: 0, height: 3}},
      android: {elevation: 3},
    }),
  },
  cardTitle: {fontSize: 18, fontWeight: '800', color: C.purple, marginBottom: 4},
  cardTitleRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4},
  cardSub: {fontSize: 13, color: C.sub, marginBottom: 14},
  seeAll: {fontSize: 13, fontWeight: '700', color: C.purple},

  livePill: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  livePillText: {fontSize: 11, fontWeight: '800', color: '#f97316'},

  // Story-style horizontal scroll (What do you need?)
  storyList: {paddingVertical: 10, paddingRight: 4},
  storyItem: {alignItems: 'center', marginRight: 18, width: 68},
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyEmoji: {fontSize: 28},
  storyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.text,
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 15,
  },

  // Deal cards
  hPad: {paddingTop: 4, paddingBottom: 4},
  dealCard: {
    width: 138,
    marginRight: 12,
    backgroundColor: '#fafafa',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  dealBadge: {
    backgroundColor: C.greenBg,
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  dealBadgeText: {fontSize: 10, fontWeight: '800', color: C.green},
  dealLabel: {fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 2},
  dealTime: {fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 4},
  dealPriceRow: {flexDirection: 'row', alignItems: 'baseline', marginBottom: 12},
  dealPrice: {fontSize: 15, fontWeight: '800', color: C.text, marginRight: 4},
  dealOld: {fontSize: 12, color: '#bbb', textDecorationLine: 'line-through'},
  bookBtnFill: {
    backgroundColor: C.purple,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  bookBtnFillText: {color: '#fff', fontWeight: '700', fontSize: 13},

  // Most booked cards
  bookedCard: {
    marginRight: 12,
    backgroundColor: '#fafafa',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  bookedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: C.greenBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 1,
  },
  bookedBadgeText: {fontSize: 10, fontWeight: '800', color: C.green},
  bookedEmojiBox: {
    width: '100%',
    height: 70,
    backgroundColor: C.purpleL,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bookedEmoji: {fontSize: 34},
  bookedTitle: {fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 4, lineHeight: 18},
  bookedRating: {fontSize: 11, color: C.sub, marginBottom: 6},
  bookedFooter: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'},
  bookedPrice: {fontSize: 15, fontWeight: '800', color: C.text},
  bookedOldPrice: {fontSize: 11, color: '#bbb', textDecorationLine: 'line-through'},
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {color: '#fff', fontSize: 20, fontWeight: '700', lineHeight: 24},

  // Our Services
  bigRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12},
  bigTile: {
    flex: 1,
    backgroundColor: C.purpleL,
    borderRadius: 14,
    padding: 14,
    marginRight: 8,
    minHeight: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bigTileText: {fontSize: 15, fontWeight: '800', color: C.purple, flex: 1},
  bigTileImg: {width: 72, height: 72, resizeMode: 'contain'},
  smallRow: {flexDirection: 'row', justifyContent: 'space-between'},
  smallTile: {
    width: Math.floor((width - 80) / 4),
    backgroundColor: '#fafafa',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  smallTileEmoji: {fontSize: 24, marginBottom: 4},
  smallTileLabel: {fontSize: 11, fontWeight: '600', color: C.text, textAlign: 'center'},

  // Service tiles (salon / appliance)
  srvTile: {
    width: 90,
    marginRight: 12,
    alignItems: 'center',
  },
  srvEmojiBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.purpleL,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  srvEmoji: {fontSize: 28},
  srvLabel: {fontSize: 12, fontWeight: '600', color: C.text, textAlign: 'center'},

  applianceEmojiBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff3e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  bottomSpacer: {height: 88},
  promoTextWrap: {marginLeft: 10},

  // Professional card
  proCard: {flexDirection: 'row', alignItems: 'center', backgroundColor: C.purpleL},
  proCardContent: {flex: 1},
  proTitle: {fontSize: 16, fontWeight: '800', color: C.purple, marginBottom: 6},
  proDesc: {fontSize: 13, color: '#555', lineHeight: 18, marginBottom: 10},
  proBadgeRow: {flexDirection: 'row'},
  proBadge: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: C.purple,
  },
  proBadgeText: {fontSize: 11, fontWeight: '700', color: C.purple},
  proImg: {width: 88, height: 88, resizeMode: 'contain', marginLeft: 12},

  // Sticky promo banner
  promoBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios:     {shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: {width: 0, height: -3}},
      android: {elevation: 8},
    }),
  },
  promoLeft: {flexDirection: 'row', alignItems: 'center', flex: 1},
  promoImg: {width: 44, height: 44, resizeMode: 'contain'},
  promoTitle: {color: '#fff', fontWeight: '800', fontSize: 14},
  promoTimer: {color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2},
  promoBuyBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    marginLeft: 12,
  },
  promoBuyText: {color: C.purple, fontWeight: '800', fontSize: 14},
  speakerMargin: {marginLeft: 8},
});
