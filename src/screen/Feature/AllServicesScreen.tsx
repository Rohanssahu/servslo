import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenNameEnum from '../../routes/screenName.enum';

const {width} = Dimensions.get('window');
const CARD_W = (width - 48) / 2;

const CATEGORIES = [
  {key: 'all', label: 'सभी'},
  {key: 'quick', label: 'Quick Services'},
  {key: 'cleaning', label: 'Cleaning'},
  {key: 'salon', label: 'Salon'},
  {key: 'appliance', label: 'Appliance'},
  {key: 'other', label: 'Other'},
];

const ALL_SERVICES = [
  {key: 'quick', label: 'Electrician', emoji: '⚡', desc: 'Wiring & repairs', price: '₹199+', rating: '4.8', basePrice: 199},
  {key: 'quick', label: 'Plumber', emoji: '🔧', desc: 'Leaks, pipes, taps', price: '₹149+', rating: '4.7', basePrice: 149},
  {key: 'quick', label: 'AC Repair', emoji: '❄️', desc: 'Service & repair', price: '₹349+', rating: '4.8', basePrice: 349},
  {key: 'quick', label: 'Carpenter', emoji: '🪚', desc: 'Furniture, doors', price: '₹249+', rating: '4.6', basePrice: 249},
  {key: 'quick', label: 'Painting', emoji: '🖌️', desc: 'Interior & exterior', price: '₹499+', rating: '4.7', basePrice: 499},
  {key: 'quick', label: 'Pest Control', emoji: '🐛', desc: 'All pest types', price: '₹599+', rating: '4.8', basePrice: 599},
  {key: 'quick', label: 'TV Mounting', emoji: '📺', desc: 'Wall mount setup', price: '₹199+', rating: '4.8', basePrice: 199},
  {key: 'quick', label: 'Gas Stove', emoji: '🔥', desc: 'Repair & clean', price: '₹149+', rating: '4.5', basePrice: 149},
  {key: 'cleaning', label: 'Home Cleaning', emoji: '🧹', desc: 'Full home clean', price: '₹299+', rating: '4.9', basePrice: 299},
  {key: 'cleaning', label: 'Bathroom Clean', emoji: '🚿', desc: 'Deep scrub', price: '₹519+', rating: '4.8', basePrice: 519},
  {key: 'cleaning', label: 'Kitchen Clean', emoji: '🍳', desc: 'Chimney & tiles', price: '₹449+', rating: '4.7', basePrice: 449},
  {key: 'cleaning', label: 'Sofa Clean', emoji: '🛋️', desc: 'Dry & wet clean', price: '₹399+', rating: '4.6', basePrice: 399},
  {key: 'cleaning', label: 'Laundry', emoji: '👕', desc: 'Wash & fold', price: '₹99+', rating: '4.5', basePrice: 99},
  {key: 'cleaning', label: 'Dishwashing', emoji: '🍽️', desc: 'Vessel cleaning', price: '₹149+', rating: '4.5', basePrice: 149},
  {key: 'cleaning', label: 'Washing Machine', emoji: '🫧', desc: 'Deep clean', price: '₹160+', rating: '4.8', basePrice: 160},
  {key: 'cleaning', label: 'Car Wash', emoji: '🚗', desc: 'Full detailing', price: '₹299+', rating: '4.6', basePrice: 299},
  {key: 'salon', label: 'Waxing', emoji: '✨', desc: 'Full body wax', price: '₹299+', rating: '4.7', basePrice: 299},
  {key: 'salon', label: 'Facial', emoji: '💆', desc: 'Glowing skin', price: '₹399+', rating: '4.8', basePrice: 399},
  {key: 'salon', label: 'Manicure', emoji: '💅', desc: 'Hand & nail care', price: '₹249+', rating: '4.6', basePrice: 249},
  {key: 'salon', label: 'Pedicure', emoji: '🦶', desc: 'Foot care', price: '₹299+', rating: '4.7', basePrice: 299},
  {key: 'salon', label: 'Haircut', emoji: '✂️', desc: 'Trim & style', price: '₹199+', rating: '4.7', basePrice: 199},
  {key: 'salon', label: 'Makeup', emoji: '💄', desc: 'Party & bridal', price: '₹999+', rating: '4.9', basePrice: 999},
  {key: 'appliance', label: 'AC Service', emoji: '❄️', desc: 'Clean & service', price: '₹349+', rating: '4.8', basePrice: 349},
  {key: 'appliance', label: 'Washing Machine', emoji: '🫧', desc: 'Repair & service', price: '₹299+', rating: '4.7', basePrice: 299},
  {key: 'appliance', label: 'Water Purifier', emoji: '💧', desc: 'Install & repair', price: '₹249+', rating: '4.7', basePrice: 249},
  {key: 'appliance', label: 'Fridge Repair', emoji: '🧊', desc: 'All fridge types', price: '₹449+', rating: '4.6', basePrice: 449},
  {key: 'appliance', label: 'TV Repair', emoji: '📺', desc: 'Screen & parts', price: '₹499+', rating: '4.6', basePrice: 499},
  {key: 'appliance', label: 'Microwave', emoji: '📡', desc: 'Repair & clean', price: '₹249+', rating: '4.5', basePrice: 249},
  {key: 'other', label: 'Yoga / Fitness', emoji: '🧘', desc: 'At-home trainer', price: '₹499+', rating: '4.8', basePrice: 499},
  {key: 'other', label: 'Tutoring', emoji: '📚', desc: 'Home tutor', price: '₹299+', rating: '4.9', basePrice: 299},
];

