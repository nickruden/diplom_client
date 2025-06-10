import React, { useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Affix, Avatar, Divider, Flex, Typography } from "antd";
const { Title } = Typography;

import { categoryConfig } from "../../API/caregoryStyles";

import { FaRegCalendarAlt, FaRegSadTear } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import { BsCashCoin } from "react-icons/bs";

import {
  useEditEvent,
  useGetEventById,
} from "../../../../common/API/services/events/hooks.api";
import { calculateDuration } from "../../../../common/utils/Date/calculateDuration";
import { useAuth } from "../../../../common/hooks/useAuth";
import {
  formatDate,
  formatTimeRange,
} from "../../../../common/utils/Date/formatDate";

import {
  AppLayout,
  FollowButton,
  MyEmpty,
  MyLoader,
  MyLocationMap,
  MySkeleton,
  TicketCard,
} from "../../../../common/components";

import { EventList } from "../../../../modules/EventList";
import { BigBanner } from "../../../../modules/BigBanner";

import { CartProvider, useCart } from "../../context/CartContext";

import TicketsAside from "../TicketsAside/TicketsAside";

import styles from "./EventPage.module.scss";
import MyButton from "../../../../common/components/UI/Button/MyButton";
import { CiEdit } from "react-icons/ci";
import { useGetTicketsByEvent } from "../../../../common/API/services/tickets/hooks.api";
import { groupTicketsByValidity } from "../../utils/groupTicketsByDate";

