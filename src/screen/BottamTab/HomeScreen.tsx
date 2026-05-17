import React, {useCallback, useEffect, useRef, useState} from 'react';
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
  Keyboard,
  TextInput,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenNameEnum from '../../routes/screenName.enum';
import LinearGradient from 'react-native-linear-gradient';
import ServiceBottomSheet, {
  ServiceBottomSheetRef,
} from '../Feature/ServiceBottomSheet';
import {useIsFocused} from '@react-navigation/native';
import SpeakerButton from '../../component/SpeakerButton';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';
import Voice from '@react-native-voice/voice';
import SmartSearchBar from '../../component/SmartSearchBar';
import {
  search,
  POPULAR_SEARCHES,
  getRecentSearches,
  addRecentSearch,
  ServiceResult,
} from '../../utils/searchEngine';
import WalkthroughOverlay, {
  SpotlightRect,
  WalkthroughStepConfig,
} from '../../component/WalkthroughOverlay';
import {
  FlashDealStrip,
  RotatingCampaignBanner,
  CouponStrip,
  ContextualPromo,
  ScrollPromoToast,
} from '../../component/CampaignSystem';

const {width} = Dimensions.get('window');
const BOOKED_W = 158;

const DEALS = [
  {time: '60 min', price: '₹149', old: '₹169', off: '11% OFF', label: 'Basic Clean'},
  {time: '90 min', price: '₹219', old: '₹255', off: '14% OFF', label: 'Deep Clean'},
  {time: '120 min', price: '₹289', old: '₹320', off: '10% OFF', label: 'Full Home'},
];

const MOST_BOOKED = [
  {title: 'Bathroom Deep Clean', rating: '4.8', reviews: '2.8M', price: '₹519', emoji: '🚿'},
  {title: '2 Bathroom Cleaning', rating: '4.8', reviews: '2.8M', price: '₹950', oldPrice: '₹1,038', off: '8% OFF', emoji: '🏠'},
  {title: 'Washing Machine Clean', rating: '4.8', reviews: '319K', price: '₹160', emoji: '🫧'},
];

const HOME_SCRIPT_HI =
  'नमस्ते! ServSLO में आपका स्वागत है। यहाँ घर बैठे electrician, plumber, cleaning और 50 से ज़्यादा services बुक करें। हमारे verified expert सिर्फ 10 मिनट में आपके घर पहुँचेंगे। आज कौन सी service चाहिए?';
const HOME_SCRIPT_EN =
  'Welcome to ServSLO! Book electricians, plumbers, cleaning and 50-plus home services right from home. Our verified experts arrive in just 10 minutes. What service do you need today?';

const VOICE_HINTS = [
  '"fan repair chahiye"',
  '"bathroom cleaning karani hai"',
  '"AC cooling nahi kar raha"',
  '"plumber chahiye"',
];

// ─── Walkthrough step definitions ────────────────────────────────────────────
const WALKTHROUGH_STEPS: WalkthroughStepConfig[] = [
  {
    emoji: '📍',
    title: 'Your Delivery Address',
    titleHi: 'आपका पता',
    description:
      'This shows your location. Tap anytime to update it — your expert will come exactly here!',
    descriptionHi:
      'यह आपकी location दिखाता है। कभी भी tap करके बदलें — expert यहीं आएगा!',
    tooltipBelow: true,
  },
  {
    emoji: '🔍',
    title: 'Smart Search + Voice',
    titleHi: 'स्मार्ट सर्च + आवाज़',
    description:
      'Type any service, or tap 🎙️ and speak in Hindi or English. Try: "fan repair" or "bathroom safai"!',
    descriptionHi:
      'जो चाहिए टाइप करें, या 🎙️ दबाकर बोलें। जैसे: "bijli" या "bathroom safai"!',
    tooltipBelow: true,
  },
  {
    emoji: '🟢',
    title: 'Live Experts Nearby',
    titleHi: 'पास के Live Expert',
    description:
      'See real-time experts near you right now! Most arrive in just 10 minutes.',
    descriptionHi:
      'अभी आपके पास कौन available है देखें! ज़्यादातर expert 10 मिनट में पहुँचते हैं।',
    tooltipBelow: true,
  },
  {
    emoji: '⚡',
    title: 'Quick Book Any Service',
    titleHi: 'तुरंत कोई भी सेवा बुक करें',
    description:
      'Tap any icon to book instantly — electrician, plumber, cleaning & 50+ more. Done in seconds!',
    descriptionHi:
      'किसी भी icon को tap करें — electrician, plumber, safai और 50+ सेवाएं। बस seconds में!',
    tooltipBelow: false,
  },
  {
    emoji: '💰',
    title: 'Best Deals & Packages',
    titleHi: 'बेस्ट डील और पैकेज',
    description:
      'Pick a package with price & time shown upfront, then tap Book Now. Zero hidden charges!',
    descriptionHi:
      'Price और time देखें, package चुनें, Book Now दबाएं। कोई छिपे हुए charges नहीं!',
    tooltipBelow: false,
  },
];

