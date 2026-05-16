import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useLanguage} from '../../language/LanguageContext';
import languageStrings from '../../language/languageStrings';

const C = {
  purple: '#4d2b98',
  purpleL: '#f3eeff',
  bg: '#F4F3FB',
  card: '#ffffff',
  text: '#1a1a2e',
  sub: '#888888',
  border: '#efefef',
};

const POLICY_META = [
  {id: 'terms', icon: 'file-document-outline', iconColor: '#4d2b98', bgColor: '#f3eeff'},
  {id: 'privacy', icon: 'shield-lock-outline', iconColor: '#2196F3', bgColor: '#E8F4FD'},
  {id: 'refund', icon: 'cash-refund', iconColor: '#4CAF50', bgColor: '#E8F5E9'},
  {id: 'cancellation', icon: 'calendar-remove-outline', iconColor: '#FF9800', bgColor: '#FFF3E0'},
  {id: 'community', icon: 'account-group-outline', iconColor: '#E91E63', bgColor: '#FCE4EC'},
];

type PolicyId = string;

export default function PoliciesScreen({navigation}: any) {
  const [expandedPolicy, setExpandedPolicy] = useState<PolicyId | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const {lang} = useLanguage();
  const t = languageStrings[lang];

  const policies = [
    {
      ...POLICY_META[0],
      title: t.pol1Title,
      subtitle: t.pol1Sub,
      sections: [
        {heading: t.pol1s1H, body: t.pol1s1B},
        {heading: t.pol1s2H, body: t.pol1s2B},
        {heading: t.pol1s3H, body: t.pol1s3B},
        {heading: t.pol1s4H, body: t.pol1s4B},
        {heading: t.pol1s5H, body: t.pol1s5B},
      ],
    },
    {
      ...POLICY_META[1],
      title: t.pol2Title,
      subtitle: t.pol2Sub,
      sections: [
        {heading: t.pol2s1H, body: t.pol2s1B},
        {heading: t.pol2s2H, body: t.pol2s2B},
        {heading: t.pol2s3H, body: t.pol2s3B},
        {heading: t.pol2s4H, body: t.pol2s4B},
        {heading: t.pol2s5H, body: t.pol2s5B},
      ],
    },
    {
      ...POLICY_META[2],
      title: t.pol3Title,
      subtitle: t.pol3Sub,
      sections: [
        {heading: t.pol3s1H, body: t.pol3s1B},
        {heading: t.pol3s2H, body: t.pol3s2B},
        {heading: t.pol3s3H, body: t.pol3s3B},
        {heading: t.pol3s4H, body: t.pol3s4B},
      ],
    },
    {
      ...POLICY_META[3],
      title: t.pol4Title,
      subtitle: t.pol4Sub,
      sections: [
        {heading: t.pol4s1H, body: t.pol4s1B},
        {heading: t.pol4s2H, body: t.pol4s2B},
        {heading: t.pol4s3H, body: t.pol4s3B},
        {heading: t.pol4s4H, body: t.pol4s4B},
      ],
    },
    {
      ...POLICY_META[4],
      title: t.pol5Title,
      subtitle: t.pol5Sub,
      sections: [
        {heading: t.pol5s1H, body: t.pol5s1B},
        {heading: t.pol5s2H, body: t.pol5s2B},
        {heading: t.pol5s3H, body: t.pol5s3B},
      ],
    },
  ];

  const togglePolicy = (id: PolicyId) => {
    setExpandedPolicy(expandedPolicy === id ? null : id);
    setExpandedSection(null);
  };

  const toggleSection = (key: string) => {
    setExpandedSection(expandedSection === key ? null : key);
  };

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
          <Text style={styles.headerTitle}>{t.policiesTitle}</Text>
          <Text style={styles.headerSub}>{t.policiesSubHeader}</Text>
        </View>
        <View style={{width: 40}} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={20} color={C.purple} />
          <Text style={styles.infoBannerText}>{t.policiesInfo}</Text>
        </View>

        {policies.map(policy => {
          const isOpen = expandedPolicy === policy.id;
          return (
            <View key={policy.id} style={styles.policyCard}>
              <TouchableOpacity
                style={styles.policyHeader}
                onPress={() => togglePolicy(policy.id)}
                activeOpacity={0.8}>
                <View style={[styles.policyIconBox, {backgroundColor: policy.bgColor}]}>
                  <Icon name={policy.icon} size={22} color={policy.iconColor} />
                </View>
                <View style={styles.policyTitleBlock}>
                  <Text style={styles.policyTitle}>{policy.title}</Text>
                  <Text style={styles.policySubtitle}>{policy.subtitle}</Text>
                </View>
                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={C.sub}
                />
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.policyBody}>
                  <View style={[styles.divider, {backgroundColor: policy.bgColor}]} />
                  {policy.sections.map((section, si) => {
                    const key = `${policy.id}-${si}`;
                    const secOpen = expandedSection === key;
                    return (
                      <TouchableOpacity
                        key={si}
                        style={styles.sectionItem}
                        onPress={() => toggleSection(key)}
                        activeOpacity={0.7}>
                        <View style={styles.sectionHeaderRow}>
                          <View
                            style={[styles.sectionDot, {backgroundColor: policy.iconColor}]}
                          />
                          <Text style={styles.sectionHeading}>{section.heading}</Text>
                          <Ionicons
                            name={secOpen ? 'remove-circle-outline' : 'add-circle-outline'}
                            size={18}
                            color={policy.iconColor}
                          />
                        </View>
                        {secOpen && <Text style={styles.sectionBody}>{section.body}</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        <Text style={styles.lastUpdated}>{t.lastUpdated}</Text>

        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => Linking.openURL('mailto:support@servslo.com')}>
          <Ionicons name="mail-outline" size={18} color={C.purple} />
          <Text style={styles.contactBtnText}>{t.contactPolicies}</Text>
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
  scroll: {padding: 16, paddingBottom: 40},
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.purpleL,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#d8c8ff',
  },
  infoBannerText: {fontSize: 13, color: C.purple, flex: 1},
  policyCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  policyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  policyTitleBlock: {flex: 1, marginLeft: 12},
  policyTitle: {fontSize: 15, fontWeight: '700', color: C.text},
  policySubtitle: {fontSize: 12, color: C.sub, marginTop: 2},
  policyBody: {paddingHorizontal: 14, paddingBottom: 14},
  divider: {height: 1, marginBottom: 12},
  sectionItem: {marginBottom: 4},
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  sectionDot: {width: 8, height: 8, borderRadius: 4},
  sectionHeading: {flex: 1, fontSize: 14, fontWeight: '600', color: C.text},
  sectionBody: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    paddingLeft: 16,
    paddingBottom: 8,
  },
  lastUpdated: {
    textAlign: 'center',
    color: C.sub,
    fontSize: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.purpleL,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#d8c8ff',
  },
  contactBtnText: {fontSize: 14, fontWeight: '600', color: C.purple},
});
