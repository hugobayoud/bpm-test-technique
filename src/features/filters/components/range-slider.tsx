import { useEffect, useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  PanResponder,
  type PanResponderInstance,
  StyleSheet,
  View,
} from 'react-native';

import { COLORS } from '@/utils/colors';

const THUMB_SIZE = 26;
const TRACK_HEIGHT = 4;
const SLIDER_HEIGHT = 40;
// Kept between the two thumbs so they never fully overlap.
const THUMB_GAP = 1;

type SliderRange = { min: number; max: number };

export type RangeSliderProps = {
  domain: SliderRange;
  // Lower-thumb value. Omitted → single-thumb slider: the lower bound stays
  // frozen at domain.min (the distance Filtre).
  min?: number;
  max: number;
  minThumbLabel?: string;
  maxThumbLabel: string;
  // Every drag move, with values already rounded and clamped — live display.
  onChange: (next: SliderRange) => void;
  // End of the drag gesture: the commit hook.
  onCommit: (next: SliderRange) => void;
};

// Pure-JS slider (PanResponder), no native dependency: stays Expo Go
// compatible. Controlled component: the dragged value round-trips through
// onChange/props on every move.
export function RangeSlider({
  domain,
  min,
  max,
  minThumbLabel,
  maxThumbLabel,
  onChange,
  onCommit,
}: RangeSliderProps) {
  const hasMinThumb = min !== undefined;
  const shownMin = min ?? domain.min;

  const [trackWidth, setTrackWidth] = useState(0);

  // The responders are created once and read everything through refs, synced
  // after each render — their handlers never see stale values.
  const propsRef = useRef({ domain, min: shownMin, max, onChange, onCommit });
  const usableWidthRef = useRef(1);
  const liveRef = useRef<SliderRange>({ min: shownMin, max });
  const dragStartRef = useRef(0);

  useEffect(() => {
    propsRef.current = { domain, min: shownMin, max, onChange, onCommit };
  });

  const createThumbResponder = (thumb: 'min' | 'max') =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // Keep the gesture when the surrounding ScrollView asks it back.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        const { min: currentMin, max: currentMax } = propsRef.current;
        liveRef.current = { min: currentMin, max: currentMax };
        dragStartRef.current = thumb === 'min' ? currentMin : currentMax;
      },
      onPanResponderMove: (_event, gesture) => {
        const { domain: currentDomain, onChange: change } = propsRef.current;
        const span = currentDomain.max - currentDomain.min;
        const dragged = (gesture.dx / usableWidthRef.current) * span;
        const value = Math.round(dragStartRef.current + dragged);
        const current = liveRef.current;
        const next: SliderRange =
          thumb === 'min'
            ? {
                min: clamp(value, currentDomain.min, current.max - THUMB_GAP),
                max: current.max,
              }
            : {
                min: current.min,
                max: clamp(
                  value,
                  hasMinThumb ? current.min + THUMB_GAP : currentDomain.min,
                  currentDomain.max,
                ),
              };
        if (next.min === current.min && next.max === current.max) {
          return;
        }
        liveRef.current = next;
        change(next);
      },
      onPanResponderRelease: () => propsRef.current.onCommit(liveRef.current),
      onPanResponderTerminate: () => propsRef.current.onCommit(liveRef.current),
    });

  // Lazy init: built a single time, never recreated across renders.
  const respondersRef = useRef<{
    min: PanResponderInstance | null;
    max: PanResponderInstance;
  } | null>(null);
  if (respondersRef.current === null) {
    respondersRef.current = {
      min: hasMinThumb ? createThumbResponder('min') : null,
      max: createThumbResponder('max'),
    };
  }
  const responders = respondersRef.current;

  const onSliderLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTrackWidth(width);
    usableWidthRef.current = Math.max(1, width - THUMB_SIZE);
  };

  // Thumb centers travel on the track inset by half a thumb on each side.
  const usableWidth = Math.max(1, trackWidth - THUMB_SIZE);
  const toX = (value: number) =>
    ((value - domain.min) / (domain.max - domain.min)) * usableWidth;

  return (
    <View onLayout={onSliderLayout} style={styles.container}>
      <View style={styles.track}>
        <View
          style={[
            styles.activeTrack,
            { left: toX(shownMin), width: toX(max) - toX(shownMin) },
          ]}
        />
      </View>
      {responders.min && (
        <View
          accessible
          accessibilityLabel={minThumbLabel}
          accessibilityRole="adjustable"
          accessibilityValue={{
            min: domain.min,
            max: domain.max,
            now: shownMin,
          }}
          hitSlop={12}
          style={[styles.thumb, { left: toX(shownMin) }]}
          {...responders.min.panHandlers}
        />
      )}
      <View
        accessible
        accessibilityLabel={maxThumbLabel}
        accessibilityRole="adjustable"
        accessibilityValue={{ min: domain.min, max: domain.max, now: max }}
        hitSlop={12}
        style={[styles.thumb, { left: toX(max) }]}
        {...responders.max.panHandlers}
      />
    </View>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const styles = StyleSheet.create({
  container: {
    height: SLIDER_HEIGHT,
    justifyContent: 'center',
  },
  track: {
    marginHorizontal: THUMB_SIZE / 2,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: COLORS.strokeStrong,
  },
  activeTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: COLORS.primary,
  },
  thumb: {
    position: 'absolute',
    top: (SLIDER_HEIGHT - THUMB_SIZE) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: COLORS.fill,
  },
});