export default function HomeScreen({navigation}: {navigation: any}) {
  const sheetRef = useRef<ServiceBottomSheetRef>(null);
  const searchInputRef = useRef<TextInput>(null);
  const isFocus = useIsFocused();
  const {lang} = useLanguage();
  const t = languageStrings[lang];
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ── Walkthrough refs ──────────────────────────────────────────────────────
  const addressRef = useRef<View>(null);
  const searchAreaRef = useRef<View>(null);
  const liveCardRef = useRef<View>(null);
  const quickServicesRef = useRef<View>(null);
  const dealSectionRef = useRef<View>(null);
  const mainScrollRef = useRef<ScrollView>(null);

  // ── Walkthrough state ─────────────────────────────────────────────────────
  const [walkthroughVisible, setWalkthroughVisible] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(
    null,
  );

  // ── Walkthrough logic ─────────────────────────────────────────────────────
  // Keep a ref to the latest measureStep so callbacks never use a stale copy
  const measureStepRef = useRef<(stepIndex: number) => void>(() => {});

  // Inline function — re-created each render so refs are always fresh
  const measureStep = (stepIndex: number) => {
    // Scroll amounts that bring each element near the top of the ScrollView
    // (animated: false → instant, so we measure on the next frame, not after a timer)
    const scrollTargets: Record<number, number> = {2: 0, 3: 240, 4: 500};
    const stepRefs = [
      addressRef,
      searchAreaRef,
      liveCardRef,
      quickServicesRef,
      dealSectionRef,
    ];

    const ref = stepRefs[stepIndex];
    if (!ref) {
      return;
    }

    const scrollY = scrollTargets[stepIndex];
    if (scrollY !== undefined && mainScrollRef.current) {
      // Instant scroll — no animation so the position is settled on the next frame
      mainScrollRef.current.scrollTo({y: scrollY, animated: false});
    }

    // Two requestAnimationFrame calls ensure the layout pass has completed
    const tryMeasure = (attempt: number) => {
      ref.current?.measureInWindow((mx, my, mw, mh) => {
        if (mw > 0 && mh > 0) {
          setSpotlightRect({
            x: mx,
            y: my,
            width: mw,
            height: mh,
            borderRadius: 18,
          });
        } else if (attempt < 6) {
          setTimeout(() => tryMeasure(attempt + 1), 200);
        }
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tryMeasure(0);
      });
    });
  };

  // Always keep the ref in sync with the latest closure
  measureStepRef.current = measureStep;

  const handleWalkthroughNext = useCallback(() => {
    const next = walkthroughStep + 1;
    if (next >= WALKTHROUGH_STEPS.length) {
      setWalkthroughVisible(false);
      AsyncStorage.setItem('wtSeen_v1', '1');
      mainScrollRef.current?.scrollTo({y: 0, animated: true});
    } else {
      setSpotlightRect(null);
      setWalkthroughStep(next);
      // Let the null-spotlight render first, then measure the next element
      setTimeout(() => measureStepRef.current(next), 80);
    }
  }, [walkthroughStep]);

  const handleWalkthroughSkip = useCallback(() => {
    setWalkthroughVisible(false);
    AsyncStorage.setItem('wtSeen_v1', '1');
    mainScrollRef.current?.scrollTo({y: 0, animated: true});
  }, []);

  // Show walkthrough on first open
  useEffect(() => {
    AsyncStorage.getItem('wtSeen_v1').then(val => {
      if (!val) {
        setTimeout(() => {
          setWalkthroughVisible(true);
          setWalkthroughStep(0);
          setSpotlightRect(null);
          // Two frames after state update to let the UI settle before measuring
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              measureStepRef.current(0);
            });
          });
        }, 900);
      }
    });
  }, []);

  // ── Search state ─────────────────────────────────────────────────────────
  const [searchText, setSearchText] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchResults, setSearchResults] = useState<ServiceResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debounceRef = useRef<any>(null);

  const searchMode = searchFocused;
  const hasResults = searchText.trim().length >= 2;

  // ── Live availability data ────────────────────────────────────────────────
  const LIVE_PROVIDERS = [
    {
      emoji: '⚡',
      label: lang === 'hi' ? 'Electrician' : 'Electricians',
      count: 3,
      bg: '#FFF3E0',
      tc: '#E65100',
    },
    {
      emoji: '🔧',
      label: lang === 'hi' ? 'Plumber' : 'Plumbers',
      count: 5,
      bg: '#E3F2FD',
      tc: '#1565C0',
    },
    {
      emoji: '🧹',
      label: lang === 'hi' ? 'Cleaner' : 'Cleaners',
      count: 8,
      bg: '#E8F5E9',
      tc: '#2E7D32',
    },
    {
      emoji: '❄️',
      label: lang === 'hi' ? 'AC Expert' : 'AC Experts',
      count: 2,
      bg: '#E1F5FE',
      tc: '#0277BD',
    },
  ];

  // ── Translated data arrays ────────────────────────────────────────────────
  const QUICK_SERVICES = [
    {label: t.electrician, emoji: '⚡', desc: t.wiringRepairs, rating: '4.8', basePrice: 199},
    {label: t.plumber, emoji: '🔧', desc: t.leaksPipesTaps, rating: '4.7', basePrice: 149},
    {label: t.cleaning, emoji: '🧹', desc: t.fullHomeClean, rating: '4.9', basePrice: 299},
    {label: t.acRepair, emoji: '❄️', desc: t.serviceRepair, rating: '4.8', basePrice: 349},
    {label: t.carpenter, emoji: '🪚', desc: t.furnitureDoors, rating: '4.6', basePrice: 249},
    {label: t.painting, emoji: '🖌️', desc: t.interiorExterior, rating: '4.7', basePrice: 499},
    {label: t.pestControl, emoji: '🐛', desc: t.allPestTypes, rating: '4.8', basePrice: 599},
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

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.35,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  // ── Voice setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    Voice.onSpeechResults = (e: any) => {
      const spoken: string = e.value?.[0] ?? '';
      setIsListening(false);
      if (spoken) {
        setSearchText(spoken);
        setSearchResults(search(spoken));
        setSearchFocused(true);
      }
    };
    Voice.onSpeechError = () => setIsListening(false);
    Voice.onSpeechEnd = () => setIsListening(false);
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      setSearchText('');
      setSearchResults([]);
      setSearchFocused(true);
      Keyboard.dismiss();
      await Voice.start(lang === 'hi' ? 'hi-IN' : 'en-IN');
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch {}
    setIsListening(false);
  };

  // ── Search text change ────────────────────────────────────────────────────
  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (text.trim().length >= 2) {
        setSearchResults(search(text));
      } else {
        setSearchResults([]);
      }
    }, 180);
  }, []);

  const handleSearchFocus = () => {
    setSearchFocused(true);
    getRecentSearches().then(setRecentSearches);
  };

  const handleSearchCancel = () => {
    setSearchFocused(false);
    setSearchText('');
    setSearchResults([]);
    Keyboard.dismiss();
    if (isListening) stopListening();
  };

  const handlePopularTap = (q: string) => {
    setSearchText(q);
    setSearchResults(search(q));
    searchInputRef.current?.focus();
  };

  const handleServiceSelect = async (svc: ServiceResult) => {
    await addRecentSearch(searchText || svc.label);
    handleSearchCancel();
    navigation.navigate(ScreenNameEnum.ServiceBookingScreen, {service: svc});
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#6E39F7', '#8E57FF', '#B78CFF']}
        start={{x: 0.1, y: 0}}
        end={{x: 1, y: 1}}
        style={s.header}>
        <View ref={addressRef} collapsable={false}>
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
        </View>
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

      {/* ── Smart Search Bar (outside ScrollView, always visible) ─────── */}
      <View style={s.searchArea} ref={searchAreaRef} collapsable={false}>
        <SmartSearchBar
          inputRef={searchInputRef}
          value={searchText}
          onChangeText={handleSearchChange}
          onFocus={handleSearchFocus}
          isListening={isListening}
          onMicPress={isListening ? stopListening : startListening}
          lang={lang}
          isFocused={searchFocused}
          style={s.searchBarStyle}
        />
        {searchFocused && (
          <TouchableOpacity onPress={handleSearchCancel} style={s.cancelBtn} activeOpacity={0.7}>
            <Text style={s.cancelText}>
              {lang === 'hi' ? 'रद्द' : 'Cancel'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Conditional: Search Mode OR Normal Home Content ───────────── */}
      {searchMode && !walkthroughVisible ? (
        /* ── SEARCH MODE ─────────────────────────────────────────────── */
        <ScrollView
          style={s.searchScroll}
          contentContainerStyle={s.searchScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {!hasResults ? (
            /* Empty query — show hints & popular */
            <>
              {/* Voice hint banner */}
              <View style={s.voiceBanner}>
                <Text style={s.voiceBannerIcon}>🎙️</Text>
                <View style={{flex: 1}}>
                  <Text style={s.voiceBannerTitle}>
                    {lang === 'hi' ? 'माइक टैप करें और बोलें' : 'Tap mic and speak naturally'}
                  </Text>
                  <Text style={s.voiceBannerSub}>
                    {VOICE_HINTS.join('  ·  ')}
                  </Text>
                </View>
              </View>

              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <View style={s.searchSection}>
                  <Text style={s.searchSectionTitle}>
                    {lang === 'hi' ? 'हाल की खोज' : 'Recent Searches'}
                  </Text>
                  <View style={s.chipRow}>
                    {recentSearches.map((r, i) => (
                      <TouchableOpacity
                        key={i}
                        style={s.chip}
                        onPress={() => handlePopularTap(r)}
                        activeOpacity={0.75}>
                        <Text style={s.chipEmoji}>🕐</Text>
                        <Text style={s.chipText}>{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Popular searches */}
              <View style={s.searchSection}>
                <Text style={s.searchSectionTitle}>
                  {lang === 'hi' ? 'लोकप्रिय खोज' : 'Popular Searches'}
                </Text>
                <View style={s.chipRow}>
                  {POPULAR_SEARCHES.map((p, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[s.chip, s.chipPopular]}
                      onPress={() => handlePopularTap(p)}
                      activeOpacity={0.75}>
                      <Text style={s.chipEmoji}>🔥</Text>
                      <Text style={s.chipText}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Quick category shortcuts */}
              <View style={s.searchSection}>
                <Text style={s.searchSectionTitle}>
                  {lang === 'hi' ? 'श्रेणी के अनुसार ब्राउज़ करें' : 'Browse by Category'}
                </Text>
                <View style={s.catRow}>
                  {[
                    {emoji: '⚡', label: lang === 'hi' ? 'बिजली' : 'Electrical'},
                    {emoji: '🔧', label: lang === 'hi' ? 'प्लंबर' : 'Plumbing'},
                    {emoji: '🧹', label: lang === 'hi' ? 'सफाई' : 'Cleaning'},
                    {emoji: '❄️', label: lang === 'hi' ? 'AC' : 'AC'},
                    {emoji: '💆', label: lang === 'hi' ? 'सैलून' : 'Salon'},
                    {emoji: '🛠️', label: lang === 'hi' ? 'उपकरण' : 'Appliance'},
                  ].map((cat, i) => (
                    <TouchableOpacity
                      key={i}
                      style={s.catTile}
                      onPress={() =>
                        navigation.navigate(ScreenNameEnum.AllServicesScreen, {
                          category: ['quick', 'quick', 'cleaning', 'quick', 'salon', 'appliance'][i],
                          title: cat.label,
                        })
                      }
                      activeOpacity={0.75}>
                      <Text style={s.catEmoji}>{cat.emoji}</Text>
                      <Text style={s.catLabel}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : searchResults.length > 0 ? (
            /* Results list */
            <>
              <Text style={s.resultsHeader}>
                {lang === 'hi'
                  ? `"${searchText}" के लिए ${searchResults.length} सेवाएं मिलीं`
                  : `${searchResults.length} services found for "${searchText}"`}
              </Text>
              {searchResults.map((svc, i) => (
                <TouchableOpacity
                  key={i}
                  style={s.resultRow}
                  onPress={() => handleServiceSelect(svc)}
                  activeOpacity={0.78}>
                  <LinearGradient
                    colors={['#f3eeff', '#e6d5ff']}
                    style={s.resultEmojiBox}>
                    <Text style={s.resultEmoji}>{svc.emoji}</Text>
                  </LinearGradient>
                  <View style={s.resultInfo}>
                    <Text style={s.resultLabel}>{svc.label}</Text>
                    <Text style={s.resultDesc}>{svc.desc}</Text>
                    <Text style={s.resultRating}>⭐ {svc.rating}</Text>
                  </View>
                  <View style={s.resultRight}>
                    <Text style={s.resultPrice}>{svc.price}</Text>
                    <View style={s.resultBookBtn}>
                      <Text style={s.resultBookText}>
                        {lang === 'hi' ? 'बुक' : 'Book'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={s.seeAllBtn}
                onPress={() => {
                  handleSearchCancel();
                  navigation.navigate(ScreenNameEnum.AllServicesScreen, {
                    category: 'all',
                    title: lang === 'hi' ? 'सभी सेवाएं' : 'All Services',
                  });
                }}
                activeOpacity={0.7}>
                <Text style={s.seeAllText}>
                  {lang === 'hi' ? 'सभी सेवाएं देखें →' : 'See all services →'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            /* No results */
            <View style={s.noResults}>
              <Text style={s.noResultsEmoji}>🔍</Text>
              <Text style={s.noResultsTitle}>
                {lang === 'hi'
                  ? `"${searchText}" के लिए कोई सेवा नहीं`
                  : `No results for "${searchText}"`}
              </Text>
              <Text style={s.noResultsSub}>
                {lang === 'hi'
                  ? 'अलग शब्द आज़माएं, जैसे "fan", "bijli", "nal"'
                  : 'Try different words like "fan", "nal", "cleaning"'}
              </Text>
              <TouchableOpacity
                style={s.browsAllBtn}
                onPress={() => {
                  handleSearchCancel();
                  navigation.navigate(ScreenNameEnum.AllServicesScreen, {category: 'all', title: 'All Services'});
                }}>
                <Text style={s.browsAllText}>
                  {lang === 'hi' ? 'सभी सेवाएं देखें' : 'Browse all services'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      ) : (
        /* ── NORMAL HOME CONTENT ──────────────────────────────────────── */
        <ScrollView
          ref={mainScrollRef}
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Trust Strip */}
          <View style={s.trustStrip}>
            {TRUST_ITEMS.map((item, i) => (
              <View key={i} style={s.trustItem}>
                <Text style={s.trustEmoji}>{item.icon}</Text>
                <Text style={s.trustText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Flash Deal Strip */}
          <FlashDealStrip lang={lang} />
 
          {/* Live Availability Card */}
          <View style={s.liveCard} ref={liveCardRef} collapsable={false}>
            <View style={s.liveHeader}>
              <Animated.View
                style={[s.liveDot, {transform: [{scale: pulseAnim}]}]}
              />
              <Text style={s.liveHeaderTitle}>
                {lang === 'hi' ? 'अभी आपके पास' : 'Available Now Nearby'}
              </Text>
              <View style={s.liveResponsePill}>
                <Text style={s.liveResponseTxt}>⚡ 10-min</Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.liveScroll}>
              {LIVE_PROVIDERS.map((prov, i) => (
                <TouchableOpacity
                  key={i}
                  style={[s.liveChip, {backgroundColor: prov.bg}]}
                  onPress={() =>
                    navigation.navigate(ScreenNameEnum.NearbyProvidersScreen, {
                      category: prov.label,
                      title: `${prov.count} ${prov.label} Nearby`,
                    })
                  }
                  activeOpacity={0.82}>
                  <Text style={s.liveChipEmoji}>{prov.emoji}</Text>
                  <View>
                    <Text style={[s.liveChipCount, {color: prov.tc}]}>
                      {prov.count}
                    </Text>
                    <Text style={[s.liveChipLabel, {color: prov.tc}]}>
                      {prov.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={s.urgentChip}
                onPress={() =>
                  navigation.navigate(ScreenNameEnum.NearbyProvidersScreen, {
                    category: 'all',
                    title: 'Urgent Service',
                  })
                }
                activeOpacity={0.8}>
                <Text style={s.urgentEmoji}>🚨</Text>
                <Text style={s.urgentLabel}>
                  {lang === 'hi' ? 'जरूरी\nसेवा' : 'Urgent\nService'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* What do you need? */}
          <View style={s.card} ref={quickServicesRef} collapsable={false}>
            <View style={s.cardTitleRow}>
              <Text style={s.cardTitle}>{t.whatDoYouNeed}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate(ScreenNameEnum.AllServicesScreen, {
                    category: 'all',
                    title: 'All Services',
                  })
                }>
                <Text style={s.seeAll}>{t.seeAll}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.storyList}>
              {QUICK_SERVICES.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={s.storyItem}
                  onPress={() => {
                    if (item.basePrice === 0) {
                      navigation.navigate(ScreenNameEnum.AllServicesScreen, {
                        category: 'all',
                        title: 'All Services',
                      });
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
                  <Text style={s.storyLabel} numberOfLines={2}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

         {/* Rotating Campaign Banner (auto-cycles IPL → Monsoon → First-time) */}
          <RotatingCampaignBanner
            lang={lang}
            onPress={() => sheetRef.current?.open()}
          />

          {/* Quick Cleaning Packages */}
          <View style={s.card} ref={dealSectionRef} collapsable={false}>
            <View style={s.cardTitleRow}>
              <Text style={s.cardTitle}>{t.quickCleaning}</Text>
              <View style={s.livePill}>
                <Text style={s.livePillText}>{t.livePill}</Text>
              </View>
            </View>
            <Text style={s.cardSub}>{t.arrivesIn10Min}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hPad}>
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
                  <TouchableOpacity
                    style={s.bookBtnFill}
                    onPress={() => sheetRef.current?.open()}
                    activeOpacity={0.8}>
                    <Text style={s.bookBtnFillText}>{t.bookNow}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Coupon Strip */}
          <CouponStrip lang={lang} />

          {/* Most Booked */}
          <View style={s.card}>
            <View style={s.cardTitleRow}>
              <Text style={s.cardTitle}>{t.mostBooked}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate(ScreenNameEnum.AllServicesScreen, {
                    category: 'cleaning',
                    title: 'Most Booked',
                  })
                }>
                <Text style={s.seeAll}>{t.seeAll}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hPad}>
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
                  <Text style={s.bookedTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={s.bookedRating}>
                    ⭐ {item.rating} ({item.reviews})
                  </Text>
                  <View style={s.bookedFooter}>
                    <View>
                      <Text style={s.bookedPrice}>{item.price}</Text>
                      {item.oldPrice && (
                        <Text style={s.bookedOldPrice}>{item.oldPrice}</Text>
                      )}
                    </View>
                    <View style={s.addBtn}>
                      <Text style={s.addBtnText}>+</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Contextual Promo (rotates through AC / Cleaning / Electrician) */}
          <ContextualPromo
            lang={lang}
            onPress={() => sheetRef.current?.open()}
          />

          {/* Our Services */}
          <View style={s.card}>
            <Text style={s.cardTitle}>{t.ourServices}</Text>
            <Text style={s.cardSub}>{t.multipleServices}</Text>
            <View style={s.bigRow}>
              <TouchableOpacity style={s.bigTile} activeOpacity={0.8}>
                <Text style={s.bigTileText}>{t.everydayCleaning}</Text>
                <Image
                  source={require('../../assets/images/mop.png')}
                  style={s.bigTileImg}
                />
              </TouchableOpacity>
              <TouchableOpacity style={s.bigTile} activeOpacity={0.8}>
                <Text style={s.bigTileText}>{t.weeklyCleaning}</Text>
                <Image
                  source={require('../../assets/images/cleaning.jpg')}
                  style={s.bigTileImg}
                />
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hPad}>
              {SALON_ITEMS.map((srv, i) => (
                <TouchableOpacity
                  key={i}
                  style={s.srvTile}
                  onPress={() => sheetRef.current?.open()}
                  activeOpacity={0.8}>
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hPad}>
              {APPLIANCE_ITEMS.map((srv, i) => (
                <TouchableOpacity
                  key={i}
                  style={s.srvTile}
                  onPress={() => sheetRef.current?.open()}
                  activeOpacity={0.8}>
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
            <Image
              source={require('../../assets/images/glove.jpg')}
              style={s.proImg}
            />
          </View>

          <View style={s.bottomSpacer} />
        </ScrollView>
      )}

      <ScrollPromoToast lang={lang} />

      <ServiceBottomSheet
        ref={sheetRef}
        onClose={() => console.log('Sheet closed')}
      />

      <WalkthroughOverlay
        visible={walkthroughVisible}
        spotlightRect={spotlightRect}
        step={WALKTHROUGH_STEPS[walkthroughStep] ?? null}
        stepIndex={walkthroughStep}
        totalSteps={WALKTHROUGH_STEPS.length}
        onNext={handleWalkthroughNext}
        onFinish={handleWalkthroughSkip}
        onSkip={handleWalkthroughSkip}
        lang={lang}
      />
    </SafeAreaView>
  );
}

// ─── Color tokens ─────────────────────────────────────────────────────────────
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
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressBlock: {flex: 1},
  addressLabel: {color: '#fff', fontSize: 20, fontWeight: '500', marginBottom: 2},
  addressRow: {flexDirection: 'row', alignItems: 'center', marginLeft: -5},
  addressPin: {color: 'rgba(255,255,255,0.85)', fontSize: 13},
  addressText: {color: '#fff', fontWeight: '700', fontSize: 14, flex: 1},
  headerRight: {flexDirection: 'row', alignItems: 'center'},
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
  speakerMargin: {marginLeft: 8},

  // Search area (between header and scroll)
  searchArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    paddingVertical: 10,
    backgroundColor: C.bg,
  },
  searchBarStyle: {
    flex: 1,
    marginLeft: 16,
    marginTop: 0,
    marginBottom: 0,
  },
  cancelBtn: {
    marginLeft: 10,
    paddingVertical: 6,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.purple,
  },

  // Scroll
  scroll: {paddingBottom: 96, paddingTop: 4},

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
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 3},
      },
      android: {elevation: 3},
    }),
  },
  cardTitle: {fontSize: 18, fontWeight: '800', color: C.purple, marginBottom: 4},
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardSub: {fontSize: 13, color: C.sub, marginBottom: 14},
  seeAll: {fontSize: 13, fontWeight: '700', color: C.purple},
  livePill: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  livePillText: {fontSize: 11, fontWeight: '800', color: '#f97316'},

  // Story-style horizontal scroll
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
  bookedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
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

  // Service tiles
  srvTile: {width: 90, marginRight: 12, alignItems: 'center'},
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

  // Professionals card
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

  bottomSpacer: {height: 88},

  // ── Search mode styles ───────────────────────────────────────────────────
  searchScroll: {flex: 1},
  searchScrollContent: {paddingBottom: 60},

  voiceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ede7ff',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#d4bbff',
  },
  voiceBannerIcon: {fontSize: 26, marginRight: 12},
  voiceBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.purple,
    marginBottom: 4,
  },
  voiceBannerSub: {
    fontSize: 11,
    color: '#7c5cbf',
    lineHeight: 16,
  },

  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: C.sub,
    letterSpacing: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.purpleL,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipPopular: {
    backgroundColor: '#fff3e0',
  },
  chipEmoji: {fontSize: 13, marginRight: 5},
  chipText: {fontSize: 13, fontWeight: '600', color: C.purple},

  catRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catTile: {
    width: (width - 64) / 3,
    backgroundColor: C.card,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: {width: 0, height: 2},
      },
      android: {elevation: 2},
    }),
  },
  catEmoji: {fontSize: 26, marginBottom: 6},
  catLabel: {fontSize: 12, fontWeight: '700', color: C.text, textAlign: 'center'},

  resultsHeader: {
    fontSize: 13,
    color: C.sub,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: {width: 0, height: 2},
      },
      android: {elevation: 2},
    }),
  },
  resultEmojiBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultEmoji: {fontSize: 28},
  resultInfo: {flex: 1, marginLeft: 12},
  resultLabel: {fontSize: 15, fontWeight: '800', color: C.text},
  resultDesc: {fontSize: 12, color: C.sub, marginTop: 2},
  resultRating: {fontSize: 11, color: C.sub, marginTop: 4},
  resultRight: {alignItems: 'flex-end', marginLeft: 8},
  resultPrice: {fontSize: 14, fontWeight: '800', color: C.purple, marginBottom: 6},
  resultBookBtn: {
    backgroundColor: C.purple,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  resultBookText: {fontSize: 12, fontWeight: '700', color: '#fff'},

  seeAllBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: C.card,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.purple,
  },
  seeAllText: {fontSize: 14, fontWeight: '700', color: C.purple},

  noResults: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  noResultsEmoji: {fontSize: 48, marginBottom: 12},
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSub: {
    fontSize: 13,
    color: C.sub,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browsAllBtn: {
    backgroundColor: C.purple,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  browsAllText: {color: '#fff', fontWeight: '700', fontSize: 14},

  // Live availability card
  liveCard: {
    backgroundColor: C.card,
    borderRadius: 18,
    paddingTop: 14,
    paddingBottom: 12,
    marginHorizontal: 16,
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 3},
      },
      android: {elevation: 3},
    }),
  },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#13B36B',
  },
  liveHeaderTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: C.text,
  },
  liveResponsePill: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  liveResponseTxt: {fontSize: 11, fontWeight: '800', color: '#f97316'},
  liveScroll: {paddingHorizontal: 16, gap: 10},
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    minWidth: 110,
  },
  liveChipEmoji: {fontSize: 20},
  liveChipCount: {fontSize: 18, fontWeight: '900', lineHeight: 20},
  liveChipLabel: {fontSize: 11, fontWeight: '600', lineHeight: 14},
  urgentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    minWidth: 100,
  },
  urgentEmoji: {fontSize: 20},
  urgentLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
    lineHeight: 15,
  },
});
