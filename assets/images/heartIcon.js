import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

const HeartIcon = ({ filled }) => {
  const fillColor = filled ? 'black' : 'none'; // Change 'black' to your liked color
  return(
    <Svg width="36" height="36" viewBox="0 0 30 30" fill={fillColor}>
      <G id="ion:heart-outline">
       <Path
         id="Vector"
         d="M20.6785 4.6875C16.8746 4.6875 14.9996 8.4375 14.9996 8.4375C14.9996 8.4375 13.1246 4.6875 9.32072 4.6875C6.22931 4.6875 3.78126 7.27383 3.74962 10.36C3.68517 16.766 8.83146 21.3217 14.4723 25.1502C14.6278 25.256 14.8115 25.3126 14.9996 25.3126C15.1877 25.3126 15.3715 25.256 15.527 25.1502C21.1672 21.3217 26.3135 16.766 26.2496 10.36C26.218 7.27383 23.7699 4.6875 20.6785 4.6875Z"
         stroke="black"
         strokeWidth="1.875"
         strokeLinecap="round"
         strokeLinejoin="round"
       />
     </G>
   </Svg>
  );
  
};

export default HeartIcon;
