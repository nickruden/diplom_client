import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { LeftOutlined, RightOutlined, LoadingOutlined } from "@ant-design/icons";
import "swiper/css";
import "swiper/css/navigation";
import { FaRegFaceSadTear } from "react-icons/fa6";

import { EventCard } from "../../../../common/components";
import { useGetEventByCategory, useGetEventsByCreator, useGetEvents } from "../../../../common/API/services/events/hooks.api";
import { Card, Empty, Flex, Spin, Typography } from "antd";
import styles from "./EventList.module.scss";
import MySkeleton from "../../../../common/components/Skeleton/MySkeleton";

const EventList = ({ type = "main", slug = null, creatorId = null, filter = "upcoming"}) => {
  const { data: eventsData, isLoading } = slug
    ? useGetEventByCategory(slug)
    : creatorId
    ? useGetEventsByCreator(creatorId, filter)
    : useGetEvents();

  if (isLoading) {
    return (
      <div className={styles.eventList}>
        <div className="my-container">
          <Flex gap="30px" wrap className={styles.eventCards}>
          {[...Array(4)].map((_, i) => (
            <div className={styles.eventCard}>
              <MySkeleton width="100%" height="250px" />
            </div>
          ))}
          </Flex>
        </div>
      </div>
    );
  }

  if (!eventsData?.length) {
    return (
      <div className={styles.eventList} style={{paddingBottom: "40px"}}>
        <div className="my-container">
          <Empty
            image={<FaRegFaceSadTear size={80} color="gray" />}
            description="Нет доступных событий"
            style={{fontSize: '20px'}}
          />
        </div>
      </div>
    );
  }

  if (type === "slider") {
    return (
      <div className={styles.eventSlider}>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          navigation={{
            nextEl: ".event-slider__swiperButtonNext",
            prevEl: ".event-slider__swiperButtonPrev",
          }}
          className={styles.eventSwiper}
        >
          {eventsData.map((event) => (
            <SwiperSlide key={event.id} className={styles.eventSlide}>
              <EventCard data={event} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={`swiperButtonPrev event-slider__swiperButtonPrev ${styles.swiperNavButtonPrev}`}>
          <LeftOutlined />
        </div>
        <div className={`swiperButtonNext event-slider__swiperButtonNext ${styles.swiperNavButtonNext}`}>
          <RightOutlined />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.eventList}>
      <div className="my-container">
        <Flex gap="30px" wrap className={styles.eventCards}>
          {eventsData.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <EventCard data={event} />
            </div>
          ))}
        </Flex>
      </div>
    </div>
  );
};

export default EventList;