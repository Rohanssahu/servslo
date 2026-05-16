import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useLanguage} from '../language/LanguageContext';

type Props = {
  scriptHi: string;
  scriptEn: string;
  /** pass true when placed on a dark/gradient header */
  light?: boolean;
  style?: object;
};

export default function SpeakerButton({scriptHi, scriptEn, light, style}: Props) {
  const {lang, toggleLang, speak, stop, isSpeaking} = useLanguage();

  const accent = light ? '#fff' : '#6E39F7';
  const bg = light ? 'rgba(255,255,255,0.22)' : '#f3eeff';
  const border = light ? 'rgba(255,255,255,0.5)' : '#6E39F7';
  const dimText = light ? 'rgba(255,255,255,0.5)' : '#bbb';

  return (
    <View style={[ss.row, style]}>
      {/* HI | EN toggle */}
      <TouchableOpacity
        onPress={toggleLang}
        activeOpacity={0.8}
        style={[ss.langPill, {backgroundColor: bg, borderColor: border}]}>
        <Text style={[ss.langOpt, {color: lang === 'hi' ? accent : dimText}]}>हि</Text>
        <Text style={[ss.sep, {color: dimText}]}>|</Text>
        <Text style={[ss.langOpt, {color: lang === 'en' ? accent : dimText}]}>EN</Text>
      </TouchableOpacity>

      {/* Speaker / Stop */}
      <TouchableOpacity
        onPress={() => (isSpeaking ? stop() : speak(scriptHi, scriptEn))}
        activeOpacity={0.8}
        style={[
          ss.speakerBtn,
          {
            backgroundColor: isSpeaking ? '#6E39F7' : bg,
            borderColor: isSpeaking ? '#6E39F7' : border,
          },
        ]}>
        <Icon
          name={isSpeaking ? 'stop-circle' : 'volume-high-outline'}
          size={18}
          color={isSpeaking ? '#fff' : accent}
        />
      </TouchableOpacity>
    </View>
  );
}

const ss = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 7},
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1.5,
    gap: 2,
  },
  langOpt: {fontSize: 12, fontWeight: '800'},
  sep: {fontSize: 11, marginHorizontal: 1},
  speakerBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});
