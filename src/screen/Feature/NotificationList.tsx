import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
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
  green: '#21865b',
  greenBg: '#e8fbf0',
  unreadBg: '#f3eeff',
};

type NotifType = 'booking' | 'offer' | 'update' | 'payment';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  type: NotifType;
  read: boolean;
}

const typeColors: Record<NotifType, {bg: string; icon: string}> = {
  booking: {bg: '#EDE7F6', icon: '#7E57C2'},
  offer: {bg: '#FFF3E0', icon: '#FF9800'},
  payment: {bg: '#E8F5E9', icon: '#4CAF50'},
  update: {bg: '#E3F2FD', icon: '#2196F3'},
};

const INITIALLY_READ = new Set(['4', '6', '7', '8', '9', '10']);

export default function NotificationList({navigation}: any) {
  const [activeTab, setActiveTab] = useState('all');
  const [readIds, setReadIds] = useState<Set<string>>(INITIALLY_READ);
  const {lang} = useLanguage();

  const tabs = useMemo(() => {
    const s = languageStrings[lang];
    return [
      {id: 'all', label: s.allNotif, icon: 'bell-outline'},
      {id: 'booking', label: s.bookingNotif, icon: 'calendar-check-outline'},
      {id: 'offer', label: s.offerNotif, icon: 'sale'},
      {id: 'payment', label: s.paymentNotif, icon: 'cash-outline'},
      {id: 'update', label: s.updateNotif, icon: 'bell-ring-outline'},
    ];
  }, [lang]);

  const notifs = useMemo<Notification[]>(() => {
    const s = languageStrings[lang];
    return [
      {
        id: '1',
        title: s.notif1Title,
        message: s.notif1Msg,
        time: s.notif2min,
        icon: 'check-circle-outline',
        type: 'booking',
        read: readIds.has('1'),
      },
      {
        id: '2',
        title: s.notif2Title,
        message: s.notif2Msg,
        time: s.notif10min,
        icon: 'map-marker-check-outline',
        type: 'booking',
        read: readIds.has('2'),
      },
      {
        id: '3',
        title: s.notif3Title,
        message: s.notif3Msg,
        time: s.notif30min,
        icon: 'play-circle-outline',
        type: 'booking',
        read: readIds.has('3'),
      },
      {
        id: '4',
        title: s.notif4Title,
        message: s.notif4Msg,
        time: s.notif1hr,
        icon: 'star-check-outline',
        type: 'booking',
        read: readIds.has('4'),
      },
      {
        id: '5',
        title: s.notif5Title,
        message: s.notif5Msg,
        time: s.notif2hr,
        icon: 'sale',
        type: 'offer',
        read: readIds.has('5'),
      },
      {
        id: '6',
        title: s.notif6Title,
        message: s.notif6Msg,
        time: s.notifYesterday,
        icon: 'tag-outline',
        type: 'offer',
        read: readIds.has('6'),
      },
      {
        id: '7',
        title: s.notif7Title,
        message: s.notif7Msg,
        time: s.notif1day,
        icon: 'check-decagram-outline',
        type: 'payment',
        read: readIds.has('7'),
      },
      {
        id: '8',
        title: s.notif8Title,
        message: s.notif8Msg,
        time: s.notif2day,
        icon: 'cash-refund',
        type: 'payment',
        read: readIds.has('8'),
      },
      {
        id: '9',
        title: s.notif9Title,
        message: s.notif9Msg,
        time: s.notif3day,
        icon: 'bell-ring-outline',
        type: 'update',
        read: readIds.has('9'),
      },
      {
        id: '10',
        title: s.notif10Title,
        message: s.notif10Msg,
        time: s.notif4day,
        icon: 'update',
        type: 'update',
        read: readIds.has('10'),
      },
    ];
  }, [lang, readIds]);

  const t = languageStrings[lang];
  const filtered = notifs.filter(n => activeTab === 'all' || n.type === activeTab);
  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => {
    setReadIds(new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']));
  };

  const markRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  };

  const renderItem = ({item}: {item: Notification}) => {
    const tc = typeColors[item.type];
    return (
      <TouchableOpacity
        style={[styles.card, !item.read && styles.cardUnread]}
        onPress={() => markRead(item.id)}
        activeOpacity={0.8}>
        {!item.read && <View style={styles.unreadDot} />}
        <View style={[styles.iconBox, {backgroundColor: tc.bg}]}>
          <Icon name={item.icon} size={22} color={tc.icon} />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]}>
              {item.title}
            </Text>
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
          <Text style={styles.cardMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <View style={[styles.typeBadge, {backgroundColor: tc.bg}]}>
            <Text style={[styles.typeBadgeText, {color: tc.icon}]}>
              {tabs.find(tab => tab.id === item.type)?.label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.headerTitle}>{t.notifications}</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {unreadCount} {t.newNotifBadge}
              </Text>
            </View>
          )}
        </View>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>{t.markAllRead}</Text>
          </TouchableOpacity>
        ) : (
          <View style={{width: 56}} />
        )}
      </LinearGradient>

      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}>
          {tabs.map(tab => {
            const tabUnread = notifs.filter(
              n => !n.read && (tab.id === 'all' || n.type === tab.id),
            ).length;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}>
                <Icon
                  name={tab.icon}
                  size={14}
                  color={activeTab === tab.id ? '#fff' : C.sub}
                />
                <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                  {tab.label}
                </Text>
                {tabUnread > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{tabUnread}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔔</Text>
          <Text style={styles.emptyTitle}>{t.noNotifications}</Text>
          <Text style={styles.emptySub}>{t.noNotifSub}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{height: 1, backgroundColor: C.border}} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  backBtn: {padding: 4},
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: {color: '#fff', fontSize: 18, fontWeight: '700'},
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadBadgeText: {color: '#fff', fontSize: 11, fontWeight: '700'},
  markAllBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  markAllText: {color: '#fff', fontSize: 12, fontWeight: '600'},
  tabsWrapper: {
    backgroundColor: C.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabsScroll: {paddingHorizontal: 12, paddingVertical: 10, gap: 8},
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bg,
    gap: 4,
  },
  tabActive: {backgroundColor: C.purple, borderColor: C.purple},
  tabText: {fontSize: 12, color: C.sub, fontWeight: '500'},
  tabTextActive: {color: '#fff'},
  tabBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {color: '#fff', fontSize: 9, fontWeight: '700'},
  list: {paddingVertical: 8, backgroundColor: C.card},
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: C.card,
    position: 'relative',
  },
  cardUnread: {backgroundColor: C.unreadBg},
  unreadDot: {
    position: 'absolute',
    left: 6,
    top: 20,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.purple,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardBody: {flex: 1},
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {fontSize: 14, fontWeight: '500', color: C.text, flex: 1, marginRight: 8},
  cardTitleUnread: {fontWeight: '700'},
  cardTime: {fontSize: 11, color: C.sub, flexShrink: 0},
  cardMessage: {fontSize: 13, color: '#555', marginTop: 3, lineHeight: 18},
  typeBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  typeBadgeText: {fontSize: 10, fontWeight: '600'},
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {fontSize: 52, marginBottom: 12},
  emptyTitle: {fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 6},
  emptySub: {fontSize: 13, color: C.sub, textAlign: 'center'},
});
