import React, { useState } from 'react';
import { Card, Typography, Row, Col, Divider, Table, Button, Space, Statistic, Tooltip, Flex, Tag } from 'antd';
import { AppLayout, MyEmpty, MyLoader, MySkeleton, MySteps, OrganizerLayout } from '../../../../common/components';
import { useParams, Link } from 'react-router-dom';
import { EyeOutlined, ArrowLeftOutlined, DownloadOutlined, EnvironmentOutlined, CalendarOutlined, FileTextOutlined, DollarOutlined } from '@ant-design/icons';
import './EventDetailsPage.scss';
import MyButton from '../../../../common/components/UI/Button/MyButton';
import { useGetEventById, useGetEventPuchases } from '../../../../common/API/services/events/hooks.api';
import { editEventSteps } from '../../../EditEvent/heplers/evetSteps';
import { formatDate, formatTimeRange } from '../../../../common/utils/Date/formatDate';
import { useGetTicketsByEvent } from '../../../../common/API/services/tickets/hooks.api';
import { LuTicketX } from "react-icons/lu";
import { RiShoppingBasket2Line } from "react-icons/ri";


const { Title, Text } = Typography;

const eventDetails = {
  id: '1',
  name: 'Tech Conference 2025',
  date: '2025-06-15',
  createdAt: '2025-06-01',
  url: 'https://yourplatform.com/event/1',
  location: 'Москва, Россия',
  status: 'Активно',
  stats: {
    revenue: 12340,
    ticketsSold: 234,
    views: 1987,
  },
  tickets: [
    { name: 'Standard', sold: 120, total: 150, price: 25 },
    { name: 'VIP', sold: 40, total: 50, price: 100 },
  ],
  orders: [
    { id: 'ORD123', buyer: 'Ivan Petrov', tickets: 2, amount: 50, date: '2025-04-10' },
    { id: 'ORD124', buyer: 'Anna Ivanova', tickets: 1, amount: 100, date: '2025-04-12' },
  ]
};

const statusColors = {
  Опубликовано: "green",
  "Sold Out": "orange",
  Архив: "blue",
  Завершено: "gray",
};


const EventDetailsPage = () => {
  const { id } = useParams();
  const { data: eventData, isLoading: evetDataLoading, refetch: refetchEventData } = useGetEventById(id);
  const { data: ticketsData, isLoading: ticketsDataLoading } = useGetTicketsByEvent(id);
  const { data: eventPuchasesData, isLoading: eventPuchasesLoading } = useGetEventPuchases(id);
  console.log(eventData, eventPuchasesData);


  const ticketColumns = [
    { title: 'Название билета', dataIndex: 'name' },
    {
      title: 'Продано',
      dataIndex: 'soldCount',
      render: (soldCount, record) => {
        return `${soldCount} / ${record.count}`;
      },
    },
    { title: 'Цена', dataIndex: 'price', render: (price) => `${price} ₽` },
  ];

  const orderColumns = [
    { title: 'Номер покупки', dataIndex: 'id' },
    { title: 'Покупатель', dataIndex: 'user', render: (user) => `${user.firstName} ${user.lastName}`},
    { title: 'Билет', dataIndex: ['ticket', 'name'] },
    { title: 'Сумма', dataIndex: ['ticket', 'price'], render: (price) => `${price} ₽`},
    { title: 'Дата', dataIndex: 'purchaseTime', render: (date) => formatDate(date) },
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
            <MyButton icon={<DownloadOutlined />} type="default" size="medium">
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
                  <Tooltip title={eventDetails.status}>
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
                      {eventData.revenue} ₽
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
              ) :
              <Table
                columns={orderColumns}
                dataSource={eventPuchasesData}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />}
            </Flex>
          </>
        )}
      </div>
    </OrganizerLayout>
  );
};

export default EventDetailsPage;
