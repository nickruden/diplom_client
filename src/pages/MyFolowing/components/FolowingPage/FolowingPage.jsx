import React from "react";
import { Typography, Row, Col, Spin } from "antd";
import styles from "./FolowingPage.module.scss";
import { AppLayout, MyEmpty, MyLoader } from "../../../../common/components";
import { useGetFollowingCreatorsInfo } from "../../../../common/API/services/user/hooks.api";
import FollowerCard from "../FollowerCard/FollowerCard";
import { GiShadowFollower } from "react-icons/gi";

import { useSelector } from "react-redux";

const { Title } = Typography;

const SubscriptionsPage = () => {
  const { data: subsData, isLoading: subsDataLoading } =
    useGetFollowingCreatorsInfo();

  const followingOrganizers = useSelector(
    (state) => state.userFollowing.followingOrganizers
  );

  const followingData = Array.isArray(subsData)
    ? subsData.filter((sub) => followingOrganizers.includes(sub.id))
    : [];

  return (
    <AppLayout>
      <div className={styles.subscriptionsPage}>
        <div className="my-container">
          <Title level={2} className={styles.pageTitle}>
            Мои подписки
          </Title>
          {subsDataLoading ? (
            <MyLoader />
          ) : !followingData || followingData.length <= 0 ? (
            <MyEmpty
              title="Вы никого не отслеживаете"
              image={<GiShadowFollower size={120} />}
            />
          ) : (
            <Row gutter={[24, 30]}>
              {followingData.map((sub) => (
                <Col lg={12} key={sub.id}>
                  <FollowerCard creatorInfo={sub} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default SubscriptionsPage;
