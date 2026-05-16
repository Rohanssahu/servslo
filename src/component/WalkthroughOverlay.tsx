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
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width: W, height: H} = Dimensions.get('window');
const PAD = 10;
const OVERLAY_COLOR = 'rgba(5,2,18,0.88)';
const ACCENT = '#6E39F7';

// Tooltip height we reserve space for (conservative — card content fits in this)
const TOOLTIP_H = 240;
const TIP_MARGIN = 14; // gap between spotlight edge and tooltip
const TIP_SIDE_PAD = 14; // tooltip left/right screen margin
const TIP_WIDTH = W - TIP_SIDE_PAD * 2;
const MIN_TOP = 48; // never closer to top than this

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
  const tooltipTranslateY = useRef(new Animated.Value(18)).current;
  const tooltipScale = useRef(new Animated.Value(0.94)).current;
  const glowOpacity = useRef(new Animated.Value(0.6)).current;
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Overlay fade in / out
  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: visible ? 1 : 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [visible, overlayOpacity]);

  // Animate tooltip + glow whenever spotlight changes
  useEffect(() => {
    if (!spotlightRect || !step) {
      return;
    }

    tooltipOpacity.setValue(0);
    tooltipTranslateY.setValue(18);
    tooltipScale.setValue(0.94);

    Animated.parallel([
      Animated.timing(tooltipOpacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(tooltipTranslateY, {
        toValue: 0,
        tension: 72,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.spring(tooltipScale, {
        toValue: 1,
        tension: 72,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow pulse around spotlight
    glowLoopRef.current?.stop();
    glowOpacity.setValue(0.6);
    glowScale.setValue(1);
    glowLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowOpacity, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(glowScale, {
            toValue: 1.014,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowOpacity, {
            toValue: 0.5,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(glowScale, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    glowLoopRef.current.start();

    return () => {
      glowLoopRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    spotlightRect?.x,
    spotlightRect?.y,
    spotlightRect?.width,
    spotlightRect?.height,
  ]);

  if (!visible) {
    return null;
  }

  const isLast = stepIndex === totalSteps - 1;
  const hasSpotlight = !!spotlightRect && !!step;
  const title = step ? (lang === 'hi' ? step.titleHi : step.title) : '';
  const desc = step ? (lang === 'hi' ? step.descriptionHi : step.description) : '';
  const progress = (stepIndex + 1) / totalSteps;

  // ── Spotlight geometry ────────────────────────────────────────────────────
  let hX = 0;
  let hY = MIN_TOP;
  let hW = W;
  let hH = 60;
  let hR = 14;

  // ── Tooltip positioning ───────────────────────────────────────────────────
  // Strategy: pick the side (above / below spotlight) that has the most room.
  // Never overlap the spotlight. Clamp hard so it never leaves the screen.
  let tooltipTop = (H - TOOLTIP_H) / 2;
  let arrowMode: 'up' | 'down' | 'none' = 'none';
  // Arrow position within the tooltip (relative to tooltip's left edge)
  let arrowInTooltip = TIP_WIDTH / 2 - 13;

  if (hasSpotlight && spotlightRect) {
    hX = Math.max(0, spotlightRect.x - PAD);
    hY = Math.max(0, spotlightRect.y - PAD);
    hW = Math.min(spotlightRect.width + PAD * 2, W - hX);
    hH = spotlightRect.height + PAD * 2;
    hR = Math.min((spotlightRect.borderRadius ?? 14) + PAD, hW / 2);

    // Spotlight center-x → arrow position within tooltip
    const spotCenterX = spotlightRect.x + spotlightRect.width / 2;
    // Tooltip starts at TIP_SIDE_PAD from screen left
    const rawArrow = spotCenterX - TIP_SIDE_PAD - 13; // 13 = half arrow width
    arrowInTooltip = Math.max(8, Math.min(rawArrow, TIP_WIDTH - 34));

    // Space available above and below the padded spotlight
    const spaceBelow = H - (hY + hH) - TIP_MARGIN - 20;
    const spaceAbove = hY - TIP_MARGIN - MIN_TOP;

    if (spaceBelow >= TOOLTIP_H) {
      // Enough room below → place below, arrow points up toward spotlight
      tooltipTop = hY + hH + TIP_MARGIN;
      arrowMode = 'up';
    } else if (spaceAbove >= TOOLTIP_H) {
      // Enough room above → place above, arrow points down toward spotlight
      tooltipTop = hY - TIP_MARGIN - TOOLTIP_H;
      arrowMode = 'down';
    } else if (spaceBelow >= spaceAbove) {
      // More room below but tight → push to bottom edge
      tooltipTop = H - TOOLTIP_H - 20;
      arrowMode = 'up';
    } else {
      // More room above but tight → push near top
      tooltipTop = MIN_TOP;
      arrowMode = 'down';
    }

    // Hard clamp — never off screen
    tooltipTop = Math.max(MIN_TOP, Math.min(tooltipTop, H - TOOLTIP_H - 16));
  }

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, {opacity: overlayOpacity}]}>
        {hasSpotlight ? (
          <>
            {/* 4 dark panels that create the transparent spotlight hole */}
            <View
              style={[s.panel, s.panelSpanH, s.panelAnchorTop, {height: hY}]}
            />
            <View
              style={[
                s.panel,
                s.panelSpanH,
                s.panelAnchorBottom,
                {top: hY + hH},
              ]}
            />
            <View
              style={[
                s.panel,
                s.panelFromLeft,
                {top: hY, width: hX, height: hH},
              ]}
            />
            <View
              style={[
                s.panel,
                s.panelFromRight,
                {top: hY, left: hX + hW, height: hH},
              ]}
            />

            {/* Invisible touch-blocker over spotlight (pass-through) */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: hY,
                left: hX,
                width: hW,
                height: hH,
              }}
            />

            {/* Animated glow ring */}
            <Animated.View
              pointerEvents="none"
              style={[
                s.glowRing,
                {
                  top: hY - 3,
                  left: hX - 3,
                  width: hW + 6,
                  height: hH + 6,
                  borderRadius: hR + 3,
                  opacity: glowOpacity,
                  transform: [{scale: glowScale}],
                },
              ]}
            />

            {/* Corner bracket accents */}
            <View
              pointerEvents="none"
              style={[s.corner, s.cornerTL, {top: hY - 5, left: hX - 5}]}
            />
            <View
              pointerEvents="none"
              style={[
                s.corner,
                s.cornerTR,
                {top: hY - 5, left: hX + hW - 16},
              ]}
            />
            <View
              pointerEvents="none"
              style={[
                s.corner,
                s.cornerBL,
                {top: hY + hH - 16, left: hX - 5},
              ]}
            />
            <View
              pointerEvents="none"
              style={[
                s.corner,
                s.cornerBR,
                {top: hY + hH - 16, left: hX + hW - 16},
              ]}
            />

            {/* ── Tooltip ──────────────────────────────────────────────── */}
            <Animated.View
              style={[
                s.tooltipWrap,
                {
                  top: tooltipTop,
                  opacity: tooltipOpacity,
                  transform: [
                    {translateY: tooltipTranslateY},
                    {scale: tooltipScale},
                  ],
                },
              ]}>
              {/* Arrow pointing UP — tooltip is below the spotlight */}
              {arrowMode === 'up' && (
                <View style={[s.arrowUp, {left: arrowInTooltip}]} />
              )}

              <LinearGradient
                colors={['#FFFFFF', '#F3EDFF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={s.card}>
                {/* Header: step dots + skip */}
                <View style={s.cardHeader}>
                  <View style={s.stepDots}>
                    {Array.from({length: totalSteps}).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          s.stepDot,
                          i === stepIndex ? s.stepDotActive : s.stepDotInactive,
                          i === stepIndex && s.stepDotExpanded,
                        ]}
                      />
                    ))}
                  </View>
                  <TouchableOpacity
                    onPress={onSkip}
                    hitSlop={{top: 14, bottom: 14, left: 18, right: 18}}>
                    <Text style={s.skipText}>
                      {lang === 'hi' ? 'छोड़ें ✕' : 'Skip ✕'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Progress bar */}
                <View style={s.progressTrack}>
                  <View
                    style={[s.progressFill, {width: `${progress * 100}%`}]}
                  />
                </View>

                {/* Emoji + title */}
                <View style={s.titleRow}>
                  <View style={s.emojiBox}>
                    <Text style={s.emoji}>{step!.emoji}</Text>
                  </View>
                  <Text style={s.titleText} numberOfLines={2}>
                    {title}
                  </Text>
                </View>

                {/* Description */}
                <Text style={s.descText}>{desc}</Text>

                {/* Next / Done button */}
                <TouchableOpacity
                  onPress={isLast ? onFinish : onNext}
                  activeOpacity={0.84}>
                  <LinearGradient
                    colors={['#7C45FF', '#5525DC']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={s.nextBtn}>
                    <Text style={s.nextText}>
                      {isLast
                        ? lang === 'hi'
                          ? '🚀 चलिए शुरू करें!'
                          : '🚀 Get Started!'
                        : lang === 'hi'
                        ? 'अगला →'
                        : 'Next →'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>

              {/* Arrow pointing DOWN — tooltip is above the spotlight */}
              {arrowMode === 'down' && (
                <View style={[s.arrowDown, {left: arrowInTooltip}]} />
              )}
            </Animated.View>
          </>
        ) : (
          /* Between steps: full dim while next measurement loads */
          <View
            style={[StyleSheet.absoluteFill, {backgroundColor: OVERLAY_COLOR}]}
          />
        )}
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  panel: {
    position: 'absolute',
    backgroundColor: OVERLAY_COLOR,
  },
  panelSpanH: {left: 0, right: 0},
  panelFromLeft: {left: 0},
  panelFromRight: {right: 0},
  panelAnchorTop: {top: 0},
  panelAnchorBottom: {bottom: 0},
  glowRing: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: '#A67CFF',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  cornerTL: {
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#fff',
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#fff',
    borderTopRightRadius: 6,
  },
  cornerBL: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#fff',
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#fff',
    borderBottomRightRadius: 6,
  },

  tooltipWrap: {
    position: 'absolute',
    left: TIP_SIDE_PAD,
    right: TIP_SIDE_PAD,
    ...Platform.select({
      ios: {
        shadowColor: '#1A0060',
        shadowOpacity: 0.28,
        shadowRadius: 28,
        shadowOffset: {width: 0, height: 12},
      },
      android: {elevation: 22},
    }),
  },

  // Arrow UP: tooltip is below spotlight, arrow sits on top edge of tooltip
  arrowUp: {
    alignSelf: 'flex-start',
    width: 0,
    height: 0,
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderBottomWidth: 11,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
    marginBottom: -1,
  },
  // Arrow DOWN: tooltip is above spotlight, arrow sits on bottom edge of tooltip
  arrowDown: {
    alignSelf: 'flex-start',
    width: 0,
    height: 0,
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderTopWidth: 11,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#F3EDFF',
    marginTop: -1,
  },

  card: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepDots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  stepDot: {
    height: 7,
    borderRadius: 4,
  },
  stepDotActive: {
    backgroundColor: ACCENT,
  },
  stepDotInactive: {
    width: 7,
    backgroundColor: '#D8C9FF',
  },
  stepDotExpanded: {
    width: 20,
  },
  stepPill: {
    backgroundColor: '#EDE0FF',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  stepPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: ACCENT,
    letterSpacing: 0.4,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ACACAC',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#EDE0FF',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: ACCENT,
    borderRadius: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 9,
  },
  emojiBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#EDE0FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {fontSize: 24},
  titleText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: -0.3,
    lineHeight: 23,
  },
  descText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  nextBtn: {
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: 'center',
  },
  nextText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.2,
  },
});
