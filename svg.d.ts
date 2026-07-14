// Matches the react-native-svg-transformer setup in metro.config.js:
// importing an .svg yields a react-native-svg component.
declare module '*.svg' {
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';

  const content: FC<SvgProps>;
  export default content;
}