type ServiceItem = {
  key: string;
  label: string;
  emoji: string;
  desc: string;
  price: string;
  rating: string;
  basePrice: number;
};

type Props = {
  navigation: any;
  route: {params?: {category?: string; title?: string}};
};

export default function AllServicesScreen({navigation, route}: Props) {
  const initialCat = route.params?.category ?? 'all';
  const headerTitle = route.params?.title ?? 'All Services';
  const [activeTab, setActiveTab] = useState(initialCat);

  const filtered =
    activeTab === 'all'
      ? ALL_SERVICES
      : ALL_SERVICES.filter(item => item.key === activeTab);

  const needFiller = filtered.length % 2 !== 0;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Header */}
      <LinearGradient
        colors={['#6E39F7', '#8E57FF', '#B78CFF']}
        start={{x: 0.1, y: 0}}
        end={{x: 1, y: 1}}
        style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          activeOpacity={0.8}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{headerTitle}</Text>
        <View style={s.headerSpacer} />
      </LinearGradient>

      {/* Category filter tabs */}
      <View style={s.tabWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabList}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[s.tab, activeTab === cat.key && s.tabActive]}
              onPress={() => setActiveTab(cat.key)}
              activeOpacity={0.8}>
              <Text
                style={[s.tabText, activeTab === cat.key && s.tabTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Count */}
      <Text style={s.countText}>{filtered.length} services</Text>

      {/* 2-column grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.grid}>
        <View style={s.gridRow}>
          {filtered.map((item, i) => (
            <TouchableOpacity key={i} style={s.card} activeOpacity={0.85}>
              <LinearGradient
                colors={['#f3eeff', '#e6d5ff']}
                style={s.emojiBox}>
                <Text style={s.emoji}>{item.emoji}</Text>
              </LinearGradient>
              <Text style={s.cardLabel} numberOfLines={1}>
                {item.label}
              </Text>
              <Text style={s.cardDesc} numberOfLines={1}>
                {item.desc}
              </Text>
              <View style={s.metaRow}>
                <Text style={s.rating}>⭐ {item.rating}</Text>
                <Text style={s.price}>{item.price}</Text>
              </View>
              <TouchableOpacity
                style={s.bookBtn}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate(ScreenNameEnum.ServiceBookingScreen, {service: item})
                }>
                <Text style={s.bookBtnText}>Book Now</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          {needFiller && <View style={s.fillerCard} />}
        </View>
        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const C = {
  purple: '#4d2b98',
  purpleL: '#f3eeff',
  bg: '#f4f3fb',
  card: '#ffffff',
  text: '#1a1a2e',
  sub: '#888888',
  border: '#efefef',
  green: '#21865b',
};

const s = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},

  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 12 : 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {color: '#fff', fontSize: 20, fontWeight: '700'},
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  headerSpacer: {width: 38},

  // Tabs
  tabWrap: {
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tabList: {paddingHorizontal: 12, paddingVertical: 10, gap: 8},
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.purpleL,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: C.purple,
    borderColor: C.purple,
  },
  tabText: {fontSize: 13, fontWeight: '600', color: C.purple},
  tabTextActive: {color: '#fff'},

  countText: {
    fontSize: 12,
    color: C.sub,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '500',
  },

  // Grid
  grid: {paddingHorizontal: 16, paddingTop: 8},
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_W,
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: {width: 0, height: 3}},
      android: {elevation: 3},
    }),
  },
  fillerCard: {width: CARD_W, backgroundColor: 'transparent'},
  emojiBox: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emoji: {fontSize: 36},
  cardLabel: {fontSize: 14, fontWeight: '800', color: C.text, marginBottom: 2},
  cardDesc: {fontSize: 11, color: C.sub, marginBottom: 8},
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {fontSize: 11, color: C.sub, fontWeight: '600'},
  price: {fontSize: 13, fontWeight: '800', color: C.purple},
  bookBtn: {
    backgroundColor: C.purple,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  bookBtnText: {color: '#fff', fontWeight: '700', fontSize: 12},
});
