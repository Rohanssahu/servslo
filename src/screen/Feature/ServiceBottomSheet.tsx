import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import ScreenNameEnum from '../../routes/screenName.enum';

export type DailyServiceKey =
  | 'safai'
  | 'bartan'
  | 'kapde'
  | 'bathroom'
  | 'kitchen'
  | 'khana';

type ServiceData = {
  emoji: string;
  title: string;
  titleHi: string;
  price: string;
  duration: string;
  includes: string[];
  excludes: string[];
  needs: {icon: string; label: string}[];
  tip: string;
};

const SERVICES: Record<DailyServiceKey, ServiceData> = {
  safai: {
    emoji: '🧹',
    title: 'Daily Safai',
    titleHi: 'रोज़ की सफाई',
    price: '₹199',
    duration: '1–1.5 hrs',
    includes: [
      'Sweep all rooms (jhadu)',
      'Mop all floors (pocha)',
      'Wipe surfaces, tables & fans',
      'Empty dustbins',
      'Arrange scattered items',
    ],
    excludes: [
      'Deep wall / ceiling cleaning',
      'Window glass / grill cleaning',
      'Washing utensils (bartan)',
    ],
    needs: [
      {icon: 'sparkles-outline', label: 'Broom & mop'},
      {icon: 'water-outline', label: 'Clean water'},
      {icon: 'bag-handle-outline', label: 'Dustbin bags'},
    ],
    tip: 'Best for working families — schedule every morning for a fresh home every day!',
  },
  bartan: {
    emoji: '🍽️',
    title: 'Bartan Dhona',
    titleHi: 'बर्तन धोना',
    price: '₹149',
    duration: '30–60 min',
    includes: [
      'All kitchen utensils (handi, kadhai)',
      'Plates, glasses & cups',
      'Pots, pans & pressure cooker',
      'Wipe sink & counter clean',
    ],
    excludes: [
      'Oven interior cleaning',
      'Heavily burnt vessels (extra charge)',
      'Microwave inside cleaning',
    ],
    needs: [
      {icon: 'water-outline', label: 'Dish soap'},
      {icon: 'brush-outline', label: 'Scrubber'},
      {icon: 'water-outline', label: 'Running water'},
    ],
    tip: 'Book daily & save 15%! Perfect for busy weekday mornings.',
  },
  kapde: {
    emoji: '👕',
    title: 'Kapde Dhona',
    titleHi: 'कपड़े धोना',
    price: '₹199',
    duration: '1–2 hrs',
    includes: [
      'Sort & load washing machine',
      'Full wash cycle with your detergent',
      'Hang clothes to dry',
      'Fold dry / washed clothes',
    ],
    excludes: [
      'Silk / embroidery / zari fabric (hand-wash risk)',
      'Bio-hazard stained clothes',
      'Ironing (₹49 add-on, ask expert)',
    ],
    needs: [
      {icon: 'shirt-outline', label: 'Detergent'},
      {icon: 'settings-outline', label: 'Washing machine'},
      {icon: 'water-outline', label: 'Drying rack'},
    ],
    tip: 'Add ironing for just ₹49 extra — just tell the expert on arrival!',
  },
  bathroom: {
    emoji: '🚿',
    title: 'Bathroom Clean',
    titleHi: 'बाथरूम सफाई',
    price: '₹249',
    duration: '45–60 min',
    includes: [
      'Scrub & disinfect toilet seat & bowl',
      'Clean floor tiles & walls (basic)',
      'Wash basin & mirror shine',
      'Clean shower, taps & fittings',
      'Replace toilet roll (if provided)',
    ],
    excludes: [
      'Deep tile acid descaling (add-on ₹99)',
      'Plumbing repairs or leaks',
      'Exhaust fan deep clean',
    ],
    needs: [
      {icon: 'flask-outline', label: 'Toilet cleaner'},
      {icon: 'brush-outline', label: 'Toilet brush'},
      {icon: 'water-outline', label: 'Bucket & mug'},
    ],
    tip: 'Weekly bathroom clean strongly recommended for a hygienic home!',
  },
  kitchen: {
    emoji: '🍳',
    title: 'Kitchen Clean',
    titleHi: 'किचन सफाई',
    price: '₹299',
    duration: '1–1.5 hrs',
    includes: [
      'Stove, hob & burner cleaning',
      'Counter tops & slab degreasing',
      'Wipe cabinet exteriors & knobs',
      'Sink, tap & drain cleaning',
      'Kitchen floor mopping',
    ],
    excludes: [
      'Inside cabinet / drawer cleaning',
      'Chimney deep clean (add-on ₹249)',
      'Fridge / oven interior',
    ],
    needs: [
      {icon: 'flask-outline', label: 'Kitchen cleaner'},
      {icon: 'brush-outline', label: 'Scrubber / sponge'},
      {icon: 'water-outline', label: 'Water bucket'},
    ],
    tip: 'After a big festive cook? Book kitchen clean in 2 taps and relax!',
  },
  khana: {
    emoji: '👨‍🍳',
    title: 'Khana Banana',
    titleHi: 'खाना बनाना',
    price: '₹349',
    duration: '1–2 hrs',
    includes: [
      'Breakfast, lunch, OR dinner',
      'Cook using your kitchen & ingredients',
      'Clean used cookware after cooking',
      'Simple home-style Indian meals',
      'Portions for 2–4 people',
    ],
    excludes: [
      'Restaurant / exotic / party recipes',
      'Groceries (not provided by expert)',
      'Catering events or large gatherings',
    ],
    needs: [
      {icon: 'basket-outline', label: 'Groceries'},
      {icon: 'flame-outline', label: 'Gas / induction'},
      {icon: 'options-outline', label: 'Cookware'},
    ],
    tip: "Perfect for working professionals & students — hot fresh meal waiting when you're back!",
  },
};

