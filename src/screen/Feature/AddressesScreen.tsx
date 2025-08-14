import React, { useState, memo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { color } from '../../constant';
import ScreenNameEnum from '../../routes/screenName.enum';

type Address = {
  id: string;
  title: string; // e.g., "Address 1"
  line: string;  // full address text
};

type Props = {
  addresses?: Address[];
  onBack?: () => void;
  onAddNew?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string) => void;
  initialSelectedId?: string;
  navigation:any
};

const PURPLE = '#5724D6';
const PURPLE_LIGHT = '#EEE8FF';
const TEXT_DARK = '#1B1B1F';
const TEXT_SECONDARY = '#6C6C75';
const RED = '#C62828';
const NAVY = '#0F1B3D';
const CARD_BG = '#FFFFFF';
const ICON_BG = '#F3F2F7';
const SCREEN_BG = '#FFFFFF';

const Radio = memo(({ checked }: { checked: boolean }) => (
  <View style={[styles.radioOuter, checked && styles.radioOuterActive]}>
    {checked ? <View style={styles.radioInner} /> : null}
  </View>
));

const AddressItem = memo(
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
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={styles.card}>
          <View style={styles.rowTop}>
            <View style={styles.iconBox}>
              <Ionicons name="home-outline" size={22} color={TEXT_DARK} />
            </View>

            <View style={styles.titleAndAddress}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.addressText}>{item.line}</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <View style={{ width: 18 }} />
                <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Radio checked={selected} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

const AddressesScreen: React.FC<Props> = ({
  addresses = [
    {
      id: '1',
      title: 'Address 1',
      line:
        '102, Shanti, Tambe Nagar, Opp. KrishnaKunj Tower, Sarojini Naidu Rd, Tambe Nagar, Ashok Nagar, Mulund West, Mumbai, Maharashtra 400080, India',
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
    initialSelectedId ?? addresses?.[0]?.id
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelect?.(id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>{
          navigation.goBack()
        }} 
        
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Addresses</Text>
        {/* Right spacer to balance back icon */}
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {addresses.map((a) => (
          <AddressItem
            key={a.id}
            item={a}
            selected={selectedId === a.id}
            onPress={() => handleSelect(a.id)}
            onEdit={() => onEdit?.(a.id)}
            onDelete={() => onDelete?.(a.id)}
          />
        ))}
      </ScrollView>

      {/* Fixed bottom button */}
      <View style={styles.bottomWrap}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.9}
          onPress={()=>{
            navigation.navigate(ScreenNameEnum.LocationPickerScreen)
          }}
        >
          <Text style={styles.primaryBtnText}>Add new address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddressesScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SCREEN_BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.select({ ios: 0, android: 12 }),
    paddingBottom: 10,
    backgroundColor: SCREEN_BG,
    marginTop:30
  },
  headerTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 20,
    fontWeight: '600',
    color: TEXT_DARK,
  },

  scroll: {
    flex: 1,
    backgroundColor: SCREEN_BG,
  },

  card: {
    backgroundColor: CARD_BG,
    marginTop: 12,
    paddingHorizontal: 16,
    borderWidth:1,borderBlockColor:'#ccc',
    borderRadius:10,padding:20,margin:10
  },

  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  titleAndAddress: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
    marginTop: 2,
  },

  addressText: {
    fontSize: 14,
    lineHeight: 20,
    color: TEXT_SECONDARY,
  },

  actionsRow: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 8,
  },

  editText: {
    fontSize: 15,
    fontWeight: '700',
    color: NAVY,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '700',
    color: RED,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  radioOuterActive: {
    borderColor: PURPLE,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: PURPLE,
  },

  bottomWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.select({ ios: 22, android: 12 }),
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  primaryBtn: {
    backgroundColor: color.purple,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
