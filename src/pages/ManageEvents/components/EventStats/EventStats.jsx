import React, { useState } from 'react';
import { Card, Typography, Row, Col, Divider, Table, Button, Space, Statistic, Tooltip, Flex } from 'antd';
import { AppLayout, MyLoader, MySteps, OrganizerLayout } from '../../../../common/components';
import { useParams, Link } from 'react-router-dom';
import { EyeOutlined, EditOutlined, ArrowLeftOutlined, DownloadOutlined, EnvironmentOutlined, CalendarOutlined, FileTextOutlined, DollarOutlined } from '@ant-design/icons';
import './EventDetailsPage.scss';
import MyButton from '../../../../common/components/UI/Button/MyButton';
import { useGetEventById } from '../../../../common/API/services/events/hooks.api';
import { editEventSteps } from '../../../EditEvent/heplers/evetSteps';
import { formatDate } from '../../../../common/utils/Date/formatDate';
import { formatTimeRange } from '../../../../common/utils/Date/formatTime';

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

const EventDetailsPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const { data: eventData, isLoading: evetDataLoading } = useGetEventById(id);
  console.log(eventData)

  const handleStepChange = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const ticketColumns = [
    { title: 'Название билета', dataIndex: 'name' },
    {
      title: 'Продано',
      dataIndex: 'sold',
      render: (sold, record) => {
        return `${sold} / ${record.total}`;
      },
    },
    { title: 'Цена', dataIndex: 'price', render: (price) => `${price} ₽` },
  ];

  const orderColumns = [
    { title: 'Номер покупки', dataIndex: 'id' },
    { title: 'Покупатель', dataIndex: 'buyer' },
    { title: 'Билет', dataIndex: 'ticket' },
    { title: 'Количество', dataIndex: 'tickets' },
    { title: 'Сумма', dataIndex: 'amount', render: (amount) => `${amount} ₽` },
    { title: 'Дата', dataIndex: 'date' },
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

{evetDataLoading ? <MyLoader /> : <>
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
                  href={`/event/${eventDetails.id}`}
                  target="_blank"
                  className="eventUrl__Link"
                >
                  http://localhost:5173/event/{eventData.id}
                </MyButton>
              </Flex>
            </div>
            <div className="eventInfoCard__status">
              <Tooltip title={eventDetails.status}>
                <span
                  className={`status-badge ${eventDetails.status.toLowerCase()}`}
                >
                  {eventData.status}
                </span>
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
                  {eventDetails.stats.revenue} ₽
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
                  {eventDetails.stats.ticketsSold}
                </Text>
              </Flex>
            </Flex>
          </Card>
          <Card className="eventStats__card">
            <Flex gap={10} className="eventStats__cardContent">
              <EyeOutlined className="eventStats__icon" />
              <Flex vertical>
                <Text className="eventStats__title">Просмотры объявления</Text>
                <Text className="eventStats__value">
                  {eventDetails.stats.views}
                </Text>
              </Flex>
            </Flex>
          </Card>
        </Flex>

        <Flex vertical className="ticketsTable">
          <Title level={3} className="ticketsTable__title">
            Продажи билетов
          </Title>
          <Table
            columns={ticketColumns}
            dataSource={eventDetails.tickets}
            rowKey="name"
            pagination={false}
          />
        </Flex>

        <Flex vertical className="buyersTable">
          <Title level={3} className="buyersTable__title">
            Список покупок
          </Title>
          <Table
            columns={orderColumns}
            dataSource={eventDetails.orders}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Flex></>}
      </div>
    </OrganizerLayout>
  );
};

export default EventDetailsPage;