const TABS: {key: DailyServiceKey; emoji: string; label: string}[] = [
  {key: 'safai', emoji: '🧹', label: 'Safai'},
  {key: 'bartan', emoji: '🍽️', label: 'Bartan'},
  {key: 'kapde', emoji: '👕', label: 'Kapde'},
  {key: 'bathroom', emoji: '🚿', label: 'Bathroom'},
  {key: 'kitchen', emoji: '🍳', label: 'Kitchen'},
  {key: 'khana', emoji: '👨‍🍳', label: 'Khana'},
];

export type ServiceBottomSheetRef = {
  open: (service?: DailyServiceKey) => void;
  close: () => void;
};

interface Props {
  onClose?: () => void;
}

const C = {
  purple: '#6E39F7',
  purpleL: '#f3eeff',
  text: '#1a1a2e',
  sub: '#888',
  green: '#13B36B',
  red: '#EF4444',
  border: '#efefef',
  bg: '#f7f7fb',
  orange: '#F59E0B',
};

const ServiceBottomSheet = forwardRef<ServiceBottomSheetRef, Props>(
  ({onClose}, ref) => {
    const sheetRef = useRef<BottomSheet>(null);
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<DailyServiceKey>('safai');

    useImperativeHandle(ref, () => ({
      open: (service?: DailyServiceKey) => {
        if (service) setActiveTab(service);
        sheetRef.current?.snapToIndex(0);
      },
      close: () => sheetRef.current?.close(),
    }));

    const svc = SERVICES[activeTab];

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={['78%']}
        enablePanDownToClose
        enableOverDrag={false}
        backgroundStyle={s.sheetBg}
        handleIndicatorStyle={s.handle}
        onClose={onClose}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
            opacity={0.5}
          />
        )}>
        <View style={{flex: 1}}>
          {/* Tab bar */}
          <BottomSheetView style={s.tabRow}>
            {TABS.map(tab => {
              const active = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[s.tab, active && s.tabActive]}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.8}>
                  <Text style={s.tabEmoji}>{tab.emoji}</Text>
                  <Text style={[s.tabLabel, active && s.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </BottomSheetView>

          {/* Scrollable content */}
          <BottomSheetScrollView
            contentContainerStyle={s.content}
            showsVerticalScrollIndicator={false}>
            {/* Service header */}
            <View style={s.svcHeader}>
              <Text style={s.svcEmoji}>{svc.emoji}</Text>
              <View style={{flex: 1}}>
                <Text style={s.svcTitle}>{svc.title}</Text>
                <Text style={s.svcTitleHi}>{svc.titleHi}</Text>
              </View>
              <View style={s.svcMeta}>
                <Text style={s.svcPrice}>{svc.price}</Text>
                <Text style={s.svcDuration}>{svc.duration}</Text>
              </View>
            </View>

            {/* Includes */}
            <View style={s.section}>
              <Text style={s.secTitle}>✅ What's included</Text>
              {svc.includes.map((item, i) => (
                <View key={i} style={s.bulletRow}>
                  <Ionicons name="checkmark-circle" size={16} color={C.green} />
                  <Text style={s.bulletText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Excludes */}
            <View style={s.section}>
              <Text style={s.secTitle}>❌ Not included</Text>
              {svc.excludes.map((item, i) => (
                <View key={i} style={s.bulletRow}>
                  <Ionicons name="close-circle" size={16} color={C.red} />
                  <Text style={s.bulletText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* What you need */}
            <View style={s.section}>
              <Text style={s.secTitle}>🛠 What we need from you</Text>
              <View style={s.reqRow}>
                {svc.needs.map((need, i) => (
                  <View key={i} style={s.reqCard}>
                    <Ionicons name={need.icon as any} size={22} color={C.purple} />
                    <Text style={s.reqLabel}>{need.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Tip */}
            <View style={s.tipBanner}>
              <Text style={s.tipText}>💡 {svc.tip}</Text>
            </View>

            <View style={{height: 96}} />
          </BottomSheetScrollView>

          {/* Bottom CTA */}
          <View style={s.cta}>
            <View>
              <Text style={s.ctaLabel}>Starting from</Text>
              <Text style={s.ctaPrice}>{svc.price}</Text>
            </View>
            <TouchableOpacity
              style={s.scheduleBtn}
              onPress={() => {
                sheetRef.current?.close();
                navigation.navigate(ScreenNameEnum.RecurringBookingScreen, {
                  serviceName: svc.title,
                  serviceEmoji: svc.emoji,
                  servicePrice: parseInt(svc.price.replace('₹', ''), 10),
                });
              }}
              activeOpacity={0.9}>
              <Text style={s.scheduleBtnText}>🗓 Recurring</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.bookBtn}
              onPress={() => {
                sheetRef.current?.close();
                navigation.navigate(ScreenNameEnum.ReviewBookingScreen);
              }}
              activeOpacity={0.9}>
              <LinearGradient
                colors={[C.purple, '#9B59D9']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={s.bookBtnGradient}>
                <Text style={s.bookBtnText}>Book Now →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    );
  },
);

export default ServiceBottomSheet;

const s = StyleSheet.create({
  sheetBg: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fff',
  },
  handle: {backgroundColor: '#D8D8D8', width: 40},

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 6,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: C.bg,
  },
  tabActive: {backgroundColor: C.purpleL},
  tabEmoji: {fontSize: 14},
  tabLabel: {fontSize: 12, fontWeight: '600', color: C.sub},
  tabLabelActive: {color: C.purple, fontWeight: '800'},

  content: {paddingHorizontal: 16, paddingTop: 14},

  svcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.purpleL,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  svcEmoji: {fontSize: 38},
  svcTitle: {fontSize: 16, fontWeight: '800', color: C.text},
  svcTitleHi: {fontSize: 12, color: C.sub, marginTop: 2},
  svcMeta: {alignItems: 'flex-end'},
  svcPrice: {fontSize: 20, fontWeight: '900', color: C.purple},
  svcDuration: {fontSize: 11, color: C.sub, marginTop: 2},

  section: {
    backgroundColor: '#fafafa',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  secTitle: {fontSize: 14, fontWeight: '800', color: C.text, marginBottom: 10},
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 7,
  },
  bulletText: {flex: 1, fontSize: 13, color: '#333', lineHeight: 18},

  reqRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4},
  reqCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    minWidth: 76,
    borderWidth: 1,
    borderColor: C.border,
  },
  reqLabel: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    color: C.text,
    fontWeight: '600',
  },

  tipBanner: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  tipText: {fontSize: 13, color: '#92400e', lineHeight: 18},

  cta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  ctaLabel: {fontSize: 11, color: C.sub},
  ctaPrice: {fontSize: 20, fontWeight: '900', color: C.text},
  scheduleBtn: {
    borderWidth: 2,
    borderColor: C.purple,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  scheduleBtnText: {color: C.purple, fontWeight: '800', fontSize: 13},
  bookBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  bookBtnGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 14,
  },
  bookBtnText: {color: '#fff', fontWeight: '900', fontSize: 15},
});
