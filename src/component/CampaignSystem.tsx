import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

// ── Design tokens (matches HomeScreen palette) ────────────────────────────────
const C = {
  purple: '#4d2b98',
  purpleL: '#f3eeff',
  text: '#1a1a2e',
  sub: '#888888',
  border: '#efefef',
  card: '#ffffff',
  green: '#21865b',
  greenBg: '#e8fbf0',
};

// ── Campaign data ─────────────────────────────────────────────────────────────

const FLASH_DEALS = [
  {
    id: 'fd1',
    emoji: '🎉',
    hot: true,
    label: 'First Service FREE',
    labelHi: 'पहली सेवा FREE',
    badge: 'FIRST100',
    urgency: null as string | null,
  },
  {
    id: 'fd2',
    emoji: '⚡',
    hot: true,
    label: '50% off AC Service',
    labelHi: 'AC सेवा 50% छूट',
    badge: '50% OFF',
    urgency: '3h left',
  },
  {
    id: 'fd3',
    emoji: '🏏',
    hot: false,
    label: 'IPL Special ₹80 off',
    labelHi: 'IPL स्पेशल ₹80 छूट',
    badge: '₹80 OFF',
    urgency: '4h left',
  },
  {
    id: 'fd4',
    emoji: '🌧️',
    hot: false,
    label: 'Monsoon Electrician',
    labelHi: 'मानसून इलेक्ट्रीशियन',
    badge: '30% OFF',
    urgency: null,
  },
  {
    id: 'fd5',
    emoji: '🧹',
    hot: false,
    label: 'Deep Clean Bundle',
    labelHi: 'डीप क्लीन बंडल',
    badge: '₹100 OFF',
    urgency: null,
  },
];

interface CampaignConfig {
  emoji: string;
  title: string;
  titleHi: string;
  sub: string;
  subHi: string;
  cta: string;
  ctaHi: string;
  badge: string;
  badgeHi: string;
  gradient: string[];
  accent: string;
  accentText: string;
  isLive: boolean;
}

const CAMPAIGN_CONFIGS: Record<string, CampaignConfig> = {
  ipl: {
    emoji: '🏏',
    title: 'IPL Match Tonight?',
    titleHi: 'आज रात IPL मैच है?',
    sub: 'Get your home match-ready! Book cleaning & get ₹80 off with code IPL80',
    subHi: 'घर को मैच-रेडी बनाएं! सफाई बुक करें, ₹80 छूट पाएं — कोड IPL80',
    cta: 'Book Now  ·  IPL80',
    ctaHi: 'अभी बुक करें  ·  IPL80',
    badge: '🔴 LIVE  ·  Match in 4h',
    badgeHi: '🔴 LIVE  ·  4 घंटे में मैच',
    gradient: ['#0f0c29', '#302b63', '#1a0533'],
    accent: '#E94560',
    accentText: '#fff',
    isLive: true,
  },
  monsoon: {
    emoji: '⚡',
    title: 'Monsoon Safety Check',
    titleHi: 'मानसून सेफ्टी चेक',
    sub: 'Rain + faulty wiring = danger! Book a free electrician safety inspection today',
    subHi: 'बारिश + खराब वायरिंग = खतरा! आज ही Free इलेक्ट्रीशियन चेक बुक करें',
    cta: 'Book Free Inspection',
    ctaHi: 'Free इंस्पेक्शन बुक करें',
    badge: '☔ Monsoon Special',
    badgeHi: '☔ मानसून स्पेशल',
    gradient: ['#023e8a', '#0077b6', '#0096c7'],
    accent: '#90e0ef',
    accentText: '#023e8a',
    isLive: false,
  },
  firsttime: {
    emoji: '🎁',
    title: 'New Here? ₹100 Off!',
    titleHi: 'पहली बार? ₹100 की छूट!',
    sub: 'Flat ₹100 off your first booking. No minimum order required. Use code NEW100',
    subHi: 'पहली बुकिंग पर flat ₹100 छूट। कोई minimum नहीं। कोड: NEW100',
    cta: 'Claim Offer  ·  NEW100',
    ctaHi: 'ऑफर क्लेम करें  ·  NEW100',
    badge: '✨ New User Offer',
    badgeHi: '✨ नए यूजर ऑफर',
    gradient: ['#3b0764', '#6d28d9', '#7c3aed'],
    accent: '#f0abfc',
    accentText: '#3b0764',
    isLive: false,
  },
};

