import React, { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { Divider, Flex, Spin, Statistic, Tabs, Typography } from "antd";
const { Title, Paragraph } = Typography;

import { useGetCreatorInfoById } from "../../../../common/API/services/user/hooks.api";
import { useAuth } from "../../../../common/hooks/useAuth";
import { getSocialIcon } from "../../API/socialIcons";

import { FaRegEdit } from "react-icons/fa";

import { AppLayout, FollowButton, MyAvatar } from "../../../../common/components";
import { EventList } from "../../../../modules/EventList";

import styles from "./CreatorPage.module.scss";


const CreatorPage = () => {
  const { user } = useAuth();
  const [ellipsis, setEllipsis] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("events") || "upcoming";

  const handleTabChange = (key) => {
    setSearchParams({ events: key });
  };
  
  const { id } = useParams();

  const { data: creatorData, isLoading } = useGetCreatorInfoById(id);

  if (isLoading) {
    return (
    <Flex justify="center" align="center" style={{minHeight: '100vh'}} className="my-container">
      <Flex vertical align="center" gap={20}>
      <Spin size="large" />
      <Title level={4} style={{color: 'gray'}}>Подождите, подгрузка данных</Title>
      </Flex>
    </Flex>
    )
  }

  const { creatorMedias } = creatorData;

  return (
    <AppLayout>
      <div className={styles.creatorPageHeader}>
        <div
          className={styles.creatorPageHeader__bgImg}
          style={{
            background: creatorData.avatar
              ? `url(${creatorData.avatar}) center/cover`
              : "orange",
          }}
        >
          <div className="my-overlay"></div>
        </div>
        <div className={styles.creatorPageHeader__content}>
          <div className="my-container">
            <Flex
              vertical
              align="center"
              className={styles.creatorPageHeader__contentInner}
            >
              <MyAvatar
                imageSrc={creatorData.avatar}
                size={150}
                className={styles.creatorImg}
              />
              <Title level={1} className={styles.creatorName}>
                {user && user.id === creatorData.id ? (
                  <Link to={`/my-account`} className={styles.creatorNameLink}>
                    {creatorData.creatorName} <FaRegEdit size={18} />
                  </Link>
                ) : (
                  creatorData.creatorName
                )}
              </Title>
              <Flex
                justify="center"
                align="center"
                gap={40}
                className={styles.creatorInfo}
              >
                <Flex
                  justify="center"
                  align="center"
                  gap={10}
                  className={styles.stats}
                >
                  <Statistic
                    value={creatorData.followersCount}
                    title="Подписчики"
                    className={styles.statItem}
                  />
                  <Divider type="vertical" className={styles.divider} />
                  <Statistic
                    value={creatorData.eventsCount}
                    title="Всего ивентов"
                    className={styles.statItem}
                  />
                </Flex>
                <FollowButton organizerId={creatorData.id} />
              </Flex>
              <Paragraph
                ellipsis={
                  ellipsis
                    ? { rows: 3, expandable: true, symbol: "Больше" }
                    : false
                }
                className={styles.creatorPageHeader__desc}
              >
                {creatorData.creatorDesc}
              </Paragraph>
              <Flex gap="15px" className={styles.creatorPageHeader__socials}>
                {Object.entries(JSON.parse(creatorMedias || "{}")).map(
                  ([key, url]) => {
                    if (!url) return null;
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                        aria-label={key}
                      >
                        {getSocialIcon(key)}
                      </a>
                    );
                  }
                )}
              </Flex>
            </Flex>
          </div>
        </div>
      </div>
      <div className={styles.creatorPageEvents}>
        <div className="my-container">
          <Title level={2} className={styles.creatorPageEvents__title}>
            События организатора
          </Title>
          <div className={styles.creatorPageEvents__filters}>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={[
                {
                  key: "upcoming",
                  label: "Актуальные",
                },
                {
                  key: "past",
                  label: "Прошедшие",
                },
              ]}
            />
          </div>
        </div>
        <EventList creatorId={creatorData.id} filter={activeTab} />
      </div>
    </AppLayout>
  );
};

export default CreatorPage;
