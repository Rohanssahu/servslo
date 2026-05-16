import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {hp} from '../../component/utils/Constant';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';

const {width} = Dimensions.get('window');

const C = {
  purple: '#4d2b98',
  purpleL: '#f3eeff',
  purpleMid: '#7B52C8',
  bg: '#F4F3FB',
  card: '#ffffff',
  text: '#1a1a2e',
  sub: '#888888',
  border: '#efefef',
  green: '#21865b',
  greenBg: '#e8fbf0',
};

const STEP_COLORS = [
  {color: '#E8F4FD', iconColor: '#2196F3', emoji: '📲'},
  {color: '#FFF3E0', iconColor: '#FF9800', emoji: '📍'},
  {color: '#E8F5E9', iconColor: '#4CAF50', emoji: '🔍'},
  {color: '#F3E5F5', iconColor: '#9C27B0', emoji: '📅'},
  {color: '#E1F5FE', iconColor: '#03A9F4', emoji: '💳'},
  {color: '#FFFDE7', iconColor: '#FFC107', emoji: '⭐'},
];

export default function HowToUseScreen() {
  const navigation = useNavigation<any>();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const {lang} = useLanguage();
  const t = languageStrings[lang];

  const steps = [
    {id: 1, title: t.step1Title, description: t.step1Desc, tip: t.step1Tip, videoUrl: 'https://www.youtube.com/watch?v=VIDEO1', ...STEP_COLORS[0]},
    {id: 2, title: t.step2Title, description: t.step2Desc, tip: t.step2Tip, videoUrl: 'https://www.youtube.com/watch?v=VIDEO2', ...STEP_COLORS[1]},
    {id: 3, title: t.step3Title, description: t.step3Desc, tip: t.step3Tip, videoUrl: 'https://www.youtube.com/watch?v=VIDEO3', ...STEP_COLORS[2]},
    {id: 4, title: t.step4Title, description: t.step4Desc, tip: t.step4Tip, videoUrl: 'https://www.youtube.com/watch?v=VIDEO4', ...STEP_COLORS[3]},
    {id: 5, title: t.step5Title, description: t.step5Desc, tip: t.step5Tip, videoUrl: 'https://www.youtube.com/watch?v=VIDEO5', ...STEP_COLORS[4]},
    {id: 6, title: t.step6Title, description: t.step6Desc, tip: t.step6Tip, videoUrl: 'https://www.youtube.com/watch?v=VIDEO6', ...STEP_COLORS[5]},
  ];
  const faqs = [
    {q: t.faq1Q, a: t.faq1A},
    {q: t.faq2Q, a: t.faq2A},
    {q: t.faq3Q, a: t.faq3A},
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6E39F7', '#8E57FF', '#B78CFF']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t.howToUseTitle}</Text>
          <Text style={styles.headerSub}>{t.howToUseSub2}</Text>
        </View>
        <View style={{width: 40}} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroEmoji}>🏠</Text>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={styles.heroTitle}>{t.howToUseHero}</Text>
            <Text style={styles.heroSub}>{t.howToUseHeroSub}</Text>
          </View>
        </View>

        {/* Steps */}
        <Text style={styles.sectionTitle}>{t.stepByStep}</Text>

        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.timelineCol}>
              <View style={[styles.stepBadge, {backgroundColor: C.purple}]}>
                <Text style={styles.stepNum}>{step.id}</Text>
              </View>
              {index < steps.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={[styles.stepCard, {backgroundColor: step.color}]}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepEmoji}>{step.emoji}</Text>
                <Text style={[styles.stepTitle, {color: C.text}]}>{step.title}</Text>
              </View>
              <Text style={styles.stepDesc}>{step.description}</Text>
              <View style={styles.tipRow}>
                <Ionicons name="bulb-outline" size={14} color={step.iconColor} />
                <Text style={[styles.tipText, {color: step.iconColor}]}> {step.tip}</Text>
              </View>
              <TouchableOpacity
                style={[styles.videoBtn, {borderColor: step.iconColor}]}
                onPress={() => Linking.openURL(step.videoUrl)}>
                <Ionicons name="play-circle" size={18} color={step.iconColor} />
                <Text style={[styles.videoBtnText, {color: step.iconColor}]}>{t.watchVideo}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* FAQ */}
        <Text style={styles.sectionTitle}>{t.faqHeading}</Text>
        {faqs.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={styles.faqCard}
            onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
            activeOpacity={0.8}>
            <View style={styles.faqHeader}>
              <Ionicons name="help-circle-outline" size={20} color={C.purple} />
              <Text style={styles.faqQ}>{faq.q}</Text>
              <Ionicons
                name={expandedFaq === i ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={C.sub}
              />
            </View>
            {expandedFaq === i && <Text style={styles.faqA}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}

        {/* CTA */}
        <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.goBack()}>
          <LinearGradient
            colors={['#6E39F7', '#9B5DE5']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.ctaGrad}>
            <Ionicons name="home-outline" size={20} color="#fff" />
            <Text style={styles.ctaText}>{t.bookNowCta}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  backBtn: {padding: 4},
  headerCenter: {flex: 1, alignItems: 'center'},
  headerTitle: {color: '#fff', fontSize: 18, fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2},
  scroll: {paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40},
  heroBanner: {
    backgroundColor: C.purpleL,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d8c8ff',
  },
  heroEmoji: {fontSize: 42},
  heroTitle: {fontSize: 16, fontWeight: '700', color: C.purple},
  heroSub: {fontSize: 13, color: C.purpleMid, marginTop: 4},
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: C.text,
    marginBottom: 14,
    marginTop: 4,
  },
  stepRow: {flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start'},
  timelineCol: {alignItems: 'center', width: 36, paddingTop: 4},
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNum: {color: '#fff', fontSize: 13, fontWeight: '700'},
  timelineLine: {width: 2, flex: 1, backgroundColor: '#D8C8FF', marginTop: 4, minHeight: 30},
  stepCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    marginLeft: 10,
    marginBottom: 14,
  },
  stepHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 6},
  stepEmoji: {fontSize: 24, marginRight: 8},
  stepTitle: {fontSize: 15, fontWeight: '700', flex: 1},
  stepDesc: {fontSize: 13, color: '#555', lineHeight: 20},
  tipRow: {flexDirection: 'row', alignItems: 'center', marginTop: 8},
  tipText: {fontSize: 12, fontWeight: '500'},
  videoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  videoBtnText: {fontSize: 12, fontWeight: '600', marginLeft: 6},
  faqCard: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  faqHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  faqQ: {flex: 1, fontSize: 14, fontWeight: '600', color: C.text, marginLeft: 6},
  faqA: {fontSize: 13, color: '#666', marginTop: 10, lineHeight: 20, paddingLeft: 28},
  ctaBtn: {marginTop: 24, borderRadius: 14, overflow: 'hidden'},
  ctaGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  ctaText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});