interface CouponData {
  code: string;
  desc: string;
  descHi: string;
  saving: string;
  min: string;
  expiry: string;
}

const COUPONS: CouponData[] = [
  {
    code: 'CLEAN50',
    desc: '₹50 off on cleaning above ₹299',
    descHi: '₹299 से ऊपर सफाई पर ₹50 छूट',
    saving: '₹50',
    min: '₹299',
    expiry: 'Today only',
  },
  {
    code: 'IPL80',
    desc: '₹80 off any service tonight',
    descHi: 'आज रात किसी भी सेवा पर ₹80 छूट',
    saving: '₹80',
    min: '₹200',
    expiry: '8h left',
  },
];

// ── FlashDealStrip ────────────────────────────────────────────────────────────
export function FlashDealStrip({lang}: {lang: string}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pulseAnim]);

  return (
    <View style={fs.wrap}>
      <View style={fs.header}>
        <Animated.Text style={[fs.bolt, {opacity: pulseAnim}]}>⚡</Animated.Text>
        <Text style={fs.headerLabel}>
          {lang === 'hi' ? 'आज के ऑफर' : "Today's Deals"}
        </Text>
        <View style={fs.liveDot}>
          <Text style={fs.liveDotText}>LIVE</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={fs.scroll}>
        {FLASH_DEALS.map(deal => (
          <TouchableOpacity
            key={deal.id}
            style={[fs.chip, deal.hot && fs.chipHot]}
            activeOpacity={0.8}>
            <Text style={fs.chipEmoji}>{deal.emoji}</Text>
            <Text
              style={[fs.chipLabel, deal.hot && fs.chipLabelHot]}
              numberOfLines={1}>
              {lang === 'hi' ? deal.labelHi : deal.label}
            </Text>
            <View style={[fs.chipBadge, deal.hot && fs.chipBadgeHot]}>
              <Text style={[fs.chipBadgeText, deal.hot && fs.chipBadgeTextHot]}>
                {deal.badge}
              </Text>
            </View>
            {deal.urgency ? (
              <View style={fs.urgency}>
                <Text style={fs.urgencyText}>⏱ {deal.urgency}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ── CampaignCard ──────────────────────────────────────────────────────────────
export function CampaignCard({
  type,
  lang,
  onPress,
}: {
  type: keyof typeof CAMPAIGN_CONFIGS;
  lang: string;
  onPress?: () => void;
}) {
  const cfg = CAMPAIGN_CONFIGS[type];
  const slideAnim = useRef(new Animated.Value(18)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const badgePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    if (!cfg.isLive) {
      return;
    }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, {
          toValue: 1.06,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(badgePulse, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [badgePulse, cfg.isLive]);

  return (
    <Animated.View
      style={[
        cc.wrapper,
        {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
      ]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <LinearGradient
          colors={cfg.gradient}
          style={cc.card}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <Animated.View
            style={[cc.badge, {transform: [{scale: badgePulse}]}]}>
            <Text style={cc.badgeText}>
              {lang === 'hi' ? cfg.badgeHi : cfg.badge}
            </Text>
          </Animated.View>

          <View style={cc.body}>
            <Text style={cc.bigEmoji}>{cfg.emoji}</Text>
            <View style={cc.textBlock}>
              <Text style={cc.title}>
                {lang === 'hi' ? cfg.titleHi : cfg.title}
              </Text>
              <Text style={cc.sub} numberOfLines={2}>
                {lang === 'hi' ? cfg.subHi : cfg.sub}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[cc.ctaBtn, {backgroundColor: cfg.accent}]}
            activeOpacity={0.85}
            onPress={onPress}>
            <Text style={[cc.ctaText, {color: cfg.accentText}]}>
              {lang === 'hi' ? cfg.ctaHi : cfg.cta}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── CouponCard (isolated animation per card) ──────────────────────────────────
function CouponCard({coupon, lang}: {coupon: CouponData; lang: string}) {
  const [copied, setCopied] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleTap = () => {
    if (copied) {
      return;
    }
    setCopied(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.94,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 280,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <Animated.View style={[cs.card, {transform: [{scale: scaleAnim}]}]}>
      <View style={cs.cardLeft}>
        <View style={cs.savingTag}>
          <Text style={cs.savingText}>Save {coupon.saving}</Text>
        </View>
        <Text style={cs.desc} numberOfLines={2}>
          {lang === 'hi' ? coupon.descHi : coupon.desc}
        </Text>
        <Text style={cs.minText}>Min: {coupon.min}</Text>
      </View>

      <View style={cs.divider} />

      <View style={cs.cardRight}>
        <TouchableOpacity onPress={handleTap} activeOpacity={0.75}>
          <View style={[cs.codeBox, copied && cs.codeBoxCopied]}>
            <Text style={[cs.codeText, copied && cs.codeTextCopied]}>
              {coupon.code}
            </Text>
          </View>
          <Text style={cs.tapLabel}>
            {copied
              ? lang === 'hi'
                ? '✓ कॉपी हो गया!'
                : '✓ Copied!'
              : lang === 'hi'
              ? 'टैप करें'
              : 'Tap to copy'}
          </Text>
        </TouchableOpacity>
        <View style={cs.expiryPill}>
          <Text style={cs.expiryText}>{coupon.expiry}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ── CouponStrip ───────────────────────────────────────────────────────────────
export function CouponStrip({lang}: {lang: string}) {
  return (
    <View style={cs.wrap}>
      <View style={cs.headerRow}>
        <Text style={cs.headerIcon}>🎟️</Text>
        <Text style={cs.headerTitle}>
          {lang === 'hi' ? 'आपके कूपन' : 'Your Coupons'}
        </Text>
        <View style={cs.activePill}>
          <Text style={cs.activePillText}>{COUPONS.length} active</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={cs.scroll}>
        {COUPONS.map(c => (
          <CouponCard key={c.code} coupon={c} lang={lang} />
        ))}
      </ScrollView>
    </View>
  );
}

// ── ContextualPromo ───────────────────────────────────────────────────────────
export function ContextualPromo({
  lang,
  onPress,
}: {
  lang: string;
  onPress?: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        cp.wrapper,
        {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
      ]}>
      <TouchableOpacity activeOpacity={0.88} onPress={onPress}>
        <LinearGradient
          colors={['#fffbeb', '#fef3c7', '#fde68a']}
          style={cp.card}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0.6}}>
          <View style={cp.left}>
            <View style={cp.aiTag}>
              <Text style={cp.aiTagText}>
                {lang === 'hi' ? '🤖 आपके लिए' : '🤖 Picked for you'}
              </Text>
            </View>
            <Text style={cp.title}>
              {lang === 'hi' ? 'AC सर्विस पैक' : 'AC Service Pack'}
            </Text>
            <Text style={cp.sub} numberOfLines={2}>
              {lang === 'hi'
                ? 'गर्मी के सीजन का बेस्ट प्राइस — अभी बुक करें'
                : 'Best price of summer season — limited time'}
            </Text>
            <View style={cp.priceRow}>
              <Text style={cp.price}>₹349</Text>
              <Text style={cp.oldPrice}>₹499</Text>
              <View style={cp.offTag}>
                <Text style={cp.offTagText}>30% OFF</Text>
              </View>
            </View>
          </View>

          <View style={cp.right}>
            <Text style={cp.bigEmoji}>❄️</Text>
            <TouchableOpacity
              style={cp.bookBtn}
              onPress={onPress}
              activeOpacity={0.8}>
              <Text style={cp.bookBtnText}>
                {lang === 'hi' ? 'बुक करें' : 'Book'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 3},
  },
  android: {elevation: 3},
});

// FlashDealStrip
const fs = StyleSheet.create({
  wrap: {
    backgroundColor: C.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingTop: 11,
    paddingBottom: 11,
    ...shadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 9,
    gap: 5,
  },
  bolt: {fontSize: 14},
  headerLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    color: C.text,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  liveDot: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveDotText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#ef4444',
    letterSpacing: 0.5,
  },
  scroll: {paddingHorizontal: 13, gap: 8},
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.purpleL,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#ddd4f8',
  },
  chipHot: {backgroundColor: '#fff7ed', borderColor: '#fed7aa'},
  chipEmoji: {fontSize: 14},
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.text,
    maxWidth: 108,
  },
  chipLabelHot: {color: '#9a3412'},
  chipBadge: {
    backgroundColor: C.greenBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  chipBadgeHot: {backgroundColor: '#fee2e2'},
  chipBadgeText: {fontSize: 10, fontWeight: '800', color: C.green},
  chipBadgeTextHot: {color: '#dc2626'},
  urgency: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  urgencyText: {fontSize: 9, fontWeight: '700', color: '#ef4444'},
});

// CampaignCard
const cc = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 14,
        shadowOffset: {width: 0, height: 5},
      },
      android: {elevation: 6},
    }),
  },
  card: {
    borderRadius: 20,
    padding: 18,
    minHeight: 148,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 4,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  badgeText: {fontSize: 11, fontWeight: '800', color: '#fff'},
  body: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    gap: 13,
  },
  bigEmoji: {fontSize: 38, lineHeight: 42},
  textBlock: {flex: 1},
  title: {
    fontSize: 19,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 5,
    lineHeight: 23,
  },
  sub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 18,
  },
  ctaBtn: {
    borderRadius: 13,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {fontSize: 14, fontWeight: '800'},
});

// CouponStrip
const cs = StyleSheet.create({
  wrap: {
    backgroundColor: C.card,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingTop: 12,
    paddingBottom: 12,
    ...shadow,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
    gap: 6,
  },
  headerIcon: {fontSize: 16},
  headerTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: C.text,
  },
  activePill: {
    backgroundColor: C.greenBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  activePillText: {fontSize: 10, fontWeight: '800', color: C.green},
  scroll: {paddingHorizontal: 14, gap: 10},
  card: {
    width: 225,
    backgroundColor: '#fafafa',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardLeft: {flex: 1, padding: 12},
  savingTag: {
    backgroundColor: C.greenBg,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 7,
  },
  savingText: {fontSize: 11, fontWeight: '800', color: C.green},
  desc: {
    fontSize: 12,
    color: C.text,
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 5,
  },
  minText: {fontSize: 10, color: C.sub},
  divider: {
    width: 1,
    backgroundColor: '#e0d4f8',
    marginVertical: 8,
  },
  cardRight: {
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 6,
  },
  codeBox: {
    borderWidth: 1.5,
    borderColor: C.purple,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
    marginBottom: 4,
    borderStyle: 'dashed',
  },
  codeBoxCopied: {
    backgroundColor: C.greenBg,
    borderColor: C.green,
    borderStyle: 'solid',
  },
  codeText: {
    fontSize: 12,
    fontWeight: '900',
    color: C.purple,
    letterSpacing: 0.4,
  },
  codeTextCopied: {color: C.green},
  tapLabel: {fontSize: 9, color: C.sub, textAlign: 'center'},
  expiryPill: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  expiryText: {fontSize: 9, fontWeight: '700', color: '#f97316'},
});

// ContextualPromo
const cp = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    overflow: 'hidden',
    ...shadow,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    minHeight: 108,
  },
  left: {flex: 1},
  aiTag: {
    backgroundColor: 'rgba(0,0,0,0.07)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 7,
  },
  aiTagText: {fontSize: 11, fontWeight: '700', color: '#78350f'},
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 3,
  },
  sub: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 17,
    marginBottom: 9,
  },
  priceRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  price: {fontSize: 17, fontWeight: '900', color: '#1a1a2e'},
  oldPrice: {
    fontSize: 13,
    color: '#aaa',
    textDecorationLine: 'line-through',
  },
  offTag: {
    backgroundColor: C.greenBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  offTagText: {fontSize: 10, fontWeight: '800', color: C.green},
  right: {alignItems: 'center', gap: 10, marginLeft: 14},
  bigEmoji: {fontSize: 38},
  bookBtn: {
    backgroundColor: C.purple,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bookBtnText: {fontSize: 12, fontWeight: '800', color: '#fff'},
});
