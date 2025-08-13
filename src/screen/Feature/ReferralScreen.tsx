import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Share,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  referralLink?: string;
  walletAmount?: number; // top-right wallet chip
  onInviteWhatsApp?: () => void;
  onCopy?: (text: string) => void;
  onShare?: () => void;
  onBack?: () => void;
  navigation:any
};

const ReferralScreen: React.FC<Props> = ({
  referralLink = 'https://snabbit.onelink.me/xxxxx',
  walletAmount = 0,
  onInviteWhatsApp,
  onCopy,
  onShare,
  onBack,
  navigation
}) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Book with my link & both of us earn ₹50: ${referralLink}`,
      });
    } catch {}
  };

  const handleCopy = () => {
    onCopy?.(referralLink);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header gradient */}
      <LinearGradient
        colors={['#6E39F7', '#8E57FF', '#B78CFF']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Top row */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={()=>{
            navigation.goBack()
          }} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.walletChip}>
            <MaterialCommunityIcons name="wallet-giftcard" size={16} color="#6E39F7" />
            <Text style={styles.walletAmount}>₹{walletAmount}</Text>
          </View>
        </View>

        {/* Title + art */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.earn}>EARN <Text style={styles.rupeeBold}>₹50</Text></Text>
            <Text style={styles.sub}>Refer friends & earn when they book.</Text>
          </View>

          {/* coin + gift feel using icons */}
          <View style={styles.artBubble}>
            <MaterialCommunityIcons name="currency-inr-circle" size={40} color="#FFCA3A" />
            <MaterialCommunityIcons name="gift" size={36} color="#FF6B6B" style={{ marginLeft: 8 }} />
          </View>
        </View>

        {/* White card with buttons */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={onInviteWhatsApp}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="whatsapp" size={20} color="#FFFFFF" />
            <Text style={styles.whatsappText}>Invite via whatsapp</Text>
          </TouchableOpacity>

          <Text style={styles.or}>Or</Text>

          <View style={styles.linkRow}>
            <View style={styles.linkBox}>
              <TextInput
                value={referralLink}
                editable={false}
                style={styles.linkInput}
                numberOfLines={1}
              />
            </View>

            <TouchableOpacity
              style={styles.copyBtn}
              onPress={handleCopy}
              activeOpacity={0.85}
            >
              <Text style={styles.copyText}>Copy</Text>
              <Ionicons name="link-outline" size={16} color="#6E39F7" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sendBtn}
              onPress={onShare ?? handleShare}
              activeOpacity={0.9}
            >
              <Ionicons name="paper-plane" size={18} color="#6E39F7" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* How it works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How it works?</Text>

        <View style={styles.step}>
          <View style={styles.stepIconWrap}>
            <Ionicons name="link-outline" size={18} color="#FF6B6B" />
          </View>
          <Text style={styles.stepText}>Share your link with a friend or neighbour.</Text>
        </View>

        <View style={styles.stepDivider} />

        <View style={styles.step}>
          <View style={styles.stepIconWrap}>
            <MaterialCommunityIcons name="currency-inr" size={18} color="#FF6B6B" />
          </View>
          <Text style={styles.stepText}>
            After their first booking, you earn ₹50 and your friend earns ₹50 in wallet.
          </Text>
        </View>

        <View style={styles.stepDivider} />

        <View style={styles.step}>
          <View style={styles.stepIconWrap}>
            <MaterialCommunityIcons name="wallet" size={18} color="#FF6B6B" />
          </View>
          <Text style={styles.stepText}>
            Pay with Snabbit Wallet on your next booking!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReferralScreen;

const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F2FF' },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: Platform.select({ ios: 8, android: 14 }),
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop:30
  },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    gap: 6,
  },
  walletAmount: {
    color: '#6E39F7',
    fontWeight: '700',
    fontSize: 12,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  earn: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 28,
    letterSpacing: 0.5,
  },
  rupeeBold: { color: '#FFFFFF', fontWeight: '900' },
  sub: {
    color: '#F3EFFF',
    marginTop: 6,
    fontSize: 14,
  },
  artBubble: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    padding: 14,
    marginTop: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  whatsappText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  or: {
    textAlign: 'center',
    color: '#A8A6B3',
    marginVertical: 12,
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  linkBox: {
    flex: 1,
    height: 44,
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  linkInput: {
    color: '#6E39F7',
    fontSize: 14,
  },
  copyBtn: {
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1EAFE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  copyText: { color: '#6E39F7', fontWeight: '700' },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1EAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: CARD_RADIUS,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222222',
    marginBottom: 10,
  },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFE7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepText: { flex: 1, color: '#4A4A55', fontSize: 14, lineHeight: 20 },
  stepDivider: {
    height: 12,
  },
});
