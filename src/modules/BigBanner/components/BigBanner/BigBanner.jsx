import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { SlLocationPin } from "react-icons/sl";
import { IoCalendarOutline } from "react-icons/io5";

import { Flex, Typography } from "antd";
const { Title, Paragraph } = Typography;

import styles from "./BigBanner.module.scss";
import MyButton from "../../../../common/components/UI/Button/MyButton";
import {
  useGetEvents,
} from "../../../../common/API/services/events/hooks.api";
import MySkeleton from "../../../../common/components/Skeleton/MySkeleton";
import { formatDate, formatTime } from "../../../../common/utils/Date/formatDate";

const BigBanner = ({ data, type = "main" }) => {
  const [rows, setRows] = useState(2);

  const { data: eventsData = [], isLoading } = useGetEvents();

  const bannersData = data || eventsData;

  if (isLoading) {
    return (
      <div className={styles.bigBanner}>
        <div className="my-container">
          <MySkeleton width="100%" height="400px" />
        </div>
      </div>
    );
  }

  if (!bannersData?.length) {
    return null;
  }

  return (
    <div
      className={`${styles.bigBanner} ${
        type === "eventPage" ? styles.eventPage : type === "uploadExemple" ? styles.uploadExemple : ""
      }`}
    >
      <div className={`my-container ${styles.bigBanner__container}`}>
        <div className={styles.bigBanner__slider}>
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".bigBanner__swiper-pagination",
            }}
            modules={[Pagination, Autoplay]}
            className={styles.bigBanner__swiper}
          >
            {type === "eventPage" || type === "uploadExemple"
              ? bannersData.map((image) => {
                  return (
                    <SwiperSlide>
                      <div className={styles.bigBanner__slide}>
                        <div
                          className={styles.bigBanner__slideBg}
                          style={{
                            background: `url('${image.imageUrl}') center/cover no-repeat`,
                          }}
                        ></div>
                        <img
                          src={image.imageUrl}
                          alt=""
                          className={styles.bigBanner__img}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })
              : bannersData.map((banner) => {
                  if (banner.isPrime) {
                    return (
                      <SwiperSlide key={banner.id}>
                        <Link to={`/event/${banner.id}`}>
                          <div className={styles.bigBanner__slide}>
                            <img
                              src={
                                banner.images.find(
                                  (image) => image.isMain === 1
                                )?.imageUrl
                              }
                              alt={banner.name}
                              className={styles.bigBanner__img}
                            />
                            <Flex
                              vertical
                              justify="center"
                              className={styles.bigBanner__info}
                            >
                              <Paragraph
                                ellipsis={{ rows }}
                                className={styles.bigBanner__titleWrap}
                              >
                                <Title
                                  level={1}
                                  className={styles.bigBanner__title}
                                >
                                  {banner.name}
                                </Title>
                              </Paragraph>
                              <div className={styles.bigBanner__time}>
                                <IoCalendarOutline />{" "}
                                {formatDate(banner.activeDate)} •{" "}
                                {formatTime(banner.activeDate)}
                              </div>
                              <div className={styles.bigBanner__location}>
                                <SlLocationPin /> {banner.location}
                              </div>
                              <MyButton
                                type="primary"
                                color="yellow"
                                className={styles.bigBanner__button}
                              >
                                подробнее
                              </MyButton>
                            </Flex>
                          </div>
                        </Link>
                      </SwiperSlide>
                    );
                  }
                })}
          </Swiper>
          <div
            className={`swiper-pagination bigBanner__swiper-pagination`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BigBanner;
