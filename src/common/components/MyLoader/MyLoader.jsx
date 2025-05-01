import React from 'react'
import { Flex, Spin, Typography } from 'antd'

const { Title } = Typography;

import styles from './MyLoader.module.scss';


const MyLoader = () => {
  return (
    <Flex justify="center" align="center" className={styles.loader}>
        <Flex vertical align="center" gap={20}>
            <Spin size="large" />
            <Title level={4} className={styles.loaderTitle}>Подождите, подгрузка данных</Title>
        </Flex>
  </Flex>
  )
}

export default MyLoader