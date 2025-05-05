import React from 'react'

import { Empty, Flex, Typography } from 'antd';
const { Title } = Typography;

import './MyEmpty.scss';


const MyEmpty = ({image = Empty.PRESENTED_IMAGE_SIMPLE, title}) => {
  return (
    <Flex justify='center' align='center' className='my-empty'>
    <Empty image={image} description={
        <Title level={3}>
          {title}
        </Title>
      } />
      </Flex>
  )
}

export default MyEmpty