import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenNameEnum from '../../routes/screenName.enum';
import SpeakerButton from '../../component/SpeakerButton';

const C = {
  purple: '#6E39F7',
  purpleL: '#f3eeff',
  grad: ['#6E39F7', '#8E57FF', '#B78CFF'] as string[],
  bg: '#f4f3fb',
  card: '#ffffff',
  text: '#1a1a2e',
  sub: '#888',
  border: '#efefef',
  green: '#13B36B',
  orange: '#F59E0B',
  red: '#EF4444',
};

const ARRIVAL_CHARGE = 49;

const DAYS = [
  {label: '📅 आज', sublabel: 'Today'},
  {label: '📅 कल', sublabel: 'Tomorrow'},
  {label: '📅 परसों', sublabel: 'Day After'},
];

const TIME_SLOTS = [
  {time: '9 बजे', available: true},
  {time: '11 बजे', available: true},
  {time: '1 बजे', available: false},
  {time: '3 बजे', available: true},
  {time: '5 बजे', available: true},
];

const URGENCY_OPTIONS = [
  {key: '10min', emoji: '🔥', title: 'अभी चाहिए', sub: '~10 मिनट में'},
  {key: '30min', emoji: '🙂', title: 'थोड़ी देर में', sub: '~30 मिनट में'},
  {key: '1hr',   emoji: '😊', title: 'आराम से', sub: '~1 घंटे में'},
];

const ADDRESSES = [
  {id: '1', type: 'home', label: '🏠 घर', address: '12, MG Road, Sector 5, Nagpur'},
  {id: '2', type: 'office', label: '💼 Office', address: 'B-204, IT Park, Hingna'},
];

type PreSelectedProvider = {
  name: string;
  initial: string;
  rating: string;
  jobs: number;
  eta: number;
  dist: number;
  phone: string;
  status: string;
};

type Props = {
  navigation: any;
  route: {
    params: {
      service: {
        label: string;
        emoji: string;
        desc: string;
        price: string;
        rating: string;
        basePrice: number;
      };
      preSelectedProvider?: PreSelectedProvider;
    };
  };
};

