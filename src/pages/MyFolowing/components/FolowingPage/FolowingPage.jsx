import React from 'react';
import { Typography, Row, Col, Spin} from 'antd';
import './FolowingPage.module.scss';
import { AppLayout } from '../../../../common/components';
import { useGetFollowingCreatorsInfo } from '../../../../common/API/services/user/hooks.api';
import FollowerCard from '../FollowerCard/FollowerCard';
import { useSelector } from 'react-redux';

const { Title } = Typography;

const SubscriptionsPage = () => {
// Вызов хука на каждом рендере
const { data: subsData, isLoading, error } = useGetFollowingCreatorsInfo();

const followingOrganizers = useSelector((state) => state.userFollowing.followingOrganizers);

// Проверка на массив и фильтрация данных
const followingData = Array.isArray(subsData) ? subsData.filter(sub => followingOrganizers.includes(sub.id)) : [];

// Обработка состояния загрузки
if (isLoading) {
  return (
    <div className="my-container" style={{ textAlign: 'center', marginTop: 80 }}>
      <Spin size="large" />
      <Title level={3} style={{ marginTop: 16 }}>Загрузка данных</Title>
    </div>
  );
}

  return (
    <AppLayout>
        <div className="subscriptionsPage" style={{ padding: '40px 0px'}}>
      <div className="my-container">
        <Title level={2} style={{ marginBottom: 24 }}>Мои подписки</Title>
        <Row gutter={[24, 30]}>
          {followingData.map((sub) => (
            <Col lg={12} key={sub.id}>
              <FollowerCard creatorInfo={sub} />
            </Col>
          ))}
        </Row>
      </div>
      </div>
    </AppLayout>
  );
};

export default SubscriptionsPage;
