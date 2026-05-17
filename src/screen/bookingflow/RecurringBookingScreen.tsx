import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenNameEnum from '../../routes/screenName.enum';

const C = {
  purple: '#6E39F7',
  purpleL: '#f3eeff',
  text: '#1a1a2e',
  sub: '#888',
  green: '#13B36B',
  border: '#efefef',
  bg: '#f7f7fb',
  orange: '#F59E0B',
};

type Frequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
type TimeSlot = 'morning' | 'afternoon' | 'evening';

type Props = {
  navigation: any;
  route: { params: { serviceName: string; serviceEmoji: string; servicePrice: number } };
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const WEEK_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const FREQ_OPTIONS: { key: Frequency; label: string }[] = [
  { key: 'once', label: '1️⃣ Once' },
  { key: 'daily', label: '📆 Daily' },
  { key: 'weekly', label: '🗓 Weekly' },
  { key: 'monthly', label: '📅 Monthly' },
  { key: 'custom', label: '✏️ Custom' },
];

const TIME_SLOTS: { key: TimeSlot; emoji: string; label: string; sub: string }[] = [
  { key: 'morning', emoji: '🌅', label: 'Morning', sub: '7–11 AM' },
  { key: 'afternoon', emoji: '☀️', label: 'Afternoon', sub: '12–4 PM' },
  { key: 'evening', emoji: '🌆', label: 'Evening', sub: '5–8 PM' },
];

function padDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export default function RecurringBookingScreen({ navigation, route }: Props) {
  const { serviceName, serviceEmoji, servicePrice } = route.params;
  const today = new Date();

  const [frequency, setFrequency] = useState<Frequency>('once');
  const [calMonth, setCalMonth] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedOnce, setSelectedOnce] = useState<Date | null>(null);
  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([]);
  const [selectedMonthDates, setSelectedMonthDates] = useState<number[]>([]);
  const [customDates, setCustomDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const toggleTimeSlot = (slot: TimeSlot) => {
    setTimeSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot],
    );
  };
  const [duration, setDuration] = useState<1 | 3 | 6>(1);

  // Calendar grid computation
  const calendarDays = useMemo(() => {
    const year = calMonth.getFullYear();
    const month = calMonth.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }
    // Pad to complete last row
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    return cells;
  }, [calMonth]);

  const isPastDay = (day: number): boolean => {
    const year = calMonth.getFullYear();
    const month = calMonth.getMonth();
    const cellDate = new Date(year, month, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return cellDate < todayStart;
  };

  const isDaySelected = (day: number): boolean => {
    const year = calMonth.getFullYear();
    const month = calMonth.getMonth();
    const key = `${year}-${month}-${day}`;
    if (frequency === 'custom') {
      return customDates.includes(key);
    }
    if ((frequency === 'once' || frequency === 'daily') && selectedOnce) {
      return (
        selectedOnce.getFullYear() === year &&
        selectedOnce.getMonth() === month &&
        selectedOnce.getDate() === day
      );
    }
    return false;
  };

  const handleDayPress = (day: number) => {
    if (isPastDay(day)) return;
    const year = calMonth.getFullYear();
    const month = calMonth.getMonth();
    const key = `${year}-${month}-${day}`;
    if (frequency === 'custom') {
      setCustomDates(prev =>
        prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key],
      );
    } else {
      setSelectedOnce(new Date(year, month, day));
    }
  };

  const prevMonth = () => {
    setCalMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const toggleWeekDay = (d: number) => {
    setSelectedWeekDays(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d],
    );
  };

  const toggleMonthDate = (d: number) => {
    setSelectedMonthDates(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d],
    );
  };

  // Session count
  const sessionCount = useMemo(() => {
    switch (frequency) {
      case 'once':
        return 1;
      case 'daily':
        return duration * 30;
      case 'weekly':
        return selectedWeekDays.length * 4 * duration;
      case 'monthly':
        return selectedMonthDates.length * duration;
      case 'custom':
        return customDates.length;
      default:
        return 0;
    }
  }, [frequency, duration, selectedWeekDays, selectedMonthDates, customDates]);

  const estimatedTotal = sessionCount * servicePrice;

  // Validity check
  const isValid = useMemo(() => {
    if (timeSlots.length === 0) return false;
    switch (frequency) {
      case 'once':
        return selectedOnce !== null;
      case 'daily':
        return selectedOnce !== null;
      case 'weekly':
        return selectedWeekDays.length > 0;
      case 'monthly':
        return selectedMonthDates.length > 0;
      case 'custom':
        return customDates.length > 0;
      default:
        return false;
    }
  }, [frequency, timeSlots, selectedOnce, selectedWeekDays, selectedMonthDates, customDates]);

  const showCalendar = frequency === 'once' || frequency === 'daily' || frequency === 'custom';
  const showWeekDays = frequency === 'weekly';
  const showMonthDates = frequency === 'monthly';
  const showDuration = frequency === 'daily' || frequency === 'weekly' || frequency === 'monthly';

  const scheduleDescription = () => {
    switch (frequency) {
      case 'once':
        return selectedOnce
          ? `${selectedOnce.getDate()} ${MONTH_NAMES[selectedOnce.getMonth()]} ${selectedOnce.getFullYear()}`
          : 'Select a date';
      case 'daily':
        return selectedOnce
          ? `Daily from ${selectedOnce.getDate()} ${MONTH_NAMES[selectedOnce.getMonth()]}, ${duration} month${duration > 1 ? 's' : ''}`
          : 'Select start date';
      case 'weekly':
        return selectedWeekDays.length > 0
          ? `Every ${selectedWeekDays.map(d => WEEK_DAY_NAMES[d]).join(', ')}, ${duration} month${duration > 1 ? 's' : ''}`
          : 'Select week days';
      case 'monthly':
        return selectedMonthDates.length > 0
          ? `On dates ${selectedMonthDates.sort((a, b) => a - b).join(', ')} each month, ${duration} month${duration > 1 ? 's' : ''}`
          : 'Select dates of month';
      case 'custom':
        return customDates.length > 0
          ? `${customDates.length} date${customDates.length > 1 ? 's' : ''} selected`
          : 'Select specific dates';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Schedule Service</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Service card */}
        <LinearGradient
          colors={[C.purple, '#9B59D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.serviceCard}>
          <Text style={s.serviceEmoji}>{serviceEmoji}</Text>
          <View style={s.serviceInfo}>
            <Text style={s.serviceName}>{serviceName}</Text>
            <Text style={s.servicePrice}>₹{servicePrice} / session</Text>
          </View>
        </LinearGradient>

        {/* Frequency section */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>How often?</Text>
          <View style={s.chipRow}>
            {FREQ_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[s.freqChip, frequency === opt.key && s.freqChipActive]}
                onPress={() => {
                  setFrequency(opt.key);
                  setSelectedOnce(null);
                  setSelectedWeekDays([]);
                  setSelectedMonthDates([]);
                  setCustomDates([]);
                }}
                activeOpacity={0.8}>
                <Text
                  style={[s.freqChipText, frequency === opt.key && s.freqChipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Calendar */}
        {showCalendar && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>
              {frequency === 'custom'
                ? 'Select Dates'
                : frequency === 'daily'
                ? 'Select Start Date'
                : 'Select Date'}
            </Text>

            {/* Month navigation */}
            <View style={s.monthNav}>
              <TouchableOpacity onPress={prevMonth} style={s.monthNavBtn} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={20} color={C.purple} />
              </TouchableOpacity>
              <Text style={s.monthLabel}>
                {MONTH_NAMES[calMonth.getMonth()]} {calMonth.getFullYear()}
              </Text>
              <TouchableOpacity onPress={nextMonth} style={s.monthNavBtn} activeOpacity={0.7}>
                <Ionicons name="chevron-forward" size={20} color={C.purple} />
              </TouchableOpacity>
            </View>

            {/* Day header */}
            <View style={s.dayHeaderRow}>
              {DAY_LABELS.map(d => (
                <Text key={d} style={s.dayHeader}>{d}</Text>
              ))}
            </View>

            {/* Calendar grid */}
            <View style={s.calGrid}>
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <View key={`e-${idx}`} style={s.calCell} />;
                }
                const past = isPastDay(day);
                const selected = isDaySelected(day);
                return (
                  <TouchableOpacity
                    key={`d-${idx}`}
                    style={[
                      s.calCell,
                      selected && s.calCellSelected,
                      past && s.calCellPast,
                    ]}
                    onPress={() => handleDayPress(day)}
                    disabled={past}
                    activeOpacity={0.75}>
                    <Text
                      style={[
                        s.calCellText,
                        selected && s.calCellTextSelected,
                        past && s.calCellTextPast,
                      ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {frequency === 'custom' && customDates.length > 0 && (
              <Text style={s.customHint}>
                {customDates.length} date{customDates.length > 1 ? 's' : ''} selected
              </Text>
            )}
          </View>
        )}

        {/* Week day chips */}
        {showWeekDays && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Select Days of Week</Text>
            <View style={s.chipRow}>
              {WEEK_DAY_NAMES.map((name, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    s.weekDayChip,
                    selectedWeekDays.includes(idx) && s.weekDayChipActive,
                  ]}
                  onPress={() => toggleWeekDay(idx)}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      s.weekDayChipText,
                      selectedWeekDays.includes(idx) && s.weekDayChipTextActive,
                    ]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Monthly date grid */}
        {showMonthDates && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Select Dates of Month</Text>
            <View style={s.monthDateGrid}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                <TouchableOpacity
                  key={d}
                  style={[
                    s.monthDateCell,
                    selectedMonthDates.includes(d) && s.monthDateCellActive,
                  ]}
                  onPress={() => toggleMonthDate(d)}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      s.monthDateText,
                      selectedMonthDates.includes(d) && s.monthDateTextActive,
                    ]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Duration */}
        {showDuration && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Duration</Text>
            <View style={s.chipRow}>
              {([1, 3, 6] as (1 | 3 | 6)[]).map(d => (
                <TouchableOpacity
                  key={d}
                  style={[s.durationChip, duration === d && s.durationChipActive]}
                  onPress={() => setDuration(d)}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      s.durationChipText,
                      duration === d && s.durationChipTextActive,
                    ]}>
                    {d} Month{d > 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Time slot */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Preferred Time</Text>
          <View style={s.timeRow}>
            {TIME_SLOTS.map(slot => (
              <TouchableOpacity
                key={slot.key}
                style={[
                  s.timeCard,
                  timeSlots.includes(slot.key) && s.timeCardActive,
                ]}
                onPress={() => toggleTimeSlot(slot.key)}
                activeOpacity={0.8}>
                <Text style={s.timeEmoji}>{slot.emoji}</Text>
                <Text
                  style={[s.timeLabel, timeSlots.includes(slot.key) && s.timeLabelActive]}>
                  {slot.label}
                </Text>
                <Text style={s.timeSub}>{slot.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary card */}
        {isValid && (
          <View style={s.summaryCard}>
            <Text style={s.summaryTitle}>Booking Summary</Text>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Service</Text>
              <Text style={s.summaryValue}>
                {serviceEmoji} {serviceName}
              </Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Schedule</Text>
              <Text style={[s.summaryValue, s.summaryValueSmall]}>
                {scheduleDescription()}
              </Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Time</Text>
              <Text style={s.summaryValue}>
                {timeSlots.map(t =>
                  t === 'morning' ? '7–11 AM' : t === 'afternoon' ? '12–4 PM' : '5–8 PM',
                ).join(', ')}
              </Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Sessions</Text>
              <Text style={s.summaryValue}>{sessionCount}</Text>
            </View>
            <View style={[s.summaryRow, s.summaryRowLast]}>
              <Text style={s.summaryTotalLabel}>Estimated Total</Text>
              <Text style={s.summaryTotal}>₹{estimatedTotal.toLocaleString()}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Bottom bar */}
      <View style={s.bottomBar}>
        <TouchableOpacity
          style={[s.bookBtnWrapper, !isValid && s.bookBtnDisabled]}
          disabled={!isValid}
          activeOpacity={isValid ? 0.85 : 1}
          onPress={() =>
            navigation.navigate(ScreenNameEnum.PaymentScreen, {
              amount: estimatedTotal,
              serviceName: `${serviceEmoji} ${serviceName}`,
              scheduledTime: `${scheduleDescription()} · ${timeSlots
                .map(t => (t === 'morning' ? '7–11 AM' : t === 'afternoon' ? '12–4 PM' : '5–8 PM'))
                .join(', ')}`,
              bookingId: `BK${Date.now()}`,
            })
          }>
          <LinearGradient
            colors={isValid ? [C.purple, '#9B59D9'] : ['#ccc', '#bbb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.bookBtn}>
            <Text style={s.bookBtnText}>
              {frequency === 'once'
                ? 'Book Session →'
                : `Subscribe (${sessionCount} session${sessionCount !== 1 ? 's' : ''}) →`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: C.text,
  },

  scroll: { paddingBottom: 20, paddingTop: 12 },

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  serviceEmoji: { fontSize: 40 },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 18, fontWeight: '900', color: '#fff', marginBottom: 4 },
  servicePrice: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },

  section: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.text,
    marginBottom: 12,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  freqChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
  },
  freqChipActive: {
    backgroundColor: C.purpleL,
    borderColor: C.purple,
  },
  freqChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.sub,
  },
  freqChipTextActive: {
    color: C.purple,
  },

  // Calendar
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthNavBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.purpleL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: C.text,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: C.sub,
    paddingVertical: 4,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  calCellSelected: {
    backgroundColor: C.purple,
  },
  calCellPast: {
    opacity: 0.3,
  },
  calCellText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  calCellTextSelected: {
    color: '#fff',
    fontWeight: '900',
  },
  calCellTextPast: {
    color: C.sub,
  },
  customHint: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    color: C.purple,
    textAlign: 'center',
  },

  // Week day chips
  weekDayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
  },
  weekDayChipActive: {
    backgroundColor: C.purpleL,
    borderColor: C.purple,
  },
  weekDayChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.sub,
  },
  weekDayChipTextActive: {
    color: C.purple,
  },

  // Monthly date grid
  monthDateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthDateCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
  },
  monthDateCellActive: {
    backgroundColor: C.purple,
    borderColor: C.purple,
  },
  monthDateText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
  },
  monthDateTextActive: {
    color: '#fff',
  },

  // Duration chips
  durationChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
  },
  durationChipActive: {
    backgroundColor: C.purpleL,
    borderColor: C.purple,
  },
  durationChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.sub,
  },
  durationChipTextActive: {
    color: C.purple,
  },

  // Time slots
  timeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
  },
  timeCardActive: {
    backgroundColor: C.purpleL,
    borderColor: C.purple,
  },
  timeEmoji: { fontSize: 22, marginBottom: 4 },
  timeLabel: { fontSize: 12, fontWeight: '700', color: C.sub, marginBottom: 2 },
  timeLabelActive: { color: C.purple },
  timeSub: { fontSize: 10, color: C.sub },

  // Summary
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: C.purple,
    ...Platform.select({
      ios: {
        shadowColor: C.purple,
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 3 },
    }),
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: C.purple,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
    paddingTop: 10,
    marginTop: 4,
  },
  summaryLabel: { fontSize: 13, color: C.sub },
  summaryValue: { fontSize: 13, fontWeight: '700', color: C.text, maxWidth: '60%', textAlign: 'right' },
  summaryValueSmall: { fontSize: 12 },
  summaryTotalLabel: { fontSize: 15, fontWeight: '800', color: C.text },
  summaryTotal: { fontSize: 18, fontWeight: '900', color: C.purple },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  bookBtnWrapper: {},
  bookBtnDisabled: { opacity: 0.5 },
  bookBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
});