export default function ServiceBookingScreen({navigation, route}: Props) {
  const {service, preSelectedProvider} = route.params;
  const total = service.basePrice + ARRIVAL_CHARGE;

  const scriptHi =
    `आपने ${service.label} की service चुनी है। ` +
    `इसमें ₹${service.basePrice} service charge और ₹${ARRIVAL_CHARGE} arrival charge लगेगा, कुल ₹${total}। ` +
    `Arrival charge तभी कटेगा जब professional आपके घर पहुँचे। ` +
    `अगर उससे पहले cancel किया तो कोई charge नहीं। ` +
    `तारीख, समय और provider कब तक चाहिए वो चुनकर Book Service दबाएं।`;

  const scriptEn =
    `You have selected ${service.label}. ` +
    `The service charge is rupees ${service.basePrice} plus a rupees ${ARRIVAL_CHARGE} arrival charge, totalling rupees ${total}. ` +
    `The arrival charge is only applied when the professional reaches your home. ` +
    `No cancellation charge before arrival. ` +
    `Select your date, time and how soon you need the provider, then tap Book Service.`;

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<string>('30min');
  const [selectedAddr, setSelectedAddr] = useState('1');

  const handleBook = () => {
    if (!selectedTime) {
      Alert.alert('समय चुनें', 'कृपया सेवा का समय चुनें');
      return;
    }
    const urgencyLabel = URGENCY_OPTIONS.find(u => u.key === selectedUrgency)?.title ?? '';
    navigation.navigate(ScreenNameEnum.PaymentScreen, {
      amount: total,
      serviceCharge: service.basePrice,
      arrivalCharge: ARRIVAL_CHARGE,
      serviceName: service.label,
      scheduledTime: `${DAYS[selectedDay].sublabel}, ${selectedTime} · ${urgencyLabel}`,
      bookingId: `BK${Date.now()}`,
      preSelectedProvider,
    });
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <LinearGradient
        colors={C.grad}
        start={{x: 0.1, y: 0}}
        end={{x: 1, y: 1}}
        style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.8}>
          <Icon name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Service बुक करें</Text>
        <SpeakerButton scriptHi={scriptHi} scriptEn={scriptEn} light />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Service Card */}
        <View style={s.serviceCard}>
          <LinearGradient colors={[C.purpleL, '#e6d5ff']} style={s.emojiBox}>
            <Text style={s.emoji}>{service.emoji}</Text>
          </LinearGradient>
          <View style={s.serviceInfo}>
            <Text style={s.serviceName}>{service.label}</Text>
            <Text style={s.serviceDesc}>{service.desc}</Text>
            <View style={s.metaRow}>
              <Text style={s.rating}>⭐ {service.rating}</Text>
              <Text style={s.verified}>✓ Verified Pros</Text>
            </View>
          </View>
        </View>

        {/* Pre-selected expert banner */}
        {preSelectedProvider && (
          <View style={s.expertBanner}>
            <View style={s.expertBannerLeft}>
              <View style={s.expertAvatar}>
                <Text style={s.expertAvatarTxt}>{preSelectedProvider.initial}</Text>
              </View>
              <View style={s.expertInfo}>
                <Text style={s.expertName}>{preSelectedProvider.name}</Text>
                <Text style={s.expertMeta}>
                  ⭐ {preSelectedProvider.rating}  ·  {preSelectedProvider.jobs} jobs
                </Text>
              </View>
            </View>
            <View style={s.expertEtaBox}>
              <Text style={s.expertEtaVal}>{preSelectedProvider.eta} min</Text>
              <Text style={s.expertEtaLbl}>ETA</Text>
            </View>
          </View>
        )}

        {/* Trust badges */}
        <View style={s.trustRow}>
          <View style={s.trustPill}>
            <Icon name="shield-checkmark" size={12} color={C.green} />
            <Text style={s.trustText}>Safe & Verified</Text>
          </View>
          <View style={s.trustPill}>
            <Icon name="time" size={12} color={C.purple} />
            <Text style={s.trustText}>10 Min Response</Text>
          </View>
          <View style={s.trustPill}>
            <Icon name="star" size={12} color={C.orange} />
            <Text style={s.trustText}>Top Rated</Text>
          </View>
        </View>

        {/* Schedule Card */}
        <View style={s.scheduleCard}>
          <Text style={s.scheduleCardTitle}>🗓️ बुकिंग कब करनी है?</Text>

          {/* Date */}
          <Text style={s.rowLabel}>तारीख चुनें</Text>
          <View style={s.dayRow}>
            {DAYS.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={[s.dayBtn, selectedDay === i && s.dayBtnActive]}
                onPress={() => setSelectedDay(i)}
                activeOpacity={0.8}>
                <Text style={[s.dayBtnText, selectedDay === i && s.dayBtnTextActive]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Time */}
          <Text style={s.rowLabel}>समय चुनें</Text>
          <View style={s.timeRow}>
            {TIME_SLOTS.map((slot, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  s.timeBtn,
                  !slot.available && s.timeBtnBooked,
                  selectedTime === slot.time && s.timeBtnActive,
                ]}
                onPress={() => slot.available && setSelectedTime(slot.time)}
                activeOpacity={slot.available ? 0.8 : 1}>
                <Text style={[
                  s.timeBtnText,
                  !slot.available && s.timeBtnTextBooked,
                  selectedTime === slot.time && s.timeBtnTextActive,
                ]}>
                  {slot.time}
                </Text>
                {!slot.available && <Text style={s.bookedTag}>भरा हुआ</Text>}
              </TouchableOpacity>
            ))}
          </View>

          {/* Urgency */}
          <Text style={s.rowLabel}>कितनी जल्दी चाहिए?</Text>
          <View style={s.urgencyRow}>
            {URGENCY_OPTIONS.map(u => (
              <TouchableOpacity
                key={u.key}
                style={[s.urgencyBtn, selectedUrgency === u.key && s.urgencyBtnActive]}
                onPress={() => setSelectedUrgency(u.key)}
                activeOpacity={0.8}>
                <Text style={s.urgencyEmoji}>{u.emoji}</Text>
                <Text style={[s.urgencyTitle, selectedUrgency === u.key && s.urgencyTitleActive]}>
                  {u.title}
                </Text>
                <Text style={s.urgencySub}>{u.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Address Selection */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>📍 पता चुनें</Text>
          {ADDRESSES.map(addr => (
            <TouchableOpacity
              key={addr.id}
              style={[s.addrCard, selectedAddr === addr.id && s.addrCardActive]}
              onPress={() => setSelectedAddr(addr.id)}
              activeOpacity={0.85}>
              <View style={s.addrRadio}>
                {selectedAddr === addr.id ? (
                  <View style={s.radioFill} />
                ) : null}
              </View>
              <View style={s.addrInfo}>
                <Text style={s.addrLabel}>{addr.label}</Text>
                <Text style={s.addrText} numberOfLines={1}>{addr.address}</Text>
              </View>
              {selectedAddr === addr.id && (
                <Icon name="checkmark-circle" size={20} color={C.purple} />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={s.addAddrBtn}
            onPress={() => navigation.navigate(ScreenNameEnum.AddressesScreen)}
            activeOpacity={0.8}>
            <Icon name="add-circle-outline" size={18} color={C.purple} />
            <Text style={s.addAddrText}>नया पता जोड़ें</Text>
          </TouchableOpacity>
        </View>

        {/* Price Breakdown */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>💳 Price Details</Text>
          <View style={s.priceCard}>
            <View style={s.priceRow}>
              <Text style={s.priceLabel}>Service Charge</Text>
              <Text style={s.priceVal}>₹{service.basePrice}</Text>
            </View>
            <View style={s.priceDivider} />

            {/* Arrival Charge Info */}
            <View style={s.arrivalBox}>
              <View style={s.arrivalHeader}>
                <Icon name="location" size={16} color={C.orange} />
                <Text style={s.arrivalTitle}>Arrival Charge</Text>
                <Text style={s.arrivalAmt}>₹{ARRIVAL_CHARGE}</Text>
              </View>
              <Text style={s.arrivalNote}>
                ℹ️ Professional के आपके घर पहुँचने पर ₹{ARRIVAL_CHARGE} arrival charge लगेगा।
                अगर आप arrival के बाद cancel करते हैं तो सिर्फ ₹{ARRIVAL_CHARGE} ही कटेगा।
              </Text>
            </View>

            <View style={s.priceDivider} />
            <View style={s.priceRow}>
              <Text style={[s.priceLabel, {fontWeight: '800', color: C.text}]}>Total</Text>
              <Text style={s.totalVal}>₹{total}</Text>
            </View>
          </View>
        </View>

        {/* Cancellation Policy */}
        <View style={s.policyBox}>
          <Icon name="information-circle-outline" size={16} color={C.sub} />
          <Text style={s.policyText}>
            Free cancellation until professional starts travel. ₹{ARRIVAL_CHARGE} charge applies after arrival.
          </Text>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={s.bottomBar}>
        <View style={s.bottomPrice}>
          <Text style={s.bottomPriceLabel}>Total</Text>
          <Text style={s.bottomPriceVal}>₹{total}</Text>
        </View>
        <TouchableOpacity onPress={handleBook} activeOpacity={0.9} style={{flex: 1}}>
          <LinearGradient colors={C.grad} style={s.bookBtn}>
            <Icon name="calendar-outline" size={18} color="#fff" />
            <Text style={s.bookBtnText}>Book Service</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  headerTitle: {flex: 1, textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: '800'},

  scroll: {paddingHorizontal: 16, paddingTop: 16},

  serviceCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    marginBottom: 12,
  },
  emojiBox: {
    width: 72,
    height: 72,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {fontSize: 32},
  serviceInfo: {flex: 1},
  serviceName: {fontSize: 17, fontWeight: '800', color: C.text, marginBottom: 3},
  serviceDesc: {fontSize: 13, color: C.sub, marginBottom: 6},
  metaRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  rating: {fontSize: 12, color: C.sub, fontWeight: '600'},
  verified: {fontSize: 12, color: C.green, fontWeight: '600'},

  trustRow: {flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap'},
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    elevation: 1,
  },
  trustText: {fontSize: 11, color: C.text, fontWeight: '600'},

  section: {marginBottom: 16},
  sectionTitle: {fontSize: 15, fontWeight: '800', color: C.text, marginBottom: 10},

  scheduleCard: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
  },
  scheduleCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: C.text,
    marginBottom: 16,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.sub,
    marginBottom: 8,
    marginTop: 4,
  },

  dayRow: {flexDirection: 'row', gap: 8, marginBottom: 14},
  dayBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: C.bg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayBtnActive: {backgroundColor: C.purpleL, borderColor: C.purple},
  dayBtnText: {fontSize: 15, fontWeight: '800', color: C.text},
  dayBtnTextActive: {color: C.purple},

  timeRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14},
  timeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: C.bg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeBtnActive: {backgroundColor: C.purpleL, borderColor: C.purple},
  timeBtnBooked: {backgroundColor: '#f0f0f0'},
  timeBtnText: {fontSize: 13, fontWeight: '700', color: C.text},
  timeBtnTextActive: {color: C.purple},
  timeBtnTextBooked: {color: '#bbb'},
  bookedTag: {fontSize: 9, color: '#bbb', marginTop: 1},

  urgencyRow: {flexDirection: 'row', gap: 8},
  urgencyBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: C.bg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 2,
  },
  urgencyBtnActive: {backgroundColor: C.purpleL, borderColor: C.purple},
  urgencyEmoji: {fontSize: 22, marginBottom: 2},
  urgencyTitle: {fontSize: 12, fontWeight: '800', color: C.text, textAlign: 'center'},
  urgencyTitleActive: {color: C.purple},
  urgencySub: {fontSize: 10, color: C.sub, textAlign: 'center'},

  addrCard: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
  },
  addrCardActive: {borderColor: C.purple, backgroundColor: C.purpleL},
  addrRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: {width: 10, height: 10, borderRadius: 5, backgroundColor: C.purple},
  addrInfo: {flex: 1},
  addrLabel: {fontSize: 13, fontWeight: '700', color: C.text},
  addrText: {fontSize: 12, color: C.sub, marginTop: 2},
  addAddrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  addAddrText: {fontSize: 14, color: C.purple, fontWeight: '700'},

  priceCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  priceLabel: {fontSize: 14, color: C.sub},
  priceVal: {fontSize: 14, fontWeight: '700', color: C.text},
  priceDivider: {height: 1, backgroundColor: C.border, marginVertical: 4},

  arrivalBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: C.orange,
  },
  arrivalHeader: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6},
  arrivalTitle: {flex: 1, fontSize: 14, fontWeight: '700', color: C.text},
  arrivalAmt: {fontSize: 15, fontWeight: '900', color: C.orange},
  arrivalNote: {fontSize: 12, color: '#92400E', lineHeight: 17},

  totalVal: {fontSize: 18, fontWeight: '900', color: C.purple},

  policyBox: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  policyText: {flex: 1, fontSize: 12, color: C.sub, lineHeight: 17},

  // Pre-selected expert banner
  expertBanner: {
    backgroundColor: C.purpleL,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: C.purple + '44',
  },
  expertBannerLeft: {flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1},
  expertAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expertAvatarTxt: {fontSize: 18, fontWeight: '900', color: '#fff'},
  expertInfo: {flex: 1},
  expertName: {fontSize: 14, fontWeight: '800', color: C.purple},
  expertMeta: {fontSize: 12, color: C.sub, marginTop: 1},
  expertEtaBox: {alignItems: 'center', paddingLeft: 12},
  expertEtaVal: {fontSize: 18, fontWeight: '900', color: C.purple},
  expertEtaLbl: {fontSize: 10, color: C.sub, fontWeight: '600'},

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    gap: 12,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: -4},
  },
  bottomPrice: {alignItems: 'flex-start'},
  bottomPriceLabel: {fontSize: 11, color: C.sub},
  bottomPriceVal: {fontSize: 20, fontWeight: '900', color: C.text},
  bookBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bookBtnText: {color: '#fff', fontWeight: '900', fontSize: 15},
});
