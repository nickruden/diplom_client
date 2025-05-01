import React from 'react';

import { Button as UIButton } from 'antd';
import styles from './MyButton.module.scss';

const MyButton = ({type, color, bgColor = '', disabled = false, className, children, ...props}) => {
  return (
    <UIButton type={type} disabled={disabled} style={{background: bgColor}} className={`${styles.myButton} ${color ? styles[color] : ''} ${className || ''}`} {...props} >
        {children}
    </UIButton>
  )
}

export default MyButton;