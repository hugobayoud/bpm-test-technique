import { Fragment } from 'react';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 104;
const STROKE_WIDTH = 11;
const RING_GAP = 3;
const CENTER = SIZE / 2;
const TRACK_OPACITY = 0.25;

export type ActivityRingsProps = {
  // Outermost ring first; sweep is the filled fraction of the circle (0..1).
  rings: Array<{ color: string; sweep: number }>;
};

// Apple-Watch-style concentric rings: each ring fills clockwise from
// 12 o'clock over a muted track of its own color.
export function ActivityRings({ rings }: ActivityRingsProps) {
  return (
    <Svg height={SIZE} width={SIZE}>
      {rings.map((ring, index) => {
        const radius =
          (SIZE - STROKE_WIDTH) / 2 - index * (STROKE_WIDTH + RING_GAP);
        const circumference = 2 * Math.PI * radius;

        return (
          // Positional colors are unique, so the color doubles as the key.
          <Fragment key={ring.color}>
            <Circle
              cx={CENTER}
              cy={CENTER}
              fill="none"
              r={radius}
              stroke={ring.color}
              strokeOpacity={TRACK_OPACITY}
              strokeWidth={STROKE_WIDTH}
            />
            <Circle
              cx={CENTER}
              cy={CENTER}
              fill="none"
              r={radius}
              stroke={ring.color}
              strokeDasharray={`${circumference * ring.sweep} ${circumference}`}
              strokeLinecap="round"
              strokeWidth={STROKE_WIDTH}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
            />
          </Fragment>
        );
      })}
    </Svg>
  );
}
