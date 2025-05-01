import React from 'react';
import { Skeleton } from 'antd';

import './MySkeleton.scss';

const MySkeleton = ({ width, height}) => {

  return (
    <Skeleton.Input 
      active 
      style={{ 
        width, 
        height,
        display: 'block' 
      }} 
    />
  );
};

export default MySkeleton;