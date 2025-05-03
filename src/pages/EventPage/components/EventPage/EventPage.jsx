import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

import { Affix, Avatar, Button, Card, Divider, Flex, Skeleton, Spin, Typography } from "antd";
const { Title, Text } = Typography;

import { AppLayout, FollowButton, MyLoader, TicketCard } from "../../../../common/components";
import { EventList } from "../../../../modules/EventList";

import { mockSingleEventData } from "../../API/mock";
import { categoryConfig } from "../../API/caregoryStyles";

import { FaRegCalendarAlt } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { TbFaceIdError } from "react-icons/tb";
import { MdOutlineReportGmailerrorred } from "react-icons/md";

import styles from "./EventPage.module.scss";
import MyButton from "../../../../common/components/UI/Button/MyButton";
import { useGetEventById } from "../../../../common/API/services/events/hooks.api";
import { formatDate } from "../../../../common/utils/Date/formatDate";
import { formatTime, formatTimeRange } from "../../../../common/utils/Date/formatTime";
import { useGetCreatorInfoById } from "../../../../common/API/services/user/hooks.api";
import { calculateDuration } from "../../../../common/utils/Date/calculateDuration";
import { BigBanner } from "../../../../modules/BigBanner";
import TicketsAside from "../TicketsAside/TicketsAside";
import { CartProvider } from "../../context/CartContext";

export const EventPage = () => {
  const [ticketCounts, setTicketCounts] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const { id } = useParams();
  const {
    data: eventData,
    isLoading: eventLoaded,
  } = useGetEventById(id);
  console.log(eventData)

  return (
    <AppLayout>
      {eventLoaded ? (
        <MyLoader />
      ) : (
        <>
          <BigBanner data={eventData.images} type="eventPage" />
          <div className={styles.eventDetails}>
            <Flex justify="space-between" className="my-container">
              <div className={styles.eventDetails__description}>
                <Link
                  to={`/category/${eventData.category.slug}`}
                  className={styles.eventCategory}
                  style={{
                    color:
                      categoryConfig[eventData.category.slug]?.textColor ||
                      "#000",
                    background:
                      categoryConfig[eventData.category.slug]?.gradient ||
                      "#EEE",
                    backgroundImage:
                      categoryConfig[eventData.category.slug]?.gradient,
                    borderColor:
                      categoryConfig[eventData.category.slug]?.gradient,
                  }}
                >
                  {eventData.category.name}
                </Link>
                <Title level={1} className={styles.eventTitle}>
                  {eventData.name}
                </Title>
                <div className={styles.eventCreator}>
                  <div className={styles.creatorCard}>
                    <Flex justify="space-between" align="center" gap={16}>
                      <Flex align="center" gap="20px">
                        <Avatar
                          src={eventData.organizer.avatar}
                          size={64}
                          className={styles.creatorAvatar}
                        />
                        <Flex vertical gap="5px">
                          <Link
                            to={`/creator/${eventData.organizerId}`}
                            className={styles.creatorName}
                          >
                            {eventData.organizer.organizerName}
                          </Link>
                          <span className={styles.creatorFollowers}>
                            {eventData.organizer.followersCount} подписчиков
                          </span>
                        </Flex>
                      </Flex>
                      <FollowButton
                        organizerId={eventData.organizerId}
                        className={styles.followButton}
                      />
                    </Flex>
                  </div>
                </div>
                <div className={styles.date}>
                  <Title level={3} className={styles.innerTitle}>
                    Дата и время
                  </Title>
                  <Flex vertical gap="10px" className={styles.dateBody}>
                    <Flex align="center" gap="15px" className={styles.dateFull}>
                      {" "}
                      <FaRegCalendarAlt />
                      {formatTimeRange(eventData.startTime, eventData.endTime)}
                    </Flex>
                    <Flex
                      align="center"
                      gap="15px"
                      className={styles.eventLasts}
                    >
                      <MdAccessTime /> Продолжительность:{" "}
                      {calculateDuration(
                        eventData.startTime,
                        eventData.endTime
                      )}{" "}
                      часа(ов)
                    </Flex>
                  </Flex>
                </div>
                <div className={styles.location}>
                  <Title level={3} className={styles.innerTitle}>
                    Местоположение
                  </Title>
                  <Flex vertical gap="30px" className={styles.locationBody}>
                    <Flex
                      align="center"
                      gap="15px"
                      className={styles.locationAddress}
                    >
                      <FaMapLocationDot />
                      {eventData.location}
                    </Flex>
                    <div className={styles.locationMap}>
                      <YMaps>
                        <Map
                          defaultState={{
                            center: [55.751574, 37.573856], // Москва
                            zoom: 10,
                          }}
                          width="100%"
                          height="400px"
                        >
                          <Placemark geometry={[55.751574, 37.573856]} />
                        </Map>
                      </YMaps>
                    </div>
                  </Flex>
                </div>
                <div className={styles.description}>
                  <Title level={3} className={styles.innerTitle}>
                    Описание
                  </Title>
                  <div className={styles.descriptionText}>
                    {eventData.description}
                  </div>
                </div>
                <div className={styles.creatorEvents}>
                  <Title level={2} className={styles.creatorEvents__title}>
                    Больше мероприятий организатора
                  </Title>
                  <EventList type="slider" creatorId={eventData.organizerId} />
                </div>
              </div>
              <CartProvider>
                <Affix offsetTop={100}>
                  <TicketsAside eventData={eventData} />
                </Affix>
              </CartProvider>
            </Flex>
          </div>
        </>
      )}
    </AppLayout>
  );
};
