import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';

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

const HelpSupportScreen = ({navigation}: any) => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const {lang} = useLanguage();
  const t = languageStrings[lang];

  const quickActions = [
    {
      icon: 'call-outline',
      label: t.callUs,
      sub: t.callHours,
      color: '#E8F5E9',
      iconColor: '#4CAF50',
      action: () => Linking.openURL('tel:+918800000000'),
    },
    {
      icon: 'chatbubble-ellipses-outline',
      label: t.chatWithUs,
      sub: t.chatInstant,
      color: '#E3F2FD',
      iconColor: '#2196F3',
      action: () => Linking.openURL('https://wa.me/918800000000'),
    },
    {
      icon: 'logo-whatsapp',
      label: t.whatsapp,
      sub: t.whatsapp24,
      color: '#E8F5E9',
      iconColor: '#25D366',
      action: () => Linking.openURL('https://wa.me/918800000000'),
    },
    {
      icon: 'mail-outline',
      label: t.emailUs,
      sub: t.emailReply,
      color: '#FFF3E0',
      iconColor: '#FF9800',
      action: () => Linking.openURL('mailto:support@servslo.com'),
    },
  ];

  const faqs = [
    {id: '1', category: 'booking', q: t.faq1HQ, a: t.faq1HA},
    {id: '2', category: 'payment', q: t.faq2HQ, a: t.faq2HA},
    {id: '3', category: 'service', q: t.faq3HQ, a: t.faq3HA},
    {id: '4', category: 'service', q: t.faq4HQ, a: t.faq4HA},
    {id: '5', category: 'account', q: t.faq5HQ, a: t.faq5HA},
    {id: '6', category: 'payment', q: t.faq6HQ, a: t.faq6HA},
    {id: '7', category: 'booking', q: t.faq7HQ, a: t.faq7HA},
  ];

  const categories = [
    {id: 'all', label: t.catAll},
    {id: 'booking', label: t.catBooking},
    {id: 'payment', label: t.catPayment},
    {id: 'service', label: t.catService},
    {id: 'account', label: t.catAccount},
  ];

  const filteredFaqs = faqs.filter(f => {
    const matchCat = activeCategory === 'all' || f.category === activeCategory;
    const matchSearch = search === '' || f.q.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <LinearGradient
        colors={['#6E39F7', '#8E57FF', '#B78CFF']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t.helpTitle}</Text>
          <Text style={styles.headerSub}>{t.helpSubtitle}</Text>
        </View>
        <View style={{width: 40}} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.heroBanner}>
          <Text style={styles.heroEmoji}>🙋</Text>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={styles.heroTitle}>{t.helpHero}</Text>
            <Text style={styles.heroSub}>{t.helpHeroSub}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t.contactNow}</Text>
        <View style={styles.quickGrid}>
          {quickActions.map((qa, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.quickCard, {backgroundColor: qa.color}]}
              onPress={qa.action}
              activeOpacity={0.75}>
              <Ionicons name={qa.icon as any} size={28} color={qa.iconColor} />
              <Text style={[styles.quickLabel, {color: qa.iconColor}]}>{qa.label}</Text>
              <Text style={styles.quickSub}>{qa.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.responseBadge}>
          <Ionicons name="time-outline" size={16} color={C.green} />
          <Text style={styles.responseBadgeText}>{t.avgResponse}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t.faqSearch}</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={C.sub} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchFaqPlaceholder}
            placeholderTextColor={C.sub}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={C.sub} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={{gap: 8}}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, activeCategory === cat.id && styles.catChipActive]}
              onPress={() => setActiveCategory(cat.id)}>
              <Text
                style={[
                  styles.catChipText,
                  activeCategory === cat.id && styles.catChipTextActive,
                ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredFaqs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>{t.noFaqFound}</Text>
          </View>
        ) : (
          filteredFaqs.map(faq => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqCard}
              onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              activeOpacity={0.8}>
              <View style={styles.faqHeader}>
                <Ionicons name="help-circle-outline" size={20} color={C.purple} />
                <Text style={styles.faqQ}>{faq.q}</Text>
                <Ionicons
                  name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={C.sub}
                />
              </View>
              {expandedFaq === faq.id && (
                <View style={styles.faqBody}>
                  <View style={styles.faqDivider} />
                  <Text style={styles.faqA}>{faq.a}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}

        <View style={styles.stillHelpCard}>
          <Text style={styles.stillHelpTitle}>{t.stillNeedHelp}</Text>
          <Text style={styles.stillHelpSub}>{t.stillNeedHelpSub}</Text>
          <TouchableOpacity
            style={styles.stillHelpBtn}
            onPress={() => Linking.openURL('https://wa.me/918800000000')}>
            <LinearGradient
              colors={['#6E39F7', '#9B5DE5']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.stillHelpGrad}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
              <Text style={styles.stillHelpBtnText}>{t.talkToTeam}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;

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
  scroll: {padding: 16, paddingBottom: 40},
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
  heroEmoji: {fontSize: 40},
  heroTitle: {fontSize: 15, fontWeight: '700', color: C.purple},
  heroSub: {fontSize: 12, color: C.purpleMid, marginTop: 3},
  sectionTitle: {fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 12},
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  quickCard: {
    width: '47%',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  quickLabel: {fontSize: 14, fontWeight: '700', marginTop: 8},
  quickSub: {fontSize: 11, color: C.sub, marginTop: 2},
  responseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.greenBg,
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginBottom: 20,
  },
  responseBadgeText: {fontSize: 13, color: C.green, fontWeight: '500'},
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 12,
    elevation: 1,
  },
  searchInput: {flex: 1, fontSize: 14, color: C.text, padding: 0},
  categoryScroll: {marginBottom: 14},
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  catChipActive: {backgroundColor: C.purple, borderColor: C.purple},
  catChipText: {fontSize: 13, color: C.sub, fontWeight: '500'},
  catChipTextActive: {color: '#fff'},
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
  faqQ: {flex: 1, fontSize: 14, fontWeight: '600', color: C.text},
  faqBody: {paddingTop: 4},
  faqDivider: {height: 1, backgroundColor: C.border, marginBottom: 10},
  faqA: {fontSize: 13, color: '#555', lineHeight: 20, paddingLeft: 28},
  emptyState: {alignItems: 'center', paddingVertical: 40},
  emptyEmoji: {fontSize: 40, marginBottom: 10},
  emptyText: {fontSize: 15, color: C.sub},
  stillHelpCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  stillHelpTitle: {fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 6},
  stillHelpSub: {fontSize: 13, color: C.sub, lineHeight: 20, marginBottom: 16},
  stillHelpBtn: {borderRadius: 12, overflow: 'hidden'},
  stillHelpGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  stillHelpBtnText: {color: '#fff', fontSize: 15, fontWeight: '700'},
});
