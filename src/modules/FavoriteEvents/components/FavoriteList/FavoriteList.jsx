import React from "react";
import { Typography, Space } from "antd";
import styles from "./FavoriteList.module.scss";
import FavoriteCard from "../FavoriteCard/FavoriteCard";
import { useGetFavoriteEventsInfo } from "../../../../common/API/services/events/hooks.api";
import { MyEmpty, MyLoader } from "../../../../common/components";
import { IoHeartDislikeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";


const { Title } = Typography;

const FavoriteList = () => {
  const {
    data: favoriteEventsData,
    isLoading: favoriteEventsDataLoading,
    error: favoriteEventsErrorLoading,
  } = useGetFavoriteEventsInfo();
  const favoriteEvents = useSelector(
    (state) => state.userFavoriteEvents.favoriteEvents
  );

  const favoriteData = Array.isArray(favoriteEventsData)
    ? favoriteEventsData.filter((sub) => favoriteEvents.includes(sub.id))
    : [];

  return (
    <div className={styles.favoritesPage}>
      <div className="my-container">
        <Title level={2} className={styles.pageTitle}>
          Избранное
        </Title>
        {favoriteEventsDataLoading ? (
          <MyLoader />
        ) : favoriteData.length === 0 || favoriteEventsErrorLoading?.response?.data?.message === 'NO_FAVORITE_EVENTS' ? (
          <MyEmpty
            title="У вас нет избранных мероприятий"
            image={<IoHeartDislikeOutline size={120} />}
          />
        ) : (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {favoriteData.map((event) => (
              <FavoriteCard key={event.id} event={event} />
            ))}
          </Space>
        )}
      </div>
    </div>
  );
};

export default FavoriteList;
