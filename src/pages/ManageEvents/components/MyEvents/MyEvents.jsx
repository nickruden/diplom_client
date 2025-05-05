import React, { useEffect, useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import {
  Card,
  Typography,
  Calendar,
  Tag,
  Col,
  Progress,
  Divider,
  Select,
  Flex,
  Tabs,
  Spin,
} from "antd";
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

import { FaCalendarAlt, FaList } from "react-icons/fa";
import { MoreOutlined } from "@ant-design/icons";
import { CiImageOff } from "react-icons/ci";
import { MdOutlineEventBusy } from "react-icons/md";

import { useAuth } from "../../../../common/hooks/useAuth";

import { MyEmpty, MySkeleton, OrganizerLayout } from "../../../../common/components";

import SearchInput from "../../../../common/components/UI/Search/Search";
import {
  useDeleteEvent,
  useEditEvent,
  useGetEventsByCreator,
} from "../../../../common/API/services/events/hooks.api";
import MyDropdown from "../../../../common/components/UI/Dropdown/MyDropdown";
import "../../SeachLine.scss";

import styles from "./MyEvents.module.scss";
import { IoIosArrowDown } from "react-icons/io";

const statusColors = {
  Опубликовано: "green",
  "Sold Out": "orange",
  Архив: "blue",
  Завершено: "gray",
};

const EventManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rows, setRows] = useState(2);
  const [viewMode, setViewMode] = useState("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingEventId, setLoadingEventId] = useState(null);


  const { data: eventsList, isLoading: eventListLoading, refetch: eventsListRefetch } = useGetEventsByCreator(user.id);
  const { mutate: updateStatus } = useEditEvent();
  const { mutate: deleteEvent } = useDeleteEvent();

  const handleUpdateStatus = async ({ id, data }) => {
    setLoadingEventId(id);
    
    try {
      await updateStatus({ id, data: { status: data } });
      await eventsListRefetch();
    } finally {
      setLoadingEventId(null);
    }
  };

  return (
    <OrganizerLayout>
      <div className={styles.eventManagementPage}>
        <Title level={2} className={styles.title}>
          Мои мероприятия
        </Title>
        <Tabs
          defaultActiveKey="list"
          onChange={(key) => setViewMode(key)}
          style={{ marginBottom: 30 }}
          items={[
            {
              label: (
                <Flex align="center" style={{ fontSize: "16px" }}>
                  <FaList style={{ marginRight: 6 }} />
                  Список
                </Flex>
              ),
              key: "list",
            },
            {
              label: (
                <Flex align="center" style={{ fontSize: "16px" }}>
                  <FaCalendarAlt style={{ marginRight: 6 }} />
                  Календарь
                </Flex>
              ),
              key: "calendar",
            },
          ]}
        />
        <Flex
          align="center"
          justify="space-between"
          gap={16}
          className={styles.filters}
        >
          <Flex align="center" gap={30}>
            <SearchInput
              placeholder="Поиск по названию"
              onPressEnter={(e) => setSearchTerm(e.target.value)}
              allowClear="true"
              size="large"
              borderRadius="100px"
              imgSize="20"
            />
            <Select
              defaultValue="all"
              onChange={(val) => setStatusFilter(val)}
              dropdownStyle={{ fontSize: "16px" }}
              className="custom-select-font"
              size="large"
            >
              <Option value="all">Все</Option>
              <Option value="Active">Активные</Option>
              <Option value="Sold Out">Проданные</Option>
              <Option value="Draft">Черновики</Option>
              <Option value="Completed">Завершённые</Option>
            </Select>
          </Flex>
        </Flex>

        {eventListLoading ? (
  <Flex vertical gap={10}>
    <MySkeleton width="100%" height="109px" />
    <MySkeleton width="100%" height="109px" />
    <MySkeleton width="100%" height="109px" />
  </Flex>
) : !eventsList || eventsList.length === 0 ? (
  viewMode === "list" ? (
    <MyEmpty title="События не найдены" image={<MdOutlineEventBusy size={120} />} />
  ) : (
    <Card
      style={{
        borderRadius: 16,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <Calendar
        fullscreen={true}
        dateCellRender={(date) => {
          const eventForDay = eventsList?.find((event) =>
            dayjs(event.date).isSame(date, "day")
          );
          return eventForDay ? (
            <Link to={`/events/${eventForDay.id}`}>
              <Text type="secondary">{eventForDay.name}</Text>
            </Link>
          ) : null;
        }}
      />
    </Card>
  )
) : viewMode === "list" ? (
  <Flex vertical className={styles.statsTable}>
    <Flex className={styles.tableHeader}>
      <Col span={10} className={styles.tableHeader__title}>
        Информация о событии
      </Col>
      <Col span={6} className={styles.tableHeader__title}>
        Продажи билетов
      </Col>
      <Col span={4} className={styles.tableHeader__title}>
        Прибыль
      </Col>
      <Col span={3} className={styles.tableHeader__title}>
        Статус
      </Col>
    </Flex>

    <Flex vertical className={styles.tableEventList}>
      {eventsList.map((event) => (
        <div
          key={event.id}
          style={{ opacity: event.status === "Completed" ? 0.6 : 1 }}
          className={styles.eventItem}
        >
          <Flex align="center" className={styles.eventItem__body}>
            <Link
              to={`/events/manage/event/${event.id}/stats`}
              className={styles.eventItem__inner}
            >
              <Col span={10}>
                <Flex
                  align="center"
                  gap={16}
                  className={styles.eventCardInfo}
                >
                  <div className={styles.imageWrap}>
                    {event.images.length ? (
                      <img
                        src={event.images[0].imageUrl}
                        alt="event-image"
                      />
                    ) : (
                      <Flex
                        align="center"
                        justify="center"
                        className={styles.image}
                      >
                        <CiImageOff
                          style={{ fontSize: 32, color: "#999" }}
                        />
                      </Flex>
                    )}
                  </div>
                  <Flex vertical className={styles.cardBody}>
                    <Paragraph
                      ellipsis={{ rows }}
                      className={styles.titleWrap}
                    >
                      <Title level={5} className={styles.title}>
                        {event.name}
                      </Title>
                    </Paragraph>
                    <Text type="secondary">{event.location}</Text>
                    <Text type="secondary">
                      {dayjs(event.date).format("DD MMMM YYYY")}
                    </Text>
                  </Flex>
                </Flex>
              </Col>
              <Col span={6}>
                <Flex vertical className={styles.eventCardTickets}>
                  <Text
                    style={{ fontSize: "16px", color: "#1c1c1ce8" }}
                  >
                    {event.soldTicketsCount} / {event.totalTicketsCount}
                  </Text>
                  <Progress
                    percent={Math.round(
                      (event.soldTicketsCount / event.totalTicketsCount) * 100
                    )}
                    size="small"
                    showInfo={true}
                    style={{ maxWidth: "200px" }}
                  />
                </Flex>
              </Col>
              <Col span={4} className={styles.eventCardGross}>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#1c1c1ce8",
                  }}
                >
                  {event.profit} ₽
                </Text>
              </Col>
            </Link>
            <Col span={4} className={styles.eventCardStatus}>
              <MyDropdown
                menu={{
                  items: (() => {
                    const items = [];

                    if (event.status === "Опубликовано") {
                      items.push({
                        key: "unpublic",
                        label: "Снять с публикации",
                        onClick: () => {
                          handleUpdateStatus({
                            id: event.id,
                            data: "Черновик",
                          });
                        },
                      });
                    }

                    if (
                      ["Черновик", "Архив", "Завершено"].includes(event.status)
                    ) {
                      items.push({
                        key: "public",
                        label: "Опубликовать",
                        onClick: () =>
                          navigate(`/events/manage/edit/${event.id}/confirm`),
                      });
                    }

                    return items;
                  })(),
                }}
                trigger={["click"]}
              >
                <Tag
                  color={statusColors[event.status] || "default"}
                  className={styles.statusTag}
                >
                  {loadingEventId === event.id ? (
                    <Spin size="small" />
                  ) : (
                    <>
                      {event.status}{" "}
                      <IoIosArrowDown style={{ marginLeft: "auto" }} />
                    </>
                  )}
                </Tag>
              </MyDropdown>
            </Col>
            <Col
              style={{ textAlign: "right" }}
              className={styles.eventCardOptions}
            >
              <MyDropdown
                menu={{
                  items: [
                    {
                      key: "edit",
                      label: "Редактировать",
                      onClick: () =>
                        navigate(`/events/manage/edit/${event.id}/info`),
                    },
                    {
                      key: "statistic",
                      label: "Статистика",
                      onClick: () =>
                        navigate(`/events/manage/event-stats`),
                    },
                    {
                      key: "delete",
                      label: "Удалить",
                      onClick: () => deleteEvent(event.id),
                    },
                  ],
                }}
                trigger={["click"]}
                className={styles.options}
              >
                <MoreOutlined
                  style={{ fontSize: 20, cursor: "pointer" }}
                />
              </MyDropdown>
            </Col>
          </Flex>
          <Divider style={{ margin: 0 }} />
        </div>
      ))}
    </Flex>
  </Flex>
) : (
  <Card
    style={{
      borderRadius: 16,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    }}
  >
    <Calendar
      fullscreen={true}
      dateCellRender={(date) => {
        const eventForDay = eventsList.find((event) =>
          dayjs(event.date).isSame(date, "day")
        );
        return eventForDay ? (
          <Link to={`/events/${eventForDay.id}`}>
            <Text type="secondary">{eventForDay.name}</Text>
          </Link>
        ) : null;
      }}
    />
  </Card>
)}
      </div>
    </OrganizerLayout>
  );
};

export default EventManagementPage;