export const EventPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const refTickets = useRef(null);
  const { ticketCounts, increment, decrement } = useCart();

  const {
    data: eventData,
    isLoading: eventLoaded,
    isSuccess: eventSuccess,
  } = useGetEventById(id);

  const { data: ticketsData, isLoading: ticketsLoading } =
    useGetTicketsByEvent(id);

  const groupedTickets = useMemo(() => {
    return groupTicketsByValidity(ticketsData?.tickets || []);
  }, [ticketsData]);

  console.log(ticketsData)

  const { mutate: updateEventViews } = useEditEvent();
  const isMultiDayEvent = formatDate(eventData?.startTime, { noNormalize: true, }) !== formatDate(eventData?.endTime, { noNormalize: true, }) ? true : false;

  useEffect(() => {
    if (eventSuccess && user?.id !== eventData?.organizerId) {
      const updatedViews = Number(eventData.viewsEvent) + 1;

      updateEventViews({
        id: id,
        data: { viewsEvent: updatedViews },
      });
    }
  }, [eventSuccess]);

  return (
    <AppLayout>
      {eventLoaded ? (
        <MyLoader />
      ) : eventData.length === 0 || !eventData ? (
        <MyEmpty
          title="Данные потерялись, но мы обязательно их найдём"
          image={<FaRegSadTear size={120} />}
        />
      ) : eventData.status === "Черновик" && user?.id !== eventData.organizerId ? (
        <MyEmpty
          title="Пользователь снял с публикации данное мероприятие"
          image={<FaRegSadTear size={120} />}
        />
      ) : (
        <>
{eventData.status === "Завершено" && (
            <Affix offsetTop={80}>
              <div
                style={{
                  backgroundColor: "#fff3cd",
                  padding: "12px 24px",
                  textAlign: "center",
                  borderBottom: "1px solid #ffeeba",
                  position: "relative",
                  zIndex: 1000,
                }}
              >
                <strong>Мероприятие завершено</strong>
              </div>
            </Affix>
          )}
          <BigBanner data={eventData.images} type="eventPage" />
          <div className={styles.eventDetails}>
            <Flex justify="space-between" className="my-container">
              <div className={styles.eventDetails__description}>
                <Flex gap={30}>
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
                </Flex>
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
                      {formatTimeRange(eventData.startTime, eventData.endTime, {
                        showWeekday: true,
                        noNormalize: true,
                      })}
                    </Flex>
                    {!isMultiDayEvent ?
                    <Flex
                      align="center"
                      gap="15px"
                      className={styles.eventLasts}
                    >
                      <MdAccessTime /> Продолжительность:{" "}
                      {calculateDuration(
                        eventData.startTime,
                        eventData.endTime
                      )}
                    </Flex> : ""}
                  </Flex>
                </div>
                <div className={styles.refound}>
                  <Title level={3} className={styles.innerTitle}>
                    Политика возврата билетов
                  </Title>
                  <Flex className={styles.refoundBody}>
                    {!eventData.refundDateCount ? (
                      <Flex
                        align="center"
                        gap="15px"
                        className={styles.refoundText}
                        style={{ color: "red" }}
                      >
                        {" "}
                        <BsCashCoin /> Организатор запретил возврат средств
                      </Flex>
                    ) : (
                      <Flex
                        align="center"
                        gap="15px"
                        className={styles.refoundText}
                      >
                        {" "}
                        <BsCashCoin /> Вернуть средства можно за {" "}
                        {eventData.refundDateCount} дня\дней до начала действия билета
                      </Flex>
                    )}
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
                    {eventData.location === "Онлайн" ? (
                      ""
                    ) : (
                      <div className={styles.locationMap}>
                        <MyLocationMap
                          location={eventData.location}
                          height="400px"
                        />
                      </div>
                    )}
                  </Flex>
                </div>
                <div className={styles.description}>
                  <Title level={3} className={styles.innerTitle}>
                    Описание
                  </Title>
                  <div
                    className={styles.descriptionText}
                    dangerouslySetInnerHTML={{ __html: eventData.description }}
                  ></div>
                </div>
                <div className={styles.tickets} ref={refTickets}>
                  <Title level={3} className={styles.innerTitle}>
                    Билеты
                  </Title>
                  <div className={styles.ticketsBody}>
                    {ticketsLoading
                      ? [...Array(2)].map((_, i) => {
                          <Flex
                            gap={30}
                            wrap
                            className={styles.ticketsContainer}
                          >
                            <MySkeleton width="100%" height="250px" />
                          </Flex>;
                        })
                      : Object.entries(groupedTickets).map(
                          ([date, tickets]) => (
                            <Flex
                              vertical
                              gap={10}
                              key={date}
                              className={styles.ticketsGroup}
                            >
                              <Divider
                                orientation="left"
                                style={{ borderColor: "#7cb305" }}
                              >
                                <Title
                                  level={4}
                                  className={styles.ticketDateTitle}
                                >
                                  {date}
                                </Title>
                              </Divider>
                              <Flex
                                gap={10}
                                wrap
                                className={styles.ticketsContainer}
                              >
                                {tickets.map((ticket) => (
                                  <div
                                    className={styles.ticket}
                                    key={ticket.id}
                                  >
                                    <TicketCard
                                      ticket={ticket}
                                      count={ticketCounts[ticket.id] || 0}
                                      onIncrement={() => increment(ticket.id)}
                                      onDecrement={() => decrement(ticket.id)}
                                    />
                                  </div>
                                ))}
                              </Flex>
                            </Flex>
                          )
                        )}
                  </div>
                </div>
                <div className={styles.creatorEvents}>
                  <Title level={2} className={styles.creatorEvents__title}>
                    Больше мероприятий организатора
                  </Title>
                  <EventList type="slider" creatorId={eventData.organizerId} />
                </div>
              </div>
              {user?.id === eventData.organizerId ? (
                <Affix offsetTop={100} style={{ marginRight: 10 }}>
                  <MyButton
                    icon={<CiEdit size={20} />}
                    onClick={() =>
                      navigate(`/events/manage/edit/${eventData.id}/info`)
                    }
                  >
                    {" "}
                    Редактировать{" "}
                  </MyButton>
                </Affix>
              ) : (
                ""
              )}
              <Affix offsetTop={100}>
                <TicketsAside
                  userId={user?.id}
                  eventData={eventData}
                  ticktesRef={refTickets}
                  ticketsData={ticketsData}
                  isMultiDayEvent={isMultiDayEvent}
                />
              </Affix>
            </Flex>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default () => (
  <CartProvider>
    <EventPage />
  </CartProvider>
);
