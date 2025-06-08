import React from "react";
import { Flex, Switch, Typography } from "antd";

const { Text } = Typography;

import styles from "./MySwitch.module.scss";

const MySwitch = ({ title, checked, onChange, ...props }) => {
  return (
    <Flex align="center" gap={20} className={styles.mySwitch}>
        <div className={styles.text}>{title}</div>
        <Switch checked={checked} onChange={onChange} {...props} />
    </Flex>
  );
};

export default MySwitch;
