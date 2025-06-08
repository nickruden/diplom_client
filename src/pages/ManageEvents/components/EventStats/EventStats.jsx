import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Table,
  Button,
  Space,
  Statistic,
  Tooltip,
  Flex,
  Tag,
  message,
  Modal,
} from "antd";
import {
  AppLayout,
  MyEmpty,
  MyLoader,
  MySkeleton,
  MySteps,
  OrganizerLayout,
} from "../../../../common/components";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  EyeOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import "./EventDetailsPage.scss";
import MyButton from "../../../../common/components/UI/Button/MyButton";
import {
  useDeleteEvent,
  useGetEventById,
  useGetEventPuchases,
} from "../../../../common/API/services/events/hooks.api";
import { editEventSteps } from "../../../EditEvent/heplers/evetSteps";
import {
  formatDate,
  formatTimeRange,
} from "../../../../common/utils/Date/formatDate";
import { useGetTicketsByEvent } from "../../../../common/API/services/tickets/hooks.api";
import { LuTicketX } from "react-icons/lu";
import { RiShoppingBasket2Line } from "react-icons/ri";
import { downloadCSV } from "../../utils/downloadOrders";

const { Title, Text } = Typography;

const statusColors = {
  Опубликовано: "green",
  "Sold Out": "orange",
  Архив: "blue",
  Завершено: "gray",
};

const EventDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: eventData,
    isLoading: evetDataLoading,
    refetch: refetchEventData,
  } = useGetEventById(id);
  const { data: ticketsData, isLoading: ticketsDataLoading } =
    useGetTicketsByEvent(id);
  const { data: eventPuchasesData, isLoading: eventPuchasesLoading } =
    useGetEventPuchases(id);
  const { mutateAsync: deleteEvent } = useDeleteEvent();
  const hasModalShownRef = useRef(false);

  useEffect(() => {
    if (
      location.search.includes("action=delete") &&
      !hasModalShownRef.current
    ) {
      hasModalShownRef.current = true;
      handleDeleteWithRefunds();
    }
  }, []);

  const handleDeleteWithRefunds = async () => {
    Modal.confirm({
      title: "Подтверждение удаления",
      content: (
        <div>
          <p>Вы точно хотите удалить событие? Это действие необратимо!</p> <br></br>
          <p>Все упоминания о вашем мероприятии исчезнут у интересовавшихся пользователей!</p>
        </div>
      ),
      okText: "Удалить",
      cancelText: "Отмена",
      onOk: async () => {
        try {
          await deleteEvent({ id: id, data: { realyDel: true } });
          navigate("/events/manage/my-events");
          message.success("Событие удалено");
        } catch (error) {
          message.error("Ошибка при удалении");
          console.error(error);
        }
      },
    });
  };

  const ticketColumns = [
    { title: "Название билета", dataIndex: "name" },
    {
      title: "Продано",
      dataIndex: "soldCount",
      render: (soldCount, record) => {
        return `${soldCount} / ${record.count}`;
      },
    },
    { title: "Цена", dataIndex: "price", render: (price) => `${price} ₽` },
  ];

  const orderColumns = [
    { title: "Номер покупки", dataIndex: "id" },
    {
      title: "Покупатель",
      dataIndex: "user",
      render: (user) => `${user.firstName} ${user.lastName}`,
    },
    { title: "Билет", dataIndex: ["ticket", "name"] },
    {
      title: "Сумма",
      dataIndex: ["ticket", "price"],
      render: (price) => `${price} ₽`,
    },
    {
      title: "Дата",
      dataIndex: "purchaseTime",
      render: (date) => formatDate(date),
    },
  ];

  return (
    <OrganizerLayout
      formData={eventData}
      steps={
        <MySteps
          direction="vertical"
          steps={editEventSteps(id)}
          currentStep={0}
        />
      }
      type="stats"
      refetchEventData={refetchEventData}
    >
      <div className="eventDetailsPage">
        <div className="event-header-actions">
          <Space>
            <Link to="/events/manage/my-events">
              <MyButton type="text" icon={<ArrowLeftOutlined />} size="medium">
                Все мероприятия
              </MyButton>
            </Link>
            <MyButton
              icon={<DownloadOutlined />}
              type="default"
              size="medium"
              onClick={() => downloadCSV(eventPuchasesData, eventData)}
            >
              Сохранить список купленных билетов
            </MyButton>
          </Space>
          <Text type="secondary">
            Дата создания: {formatDate(eventData?.createdAt, true)}
          </Text>
        </div>

        {evetDataLoading ? (
          <MyLoader />
        ) : (
          <>
            <Card className="eventInfoCard">
              <Flex
                justify="space-between"
                align="flex-start"
                className="eventInfoCard__inner"
              >
                <div className="eventInfo">
                  {/* <Title level={1} className="eventTitle">
                {eventData.name}
              </Title> */}
                  <Flex align="center" gap={10} className="eventDate">
                    <CalendarOutlined />{" "}
                    {formatTimeRange(eventData.startTime, eventData.endTime)}
                  </Flex>
                  <Flex align="center" gap={10} className="eventLocation">
                    <EnvironmentOutlined /> {eventData.location}
                  </Flex>
                  <Flex gap={10} className="eventUrl">
                    <Text className="eventUrl__text">
                      Ссылка на общедоступную страницу мероприятия:
                    </Text>
                    <MyButton
                      type="link"
                      href={`/event/${eventData.id}`}
                      target="_blank"
                      className="eventUrl__Link"
                    >
                      http://localhost:5173/event/{eventData.id}
                    </MyButton>
                  </Flex>
                </div>
                <div className="eventInfoCard__status">
                  <Tooltip title={eventData.status}>
                    <Tag
                      color={statusColors[eventData.status] || "default"}
                      className="statusTag"
                    >
                      {eventData.status}
                    </Tag>
                  </Tooltip>
                </div>
              </Flex>
            </Card>

            <Flex gap={20} className="eventStats">
              <Card className="eventStats__card">
                <Flex gap={10} className="eventStats__cardContent">
                  <DollarOutlined className="eventStats__icon" />
                  <Flex vertical>
                    <Text className="eventStats__title">Выручка</Text>
                    <Text className="eventStats__value">
                      {eventData.tickets
                        ?.reduce(
                          (total, ticket) =>
                            total + ticket.price * ticket.soldCount,
                          0
                        )
                        .toLocaleString("ru-RU")}{" "}
                      ₽
                    </Text>
                  </Flex>
                </Flex>
              </Card>
              <Card className="eventStats__card">
                <Flex gap={10} className="eventStats__cardContent">
                  <FileTextOutlined className="eventStats__icon" />
                  <Flex vertical>
                    <Text className="eventStats__title">Продано билетов</Text>
                    <Text className="eventStats__value">
                      {eventData.totalSoldTickets}
                    </Text>
                  </Flex>
                </Flex>
              </Card>
              <Card className="eventStats__card">
                <Flex gap={10} className="eventStats__cardContent">
                  <EyeOutlined className="eventStats__icon" />
                  <Flex vertical>
                    <Text className="eventStats__title">
                      Просмотры объявления
                    </Text>
                    <Text className="eventStats__value">
                      {eventData.viewsEvent}
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            </Flex>

            <Flex vertical className="ticketsTable">
              <Title level={3} className="ticketsTable__title">
                Продажи билетов
              </Title>
              {ticketsDataLoading ? (
                <MySkeleton width="100%" height="300px" />
              ) : !ticketsData?.tickets || ticketsData.tickets.length <= 0 ? (
                <MyEmpty
                  title="Здесь пока нет билетов"
                  image={<LuTicketX size={100} />}
                />
              ) : (
                <Table
                  columns={ticketColumns}
                  dataSource={ticketsData.tickets}
                  rowKey="id"
                  pagination={false}
                />
              )}
            </Flex>

            <Flex vertical className="buyersTable">
              <Title level={3} className="buyersTable__title">
                Список покупок
              </Title>
              {eventPuchasesLoading ? (
                <MySkeleton width="100%" height="300px" />
              ) : eventPuchasesData.length === 0 ? (
                <MyEmpty
                  title="Здесь пока нет покупок"
                  image={<RiShoppingBasket2Line size={100} />}
                />
              ) : (
                <Table
                  columns={orderColumns}
                  dataSource={eventPuchasesData}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              )}
            </Flex>
          </>
        )}
      </div>
    </OrganizerLayout>
  );
};

export default EventDetailsPage;
