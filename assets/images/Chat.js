import React from 'react';
import Svg, { G, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const Chat = ({ width = 30, height = 36, color = '#000' }) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <G id="Chat">
      <Path
        id="Combined Shape"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.41277 11.159C5.87547 11.159 5.43896 10.7225 5.43896 10.1852C5.43896 9.64952 5.87547 9.21301 6.41277 9.21301C6.95008 9.21301 7.38658 9.64952 7.38658 10.1852C7.38658 10.7225 6.95008 11.159 6.41277 11.159ZM10.1985 11.159C9.66117 11.159 9.22466 10.7225 9.22466 10.1852C9.22466 9.64952 9.66117 9.21301 10.1985 9.21301C10.7358 9.21301 11.1723 9.64952 11.1723 10.1852C11.1723 10.7225 10.7358 11.159 10.1985 11.159ZM13.0105 10.1852C13.0105 10.7225 13.447 11.159 13.9843 11.159C14.5216 11.159 14.9581 10.7225 14.9581 10.1852C14.9581 9.64952 14.5216 9.21301 13.9843 9.21301C13.447 9.21301 13.0105 9.64952 13.0105 10.1852Z"
        fill={color}
      />
      <Path
        id="Stroke 7"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0165 1.66663C5.17484 1.66663 1.6665 5.62173 1.6665 10.0125C1.6665 11.4146 2.07484 12.8576 2.7915 14.1762C2.92484 14.3941 2.9415 14.6686 2.84984 14.9282L2.2915 16.7977C2.1665 17.2483 2.54984 17.5813 2.97484 17.4478L4.65817 16.9479C5.1165 16.7977 5.47484 16.9888 5.89984 17.2483C7.1165 17.9652 8.63317 18.3333 9.99984 18.3333C14.1332 18.3333 18.3332 15.1368 18.3332 9.98744C18.3332 5.54661 14.7498 1.66663 10.0165 1.66663Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <LinearGradient id="paint0_linear_239_21" x1="14.9581" y1="11.159" x2="5.3444" y2="10.3799">
        <Stop stopColor="#888BF4" />
        <Stop offset="1" stopColor="#5151C6" />
      </LinearGradient>
      <LinearGradient id="paint1_linear_239_21" x1="18.3332" y1="18.3333" x2="1.39503" y2="18.0527">
        <Stop stopColor="#888BF4" />
        <Stop offset="1" stopColor="#5151C6" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default Chat;

