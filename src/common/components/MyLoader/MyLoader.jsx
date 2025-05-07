import React from 'react'
import { Flex, Spin, Typography } from 'antd'

const { Title } = Typography;

import styles from './MyLoader.module.scss';


const MyLoader = ({title = "Подождите, подгрузка данных", ...props}) => {
  return (
    <Flex justify="center" align="center" className={styles.loader} {...props}>
        <Flex vertical align="center" gap={20}>
            <Spin size="large" />
            <Title level={4} className={styles.loaderTitle}>{title}</Title>
        </Flex>
  </Flex>
  )
}

export default MyLoader