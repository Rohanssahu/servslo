import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ALL_COUPONS, CATEGORY_LABELS, CouponItem} from './couponData';
import ScreenNameEnum from '../../routes/screenName.enum';

const C = {
  purple: '#6E39F7',
  purpleL: '#f3eeff',
  text: '#1a1a2e',
  sub: '#666',
  bg: '#f7f7fb',
  card: '#fff',
  green: '#13B36B',
  greenL: '#f0fdf4',
  border: '#efefef',
  red: '#EF4444',
  orange: '#F59E0B',
};

type Props = {
  navigation: any;
  route: {params: {amount: number}};
};

export default function ApplyCouponScreen({navigation, route}: Props) {
  const {amount} = route.params;
  const [manualCode, setManualCode] = useState('');
  const [applied, setApplied] = useState<string | null>(null);
  const [error, setError] = useState('');

  const applyCoupon = (coupon: CouponItem) => {
    const savings = coupon.calc(amount);
    if (savings <= 0) return;
    setApplied(coupon.code);
    setTimeout(() => {
      navigation.navigate(ScreenNameEnum.PaymentScreen, {
        appliedCoupon: {code: coupon.code, discount: savings},
      });
    }, 350);
  };

  const applyManual = () => {
    const found = ALL_COUPONS.find(c => c.code === manualCode.trim().toUpperCase());
    if (!found) {
      setError('Invalid coupon code');
      return;
    }
    const savings = found.calc(amount);
    if (savings <= 0) {
      setError('Not applicable on this order amount');
      return;
    }
    setError('');
    applyCoupon(found);
  };

  const CATS = (['card', 'upi', 'cred'] as const);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.card} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
          <Icon name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Apply Coupon</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Enter code row — Swiggy style */}
        <View style={s.inputCard}>
          <TextInput
            style={s.input}
            placeholder="Enter coupon code"
            placeholderTextColor="#aaa"
            value={manualCode}
            onChangeText={t => {setManualCode(t.toUpperCase()); setError('');}}
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={applyManual}
          />
          <TouchableOpacity
            style={[s.applyCodeBtn, !manualCode && s.applyCodeBtnDim]}
            onPress={applyManual}
            activeOpacity={0.85}>
            <Text style={s.applyCodeTxt}>Apply</Text>
          </TouchableOpacity>
        </View>
        {error ? (
          <View style={s.errorRow}>
            <Icon name="alert-circle-outline" size={14} color={C.red} />
            <Text style={s.errorTxt}>{error}</Text>
          </View>
        ) : null}

        {/* All coupons grouped by category */}
        {CATS.map(cat => {
          const items = ALL_COUPONS.filter(c => c.category === cat);
          return (
            <View key={cat}>
              <Text style={s.catHeader}>{CATEGORY_LABELS[cat]}</Text>
              <View style={s.couponGroup}>
                {items.map((coupon, idx) => {
                  const savings = coupon.calc(amount);
                  const eligible = savings > 0;
                  const isApplied = applied === coupon.code;
                  return (
                    <View
                      key={coupon.code}
                      style={[
                        s.couponRow,
                        isApplied && s.couponRowApplied,
                        idx < items.length - 1 && s.couponRowBorder,
                      ]}>
                      {/* Left: code tag + info */}
                      <View style={s.couponLeft}>
                        <View style={[s.codeTag, isApplied && s.codeTagApplied]}>
                          <Text style={[s.codeTagTxt, isApplied && s.codeTagTxtApplied]}>
                            {coupon.code}
                          </Text>
                        </View>
                        <View style={s.couponInfo}>
                          <Text style={s.couponBank}>{coupon.bank}</Text>
                          <Text style={s.couponDesc}>{coupon.desc}</Text>
                          {eligible ? (
                            <View style={s.saveRow}>
                              <Icon name="checkmark-circle" size={12} color={C.green} />
                              <Text style={s.couponSave}>You save ₹{savings}</Text>
                            </View>
                          ) : (
                            <View style={s.saveRow}>
                              <Icon name="information-circle-outline" size={12} color={C.orange} />
                              <Text style={s.couponNA}>
                                Min. order ₹{coupon.minOrder ?? 0} required
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Right: Apply button */}
                      <TouchableOpacity
                        style={[
                          s.rowApplyBtn,
                          isApplied && s.rowAppliedBtn,
                          !eligible && s.rowDisabledBtn,
                        ]}
                        onPress={() => eligible && !isApplied && applyCoupon(coupon)}
                        activeOpacity={eligible ? 0.82 : 1}>
                        <Text
                          style={[
                            s.rowApplyTxt,
                            isApplied && s.rowAppliedTxt,
                            !eligible && s.rowDisabledTxt,
                          ]}>
                          {isApplied ? '✓ Applied' : eligible ? 'Apply' : 'N/A'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={{height: 48}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: {width: 40, height: 40, alignItems: 'center', justifyContent: 'center'},
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: C.text,
  },

  // Code input bar
  inputCard: {
    flexDirection: 'row',
    backgroundColor: C.card,
    margin: 16,
    marginBottom: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    overflow: 'hidden',
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
    letterSpacing: 1.2,
  },
  applyCodeBtn: {
    backgroundColor: C.purple,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  applyCodeBtnDim: {backgroundColor: '#c4b0f5'},
  applyCodeTxt: {color: '#fff', fontWeight: '800', fontSize: 14},

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  errorTxt: {fontSize: 12, color: C.red},

  // Category header
  catHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: C.sub,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },

  // Coupon group card
  couponGroup: {
    backgroundColor: C.card,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  couponRowApplied: {backgroundColor: C.greenL},
  couponRowBorder: {borderBottomWidth: 1, borderBottomColor: C.border},

  couponLeft: {flex: 1, flexDirection: 'row', gap: 12, alignItems: 'flex-start'},

  codeTag: {
    backgroundColor: C.purpleL,
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#d4bbff',
    borderStyle: 'dashed',
  },
  codeTagApplied: {backgroundColor: C.green, borderColor: C.green},
  codeTagTxt: {fontSize: 12, fontWeight: '900', color: C.purple, letterSpacing: 0.8},
  codeTagTxtApplied: {color: '#fff'},

  couponInfo: {flex: 1},
  couponBank: {fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 3},
  couponDesc: {fontSize: 11, color: C.sub, lineHeight: 16},
  saveRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5},
  couponSave: {fontSize: 12, fontWeight: '700', color: C.green},
  couponNA: {fontSize: 11, color: C.orange},

  rowApplyBtn: {
    backgroundColor: C.purpleL,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#d4bbff',
  },
  rowAppliedBtn: {backgroundColor: C.green, borderColor: C.green},
  rowDisabledBtn: {backgroundColor: '#f0f0f0', borderColor: '#e0e0e0'},
  rowApplyTxt: {fontSize: 13, fontWeight: '800', color: C.purple},
  rowAppliedTxt: {color: '#fff'},
  rowDisabledTxt: {color: '#bbb'},
});
