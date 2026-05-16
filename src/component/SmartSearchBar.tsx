import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isListening: boolean;
  onMicPress: () => void;
  lang: 'en' | 'hi';
  isFocused?: boolean;
  style?: object;
  inputRef?: React.RefObject<TextInput>;
};

export default function SmartSearchBar({
  value,
  onChangeText,
  onFocus,
  onBlur,
  isListening,
  onMicPress,
  lang,
  isFocused,
  style,
  inputRef,
}: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);
  const rippleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isListening) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {toValue: 1.3, duration: 550, useNativeDriver: true}),
          Animated.timing(pulseAnim, {toValue: 1, duration: 550, useNativeDriver: true}),
        ]),
      );
      pulseLoop.current.start();

      Animated.loop(
        Animated.timing(rippleAnim, {toValue: 1, duration: 1200, useNativeDriver: true}),
      ).start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
      rippleAnim.setValue(0);
    }
    return () => {
      pulseLoop.current?.stop();
    };
  }, [isListening, pulseAnim, rippleAnim]);

  const placeholder =
    lang === 'hi'
      ? 'plumber, AC repair, safai... बोलें या टाइप करें'
      : 'Search plumber, AC repair, cleaning...';

  const displayValue = isListening
    ? lang === 'hi'
      ? 'सुन रहे हैं...'
      : 'Listening...'
    : value;

  const rippleScale = rippleAnim.interpolate({inputRange: [0, 1], outputRange: [1, 2.2]});
  const rippleOpacity = rippleAnim.interpolate({inputRange: [0, 0.6, 1], outputRange: [0.4, 0.1, 0]});

  return (
    <View style={[s.row, isFocused && s.rowFocused, style]}>
      <Text style={s.searchIcon}>🔍</Text>

      <TextInput
        ref={inputRef}
        style={[s.input, isListening && s.inputListening]}
        value={displayValue}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        onFocus={onFocus}
        onBlur={onBlur}
        returnKeyType="search"
        editable={!isListening}
        autoCorrect={false}
      />

      {value.length > 0 && !isListening && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          style={s.clearWrap}>
          <View style={s.clearBtn}>
            <Text style={s.clearText}>✕</Text>
          </View>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={onMicPress}
        hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
        style={s.micWrap}
        activeOpacity={0.75}>
        {isListening && (
          <Animated.View
            style={[
              s.ripple,
              {transform: [{scale: rippleScale}], opacity: rippleOpacity},
            ]}
          />
        )}
        <Animated.View
          style={[
            s.micBtn,
            isListening && s.micBtnActive,
            {transform: [{scale: pulseAnim}]},
          ]}>
          <Text style={s.micIcon}>{isListening ? '⏹' : '🎙️'}</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const C = {
  purple: '#4d2b98',
  purpleL: '#f3eeff',
  card: '#fff',
  text: '#1a1a2e',
  border: '#efefef',
};

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.09,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 3},
      },
      android: {elevation: 4},
    }),
  },
  rowFocused: {
    borderColor: C.purple,
  },
  searchIcon: {fontSize: 18, marginRight: 8},
  input: {flex: 1, fontSize: 15, color: C.text},
  inputListening: {color: '#e53935', fontStyle: 'italic'},
  clearWrap: {marginRight: 4},
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {color: '#666', fontSize: 11, fontWeight: '700'},
  micWrap: {
    marginLeft: 6,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.purpleL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: {
    backgroundColor: '#ffebee',
  },
  micIcon: {fontSize: 17},
  ripple: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e53935',
  },
});
