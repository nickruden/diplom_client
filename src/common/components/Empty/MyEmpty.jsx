import React from 'react'

import { Empty, Typography } from 'antd';
const { Title } = Typography;

import './MyEmpty.scss';


const MyEmpty = ({image = Empty.PRESENTED_IMAGE_SIMPLE, title}) => {
  return (
    <div className='my-empty'>
    <Empty image={image} description={
        <Title level={3}>
          {title}
        </Title>
      } />
      </div>
  )
}

export default MyEmpty