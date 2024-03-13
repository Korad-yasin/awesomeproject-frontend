import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

function SendIcon({ color = '#242424', width = 20, height = 20 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <G id="Send">
        <Path
          id="Send_2"
          d="M13.8554 6.12111L8.1916 11.8227L1.56064 7.74147C0.691759 7.20657 0.867871 5.88697 1.8467 5.60287L17.5022 1.04743C18.3925 0.789782 19.2156 1.62446 18.949 2.51889L14.304 18.1582C14.013 19.1369 12.7082 19.3064 12.1809 18.4325L8.1916 11.8227"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

export default SendIcon;
