import { Flex, Statistic } from 'antd'
import React from 'react'

import './MyStatistic.scss';

const MyStatistic = ({followersCount, eventsCount, shadow = false}) => {
  return (
    <Flex justify="center" align="center" gap={20} className={`${shadow ? 'shadow' : ''} my-statistic`}>
        <Statistic value={followersCount} title="Подписчики" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}/>
        <Statistic value={eventsCount} title="Всего ивентов" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}/>
    </Flex>
  )
}

export default MyStatistic;