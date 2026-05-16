import React, {memo, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import ScreenNameEnum from '../../routes/screenName.enum';

// ─── Colors (declared first — used in TYPE_META below) ───────────────────────
const C = {
  purple:  '#4d2b98' as const,
  purpleL: '#F0EBFF' as const,
  bg:      '#F5F4FB' as const,
  card:    '#FFFFFF' as const,
  text:    '#1A1A2E' as const,
  sub:     '#888888' as const,
  border:  '#EBEBF0' as const,
};

// ─── Types ────────────────────────────────────────────────────────────────────

type AddressType = 'home' | 'office' | 'other';

type Address = {
  id: string;
  title: string;
  line: string;
  type?: AddressType;
};

type Filter = 'all' | AddressType;

type Props = {
  addresses?: Address[];
  onBack?: () => void;
  onAddNew?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string) => void;
  initialSelectedId?: string;
  navigation: any;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_META: Record<AddressType, {emoji: string; label: string; bg: string; tint: string}> = {
  home:   {emoji: '🏠', label: 'Home',   bg: '#F0EBFF', tint: C.purple},
  office: {emoji: '💼', label: 'Office', bg: '#EBF5FF', tint: '#1D4ED8'},
  other:  {emoji: '👥', label: 'Other',  bg: '#FFF7ED', tint: '#EA580C'},
};

const FILTERS: {key: Filter; label: string}[] = [
  {key: 'all',    label: 'All'},
  {key: 'home',   label: '🏠 Home'},
  {key: 'office', label: '💼 Office'},
  {key: 'other',  label: '👥 Other'},
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Radio = memo(({checked}: {checked: boolean}) => (
  <View style={[ss.radioOuter, checked && ss.radioOuterOn]}>
    {checked && <View style={ss.radioInner} />}
  </View>
));

const AddressCard = memo(
  ({
    item,
    selected,
    onPress,
    onEdit,
    onDelete,
  }: {
    item: Address;
    selected: boolean;
    onPress: () => void;
    onEdit: () => void;
    onDelete: () => void;
  }) => {
    const meta = TYPE_META[item.type ?? 'home'];
    return (
      <TouchableOpacity
        style={[ss.card, selected && ss.cardSelected]}
        onPress={onPress}
        activeOpacity={0.8}>
        {/* Type icon */}
        <View style={[ss.typeCircle, {backgroundColor: meta.bg}]}>
          <Text style={ss.typeEmoji}>{meta.emoji}</Text>
        </View>

        {/* Details */}
        <View style={ss.cardBody}>
          <View style={ss.cardTitleRow}>
            <Text style={ss.cardTitle}>{item.title}</Text>
            <View style={[ss.typeBadge, {backgroundColor: meta.bg}]}>
              <Text style={[ss.typeBadgeText, {color: meta.tint}]}>{meta.label}</Text>
            </View>
          </View>
          <Text style={ss.addressLine} numberOfLines={2}>{item.line}</Text>
          <View style={ss.actionsRow}>
            <TouchableOpacity
              style={ss.actionBtn}
              onPress={onEdit}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Ionicons name="pencil-outline" size={14} color={C.purple} />
              <Text style={ss.editText}>Edit</Text>
            </TouchableOpacity>
            <View style={ss.actionDivider} />
            <TouchableOpacity
              style={ss.actionBtn}
              onPress={onDelete}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Ionicons name="trash-outline" size={14} color="#E53935" />
              <Text style={ss.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Radio */}
        <Radio checked={selected} />
      </TouchableOpacity>
    );
  },
);

const EmptyState = ({onAdd}: {onAdd: () => void}) => (
  <View style={ss.empty}>
    <Text style={ss.emptyEmoji}>📍</Text>
    <Text style={ss.emptyTitle}>No addresses saved</Text>
    <Text style={ss.emptySub}>Add your home or office address{'\n'}for faster bookings every time</Text>
    <TouchableOpacity style={ss.emptyBtn} onPress={onAdd} activeOpacity={0.85}>
      <Text style={ss.emptyBtnText}>+ Add Address</Text>
    </TouchableOpacity>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const AddressesScreen: React.FC<Props> = ({
  addresses = [
    {
      id: '1',
      title: 'Home',
      type: 'home',
      line: '102, Shanti, Tambe Nagar, Opp. KrishnaKunj Tower, Mulund West, Mumbai – 400080',
    },
  ],
  onBack,
  onAddNew,
  onEdit,
  onDelete,
  onSelect,
  initialSelectedId,
  navigation,
}) => {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialSelectedId ?? addresses?.[0]?.id,
  );
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelect?.(id);
  };

  const goToAdd = () => {
    onAddNew?.();
    navigation.navigate(ScreenNameEnum.LocationPickerScreen);
  };

  const filtered =
    activeFilter === 'all'
      ? addresses
      : addresses.filter(a => (a.type ?? 'home') === activeFilter);

  return (
    <SafeAreaView style={ss.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#6E39F7" />

      {/* ── Header ── */}
      <LinearGradient
        colors={['#6E39F7', '#8E57FF', '#B78CFF']}
        start={{x: 0.1, y: 0}}
        end={{x: 1, y: 1}}
        style={ss.header}>
        <TouchableOpacity
          style={ss.backBtn}
          onPress={() => { onBack?.(); navigation.goBack(); }}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.75}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={ss.headerTitle}>My Addresses</Text>

        <TouchableOpacity
          style={ss.addCircleBtn}
          onPress={goToAdd}
          activeOpacity={0.8}>
          <Ionicons name="add" size={22} color={C.purple} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={ss.scroll}
        contentContainerStyle={ss.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Use Current Location ── */}
        <TouchableOpacity
          style={ss.currentLocCard}
          onPress={goToAdd}
          activeOpacity={0.85}>
          <View style={ss.currentLocIcon}>
            <Ionicons name="locate" size={22} color="#fff" />
          </View>
          <View style={ss.currentLocText}>
            <Text style={ss.currentLocTitle}>Use Current Location</Text>
            <Text style={ss.currentLocSub}>Automatically detect where you are</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.purple} />
        </TouchableOpacity>

        {/* ── Filter Chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={ss.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[ss.filterChip, activeFilter === f.key && ss.filterChipActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.75}>
              <Text style={[ss.filterChipText, activeFilter === f.key && ss.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Saved Addresses ── */}
        {filtered.length === 0 ? (
          <EmptyState onAdd={goToAdd} />
        ) : (
          <>
            <Text style={ss.listLabel}>
              {filtered.length} saved address{filtered.length !== 1 ? 'es' : ''}
            </Text>
            {filtered.map(a => (
              <AddressCard
                key={a.id}
                item={a}
                selected={selectedId === a.id}
                onPress={() => handleSelect(a.id)}
                onEdit={() => onEdit?.(a.id)}
                onDelete={() => onDelete?.(a.id)}
              />
            ))}
          </>
        )}

        <View style={{height: 100}} />
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View style={ss.bottomWrap}>
        <TouchableOpacity style={ss.addBtn} onPress={goToAdd} activeOpacity={0.88}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" style={{marginRight: 8}} />
          <Text style={ss.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddressesScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const ss = StyleSheet.create({
  safe: {flex: 1, backgroundColor: C.bg},

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 12 : 14,
    paddingBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  addCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24},

  // Current location card
  currentLocCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: C.purple,
    ...Platform.select({
      ios:     {shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: {width: 0, height: 2}},
      android: {elevation: 3},
    }),
  },
  currentLocIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  currentLocText: {flex: 1},
  currentLocTitle: {fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 2},
  currentLocSub:   {fontSize: 12, color: C.sub},

  // Filter chips
  filterRow: {paddingBottom: 16, paddingRight: 4},
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.card,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  filterChipActive: {
    backgroundColor: C.purple,
    borderColor: C.purple,
  },
  filterChipText: {fontSize: 13, fontWeight: '600', color: C.sub},
  filterChipTextActive: {color: '#fff'},

  // List label
  listLabel: {fontSize: 12, fontWeight: '600', color: C.sub, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5},

  // Address card
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    ...Platform.select({
      ios:     {shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: {width: 0, height: 2}},
      android: {elevation: 2},
    }),
  },
  cardSelected: {
    borderColor: C.purple,
    backgroundColor: '#FDFBFF',
  },
  typeCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  typeEmoji: {fontSize: 22},
  cardBody: {flex: 1},
  cardTitleRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 4},
  cardTitle: {fontSize: 15, fontWeight: '700', color: C.text, marginRight: 8},
  typeBadge: {paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8},
  typeBadgeText: {fontSize: 11, fontWeight: '700'},
  addressLine: {fontSize: 13, color: C.sub, lineHeight: 18, marginBottom: 10},
  actionsRow: {flexDirection: 'row', alignItems: 'center'},
  actionBtn: {flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#F7F7FA'},
  editText:   {fontSize: 13, fontWeight: '700', color: C.purple, marginLeft: 4},
  deleteText: {fontSize: 13, fontWeight: '700', color: '#E53935', marginLeft: 4},
  actionDivider: {width: 10},

  // Radio
  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#ccc',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 4, flexShrink: 0,
  },
  radioOuterOn: {borderColor: C.purple},
  radioInner:   {width: 10, height: 10, borderRadius: 5, backgroundColor: C.purple},

  // Empty state
  empty: {alignItems: 'center', paddingVertical: 48},
  emptyEmoji: {fontSize: 56, marginBottom: 16},
  emptyTitle: {fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 8},
  emptySub:   {fontSize: 14, color: C.sub, textAlign: 'center', lineHeight: 20, marginBottom: 24},
  emptyBtn: {
    backgroundColor: C.purple, borderRadius: 12,
    paddingHorizontal: 28, paddingVertical: 14,
  },
  emptyBtnText: {color: '#fff', fontSize: 15, fontWeight: '700'},

  // Bottom CTA
  bottomWrap: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.select({ios: 28, android: 16}),
    paddingTop: 8,
    backgroundColor: 'rgba(245,244,251,0.96)',
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: C.purple,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    ...Platform.select({
      ios:     {shadowColor: C.purple, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: {width: 0, height: 4}},
      android: {elevation: 4},
    }),
  },
  addBtnText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});
