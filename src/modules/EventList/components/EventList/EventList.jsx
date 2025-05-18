import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "swiper/css";
import "swiper/css/navigation";
import { FaRegFaceSadTear } from "react-icons/fa6";
import { EventCard, MyEmpty } from "../../../../common/components";
import { useGetEventByCategory, useGetEventsByCreator, useGetEvents } from "../../../../common/API/services/events/hooks.api";
import { Flex } from "antd";
import MySkeleton from "../../../../common/components/Skeleton/MySkeleton";
import styles from "./EventList.module.scss";
import { useSearchParams } from "react-router-dom";

const EventList = ({ type = "main", slug = null, creatorId = null, filter = "upcoming"}) => {
  const [searchParams] = useSearchParams();

  const filters = {
    type: searchParams.get('type'),
    city: searchParams.get('city'),
    date: searchParams.get('date'),
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
    search: searchParams.get('search'),
  };

  const { data: eventsData, isLoading } = slug
    ? useGetEventByCategory(slug, filters)
    : creatorId
    ? useGetEventsByCreator(creatorId, filter)
    : useGetEvents(filters);

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
          <MyEmpty
            image={<FaRegFaceSadTear size={80} color="gray" />}
            title="Нет доступных событий"
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