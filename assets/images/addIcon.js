import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

function AddIcon({ color = '#230B34', width = 30, height = 30 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 30 30" fill={color}>
      <G id="carbon:add-filled">
        <Path
          id="Vector"
          d="M15 1.875C11.532 1.91684 8.21789 3.31308 5.76549 5.76549C3.31308 8.21789 1.91684 11.532 1.875 15C1.91684 18.468 3.31308 21.7821 5.76549 24.2345C8.21789 26.6869 11.532 28.0832 15 28.125C18.468 28.0832 21.7821 26.6869 24.2345 24.2345C26.6869 21.7821 28.0832 18.468 28.125 15C28.0832 11.532 26.6869 8.21789 24.2345 5.76549C21.7821 3.31308 18.468 1.91684 15 1.875ZM22.5 15.9375H15.9375V22.5H14.0625V15.9375H7.5V14.0625H14.0625V7.5H15.9375V14.0625H22.5V15.9375Z"
          fill={color}
          fill-opacity="0.75"
        />
      </G>
    </Svg>
  );
}

export default AddIcon;
