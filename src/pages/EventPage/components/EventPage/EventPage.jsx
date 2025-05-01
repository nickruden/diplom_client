import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

import { Affix, Avatar, Button, Card, Divider, Flex, Skeleton, Spin, Typography } from "antd";
const { Title, Text } = Typography;

import { AppLayout, FollowButton, TicketCard } from "../../../../common/components";
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

export const EventPage = () => {
  const [ticketCounts, setTicketCounts] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const { id } = useParams();
  const {
    data: eventData,
    isLoading: eventLoaded,
    isError: eventError,
    error: eventErrorDetail,
  } = useGetEventById(id);

  const {
    data: creatorEventData,
    isLoading: creatorLoading,
    isError: creatorError,
    error: creatorErrorDetail,
  } = useGetCreatorInfoById(eventData?.organizerId);

  if (eventLoaded || creatorLoading) {
    return (
      <Flex
        justify="center"
        align="center"
        style={{ minHeight: "100vh" }}
        className="my-container"
      >
        <Flex vertical align="center" gap={20}>
          <Spin size="large" />
          <Title level={4} style={{ color: "gray" }}>
            Подождите, подгрузка данных
          </Title>
        </Flex>
      </Flex>
    );
  }

  const handleIncrement = (ticketId, price) => {
    const newCounts = {
      ...ticketCounts,
      [ticketId]: (ticketCounts[ticketId] || 0) + 1,
    };
    setTicketCounts(newCounts);
    setTotalPrice(calculateTotalPrice(newCounts));
  };

  const handleDecrement = (ticketId, price) => {
    const newCount = Math.max(0, (ticketCounts[ticketId] || 0) - 1);
    const newCounts = { ...ticketCounts, [ticketId]: newCount };
    setTicketCounts(newCounts);
    setTotalPrice(calculateTotalPrice(newCounts));
  };

  const calculateTotalPrice = (counts) => {
    return eventData.tickets.reduce((total, ticket) => {
      return total + ticket.price * (counts[ticket.id] || 0);
    }, 0);
  };

  return (
    <AppLayout>
      <BigBanner data={eventData.images} type="eventPage" />
      <div className={styles.eventDetails}>
        <Flex justify="space-between" className="my-container">
          <div className={styles.eventDetails__description}>
            <Link
              to={`/category/${eventData.category.slug}`}
              className={styles.eventCategory}
              style={{
                color:
                  categoryConfig[eventData.category.slug]?.textColor || "#000",
                background:
                  categoryConfig[eventData.category.slug]?.gradient || "#EEE",
                backgroundImage:
                  categoryConfig[eventData.category.slug]?.gradient,
                borderColor: categoryConfig[eventData.category.slug]?.gradient,
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
                      src={creatorEventData.avatar}
                      size={64}
                      className={styles.creatorAvatar}
                    />
                    <Flex vertical gap="5px">
                      <Link
                        to={`/creator/${creatorEventData.id}`}
                        className={styles.creatorName}
                      >
                        {creatorEventData.creatorName}
                      </Link>
                      <span className={styles.creatorFollowers}>
                        {creatorEventData.followersCount} подписчиков
                      </span>
                    </Flex>
                  </Flex>
                  <FollowButton organizerId={creatorEventData.id} className={styles.followButton} />
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
                <Flex align="center" gap="15px" className={styles.eventLasts}>
                  <MdAccessTime /> Продолжительность:{" "}
                  {calculateDuration(eventData.startTime, eventData.endTime)}{" "}
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
              <EventList type="slider" creatorId={creatorEventData.id} />
            </div>
          </div>
          <div className={styles.eventDetails__aside}>
            <Affix offsetTop={100}>
              <Card className={styles.stickyCard}>
                <div className={styles.ticketsContainer}>
                  {eventData.tickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      count={ticketCounts[ticket.id] || 0}
                      onIncrement={() =>
                        handleIncrement(ticket.id, ticket.price)
                      }
                      onDecrement={() =>
                        handleDecrement(ticket.id, ticket.price)
                      }
                    />
                  ))}
                </div>
                <Flex vertical gap="12px" className={styles.cardInfo}>
                  <div className={styles.totalCount}>
                    Общая сумма: {totalPrice}₽
                  </div>
                  <MyButton
                    type="primary"
                    color="orange"
                    block
                    size="large"
                    className={styles.buyButton}
                    disabled={totalPrice <= 0}
                  >
                    Купить билеты
                  </MyButton>

                  <Flex
                    justify="center"
                    align="center"
                    gap="4px"
                    className={styles.actionButtons}
                  >
                    <MyButton
                      type="text"
                      icon={<CiHeart />}
                      className={styles.actionButton}
                    >
                      Сохранить
                    </MyButton>
                    <Divider type="vertical" className={styles.divider} />
                    <MyButton
                      type="text"
                      icon={<MdOutlineReportGmailerrorred />}
                      className={styles.actionButton}
                    >
                      Пожаловаться
                    </MyButton>
                  </Flex>
                </Flex>
              </Card>
            </Affix>
          </div>
        </Flex>
      </div>
    </AppLayout>
  );
};
