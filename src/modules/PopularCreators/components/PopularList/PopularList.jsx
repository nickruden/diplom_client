import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { LeftOutlined, LoadingOutlined, RightOutlined } from "@ant-design/icons";

import { Flex, Typography } from "antd";
const { Title } = Typography;

import styles from "./PopularList.module.scss";
import { PopularCard } from "../../../../common/components";
import { useGetCreatorsInfo } from "../../../../common/API/services/user/hooks.api";
import MySkeleton from "../../../../common/components/Skeleton/MySkeleton";

const PopularList = () => {
  const { data: creatorsData, isLoading } = useGetCreatorsInfo();

  return (
    <div className={styles.popularList}>
      <div className="my-container">
        <Title level={2} className={styles.popularList__title}>
          Стоит подписаться
        </Title>
        {isLoading ? (
          <Flex gap="30px">
            {[...Array(6)].map((_, i) => (
              <MySkeleton width="16%" height="200px" />
            ))}
          </Flex>
        ) : (
          <div className={styles.slider}>
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={6}
              navigation={{
                nextEl: `.swiper-button-next`,
                prevEl: `.swiper-button-prev`,
              }}
              className={styles.popularList__swiper}
            >
              {creatorsData?.map((dataItem) => (
                <SwiperSlide key={dataItem.id} className={styles.slide}>
                  <PopularCard data={dataItem} className={styles.popularCard} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className={`swiper-button-prev ${styles.swiperNavButtonPrev}`}>
              <LeftOutlined />
            </div>
            <div className={`swiper-button-next ${styles.swiperNavButtonNext}`}>
              <RightOutlined />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularList;