import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width: W, height: H} = Dimensions.get('window');
const PAD = 10;
const OVERLAY = 'rgba(8,4,25,0.83)';

export interface SpotlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
}

export interface WalkthroughStepConfig {
  emoji: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  tooltipBelow: boolean;
}

interface Props {
  visible: boolean;
  spotlightRect: SpotlightRect | null;
  step: WalkthroughStepConfig | null;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onFinish: () => void;
  onSkip: () => void;
  lang: 'en' | 'hi';
}

export default function WalkthroughOverlay({
  visible,
  spotlightRect,
  step,
  stepIndex,
  totalSteps,
  onNext,
  onFinish,
  onSkip,
  lang,
}: Props) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const tooltipTranslate = useRef(new Animated.Value(28)).current;
  const borderPulse = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.5)).current;
  const glowLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Fade overlay in/out
  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: visible ? 1 : 0,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [visible, overlayOpacity]);

  // Animate tooltip + glow on each new spotlight rect
  useEffect(() => {
    if (!spotlightRect || !step) return;

    tooltipOpacity.setValue(0);
    tooltipTranslate.setValue(28);

    Animated.parallel([
      Animated.timing(tooltipOpacity, {toValue: 1, duration: 300, useNativeDriver: true}),
      Animated.spring(tooltipTranslate, {
        toValue: 0,
        tension: 65,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();

    glowLoopRef.current?.stop();
    glowOpacity.setValue(0.5);
    glowLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {toValue: 1, duration: 850, useNativeDriver: true}),
        Animated.timing(glowOpacity, {toValue: 0.45, duration: 850, useNativeDriver: true}),
      ]),
    );
    glowLoopRef.current.start();

    pulseLoopRef.current?.stop();
    borderPulse.setValue(1);
    pulseLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(borderPulse, {toValue: 1.016, duration: 900, useNativeDriver: true}),
        Animated.timing(borderPulse, {toValue: 1, duration: 900, useNativeDriver: true}),
      ]),
    );
    pulseLoopRef.current.start();

    return () => {
      glowLoopRef.current?.stop();
      pulseLoopRef.current?.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotlightRect?.x, spotlightRect?.y, spotlightRect?.width]);

  if (!visible) return null;

  const isLast = stepIndex === totalSteps - 1;
  const hasSpotlight = !!spotlightRect && !!step;
  const title = step ? (lang === 'hi' ? step.titleHi : step.title) : '';
  const description = step ? (lang === 'hi' ? step.descriptionHi : step.description) : '';
  const stepLabel = lang === 'hi' ? `${stepIndex + 1} / ${totalSteps}` : `${stepIndex + 1} of ${totalSteps}`;

  // Spotlight geometry
  let hX = 0, hY = 0, hW = W, hH = 80, hR = 14;
  let tooltipTop = H / 2 - 100;

  if (hasSpotlight && spotlightRect) {
    hX = Math.max(0, spotlightRect.x - PAD);
    hY = Math.max(0, spotlightRect.y - PAD);
    hW = Math.min(spotlightRect.width + PAD * 2, W - hX);
    hH = spotlightRect.height + PAD * 2;
    hR = (spotlightRect.borderRadius ?? 14) + PAD;

    const TOOLTIP_EST_H = 220;
    const MARGIN = 18;
    const belowY = hY + hH + MARGIN;
    const aboveY = hY - MARGIN - TOOLTIP_EST_H;

    if (step!.tooltipBelow && belowY + TOOLTIP_EST_H < H - 16) {
      tooltipTop = belowY;
    } else {
      tooltipTop = Math.max(aboveY, 16);
    }
  }

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, {opacity: overlayOpacity}]}>
        {hasSpotlight ? (
          <>
            {/* 4 dark panels create the spotlight cutout */}
            <View style={[s.panel, {top: 0, left: 0, right: 0, height: hY}]} />
            <View style={[s.panel, {top: hY + hH, left: 0, right: 0, bottom: 0}]} />
            <View style={[s.panel, {top: hY, left: 0, width: hX, height: hH}]} />
            <View style={[s.panel, {top: hY, left: hX + hW, right: 0, height: hH}]} />

            {/* Transparent touch blocker over spotlight area */}
            <View
              style={{
                position: 'absolute',
                top: hY,
                left: hX,
                width: hW,
                height: hH,
              }}
            />

            {/* Animated glow border */}
            <Animated.View
              style={[
                s.glowBorder,
                {
                  top: hY - 2,
                  left: hX - 2,
                  width: hW + 4,
                  height: hH + 4,
                  borderRadius: hR + 2,
                  opacity: glowOpacity,
                  transform: [{scale: borderPulse}],
                },
              ]}
              pointerEvents="none"
            />

            {/* Corner brackets */}
            <View
              style={[s.corner, s.cornerTL, {top: hY - 5, left: hX - 5}]}
              pointerEvents="none"
            />
            <View
              style={[s.corner, s.cornerTR, {top: hY - 5, left: hX + hW - 13}]}
              pointerEvents="none"
            />
            <View
              style={[s.corner, s.cornerBL, {top: hY + hH - 13, left: hX - 5}]}
              pointerEvents="none"
            />
            <View
              style={[s.corner, s.cornerBR, {top: hY + hH - 13, left: hX + hW - 13}]}
              pointerEvents="none"
            />

            {/* Tooltip card — rendered last so it receives touches above panels */}
            <Animated.View
              style={[
                s.tooltipWrap,
                {
                  top: tooltipTop,
                  opacity: tooltipOpacity,
                  transform: [{translateY: tooltipTranslate}],
                },
              ]}>
              <LinearGradient
                colors={['#FFFFFF', '#F7F2FF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={s.tooltipGrad}>
                {/* Header: step counter + skip */}
                <View style={s.tipHeader}>
                  <Text style={s.stepCounter}>{stepLabel}</Text>
                  <TouchableOpacity
                    onPress={onSkip}
                    hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
                    <Text style={s.skipText}>
                      {lang === 'hi' ? 'छोड़ें' : 'Skip'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Progress dots */}
                <View style={s.dotsRow}>
                  {Array.from({length: totalSteps}).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        s.dot,
                        i < stepIndex && s.dotDone,
                        i === stepIndex && s.dotActive,
                      ]}
                    />
                  ))}
                </View>

                {/* Emoji + title */}
                <View style={s.titleRow}>
                  <Text style={s.emoji}>{step!.emoji}</Text>
                  <Text style={s.titleText} numberOfLines={1}>
                    {title}
                  </Text>
                </View>

                {/* Description */}
                <Text style={s.descText}>{description}</Text>

                {/* Next / Done button */}
                <TouchableOpacity
                  onPress={isLast ? onFinish : onNext}
                  activeOpacity={0.85}>
                  <LinearGradient
                    colors={['#6E39F7', '#A67CFF']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={s.nextBtn}>
                    <Text style={s.nextText}>
                      {isLast
                        ? lang === 'hi'
                          ? 'चलिए शुरू करें! 🚀'
                          : "Let's Go! 🚀"
                        : lang === 'hi'
                        ? 'अगला →'
                        : 'Next →'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          </>
        ) : (
          /* Full dark screen between step transitions */
          <View style={[StyleSheet.absoluteFill, {backgroundColor: OVERLAY}]} />
        )}
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  panel: {
    position: 'absolute',
    backgroundColor: OVERLAY,
  },
  glowBorder: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: '#A67CFF',
  },
  corner: {
    position: 'absolute',
    width: 18,
    height: 18,
  },
  cornerTL: {
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#fff',
    borderTopLeftRadius: 5,
  },
  cornerTR: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#fff',
    borderTopRightRadius: 5,
  },
  cornerBL: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#fff',
    borderBottomLeftRadius: 5,
  },
  cornerBR: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#fff',
    borderBottomRightRadius: 5,
  },
  tooltipWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 22,
    ...Platform.select({
      ios: {
        shadowColor: '#2C0E80',
        shadowOpacity: 0.28,
        shadowRadius: 24,
        shadowOffset: {width: 0, height: 10},
      },
      android: {elevation: 20},
    }),
  },
  tooltipGrad: {
    borderRadius: 22,
    padding: 22,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9B72FF',
    letterSpacing: 0.6,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#BBAACC',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0D4FF',
  },
  dotDone: {
    backgroundColor: '#C4A8FF',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#6E39F7',
    borderRadius: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 9,
  },
  emoji: {fontSize: 28},
  titleText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1a1a2e',
    flex: 1,
    letterSpacing: -0.2,
  },
  descText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  nextBtn: {
    borderRadius: 13,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.2,
  },
});
