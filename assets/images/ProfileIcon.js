import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

function ProfileIcon({ color, width, height }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 26 34" fill={color}>
      <G id="Profile">
        <Path 
          id="Stroke 1" 
          fill-rule="evenodd" 
          clip-rule="evenodd" 
          d="M12.9747 22.577C6.52869 22.577 1.02393 23.5516 1.02393 27.4547C1.02393 31.3579 6.49377 32.3674 12.9747 32.3674C19.4208 32.3674 24.9239 31.3913 24.9239 27.4897C24.9239 23.5881 19.4557 22.577 12.9747 22.577Z" 
          stroke={color} 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        />
        <Path 
          id="Stroke 3" 
          fill-rule="evenodd" 
          clip-rule="evenodd" 
          d="M12.9748 17.0098C17.205 17.0098 20.6335 13.5797 20.6335 9.34953C20.6335 5.11937 17.205 1.6908 12.9748 1.6908C8.74466 1.6908 5.3145 5.11937 5.3145 9.34953C5.30021 13.5654 8.70656 16.9956 12.9208 17.0098H12.9748Z" 
          stroke={color} 
          stroke-width="1.42857" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        />
      </G>
    </Svg>
  );
}

export default ProfileIcon;
