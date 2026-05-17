import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_W = width - 48;

export type Campaign = {
  id: string;
  emoji: string;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  discount: string;
  daysLeft: number;
  grad: string[];
};

const CAMPAIGNS: Campaign[] = [
  {
    id: 'period',
    emoji: '🌸',
    tag: 'Period Care',
    tagColor: '#e91e8c',
    title: 'Period Care Pack',
    subtitle: 'Safai + Khana + Comfort Bundle',
    discount: '50% OFF',
    daysLeft: 3,
    grad: ['#fff0f7', '#ffd6ee'],
  },
  {
    id: 'deepclean',
    emoji: '🏠',
    tag: 'Limited Offer',
    tagColor: '#6E39F7',
    title: 'Home Deep Clean',
    subtitle: 'Full home + bathroom + kitchen',
    discount: '30% OFF',
    daysLeft: 7,
    grad: ['#f3eeff', '#e6d5ff'],
  },
  {
    id: 'elderly',
    emoji: '👴',
    tag: 'Family Care',
    tagColor: '#13B36B',
    title: 'Elderly Care Support',
    subtitle: 'Daily help + medicine reminders',
    discount: '₹199/day',
    daysLeft: 0,
    grad: ['#e8fbf0', '#d0f5e3'],
  },
  {
    id: 'student',
    emoji: '🎓',
    tag: 'Student Pack',
    tagColor: '#F59E0B',
    title: 'Student Combo',
    subtitle: 'Bartan + Kapde + Weekly safai',
    discount: '₹399/wk',
    daysLeft: 5,
    grad: ['#fffbeb', '#fef3c7'],
  },
];

type Props = {
  onPress: (campaignId: string) => void;
};

export default function WomenCampaignBanner({ onPress }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoScroll = () => {
    autoScrollRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % CAMPAIGNS.length;
        scrollRef.current?.scrollTo({ x: next * (CARD_W + 12), animated: true });
        return next;
      });
    }, 3500);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_W + 12));
    setActiveIndex(index);
    stopAutoScroll();
    startAutoScroll();
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_W + 12}
        decelerationRate="fast"
        contentContainerStyle={s.scrollContent}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}>
        {CAMPAIGNS.map(camp => (
          <LinearGradient
            key={camp.id}
            colors={camp.grad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.card}>
            {/* Tag chip */}
            <View
              style={[
                s.tagChip,
                {
                  backgroundColor: camp.tagColor + '22',
                  borderColor: camp.tagColor + '55',
                },
              ]}>
              <Text style={[s.tagText, { color: camp.tagColor }]}>
                {camp.tag}
              </Text>
            </View>

            {/* Countdown badge */}
            {camp.daysLeft > 0 && (
              <View style={s.countdownBadge}>
                <Text style={s.countdownText}>⏰ {camp.daysLeft}d left</Text>
              </View>
            )}

            {/* Body row */}
            <View style={s.bodyRow}>
              <Text style={s.emoji}>{camp.emoji}</Text>
              <View style={s.textBlock}>
                <Text style={s.title}>{camp.title}</Text>
                <Text style={s.subtitle}>{camp.subtitle}</Text>
                <View style={s.bottomRow}>
                  <View style={s.discountBadge}>
                    <Text style={s.discountText}>{camp.discount}</Text>
                  </View>
                  <TouchableOpacity
                    style={s.bookBtn}
                    onPress={() => onPress(camp.id)}
                    activeOpacity={0.85}>
                    <Text style={s.bookBtnText}>Book Now →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Dot indicators */}
      <View style={s.dots}>
        {CAMPAIGNS.map((_, i) => (
          <View
            key={i}
            style={[s.dot, i === activeIndex && s.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingRight: 12,
  },
  card: {
    width: CARD_W,
    borderRadius: 18,
    padding: 16,
    marginRight: 12,
    elevation: 3,
  },
  tagChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  countdownBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  countdownText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  emoji: {
    fontSize: 44,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1a1a2e',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
    lineHeight: 17,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountBadge: {
    backgroundColor: '#6E39F7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#fff',
  },
  bookBtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  bookBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6E39F7',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d0bbff',
  },
  dotActive: {
    backgroundColor: '#6E39F7',
    width: 18,
  },
});
