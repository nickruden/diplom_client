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
  Modal,
  message,
} from "antd";
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

import { FaCalendarAlt, FaList } from "react-icons/fa";
import { MoreOutlined } from "@ant-design/icons";
import { CiImageOff } from "react-icons/ci";
import { MdOutlineEventBusy } from "react-icons/md";

import { useAuth } from "../../../../common/hooks/useAuth";

import {
  MyEmpty,
  MySkeleton,
  OrganizerLayout,
} from "../../../../common/components";

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
import { formatTime } from "../../../../common/utils/Date/formatDate";
import { useRefundTicket } from "../../../../common/API/services/payment/hooks.api";

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

  const {
    data: eventsList,
    isLoading: eventListLoading,
    refetch: eventsListRefetch,
  } = useGetEventsByCreator(user.id);
  const { mutateAsync: updateStatus } = useEditEvent();
  const { mutateAsync: deleteEvent } = useDeleteEvent();

  const filteredEventsList = eventsList?.filter((event) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "Active" && event.status === "Опубликовано") ||
      (statusFilter === "Draft" && event.status === "Черновик") ||
      (statusFilter === "Sold Out" && event.status === "Sold Out") ||
      (statusFilter === "Completed" && event.status === "Завершено");
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async ({ id, data }) => {
    setLoadingEventId(id);

    try {
      await updateStatus({ id, data: { status: data } });
      await eventsListRefetch();
    } finally {
      setLoadingEventId(null);
    }
  };

  const handleDeleteEvent = async (event) => {
    Modal.confirm({
      title: "Удалить мероприятие?",
      content:
        "Вы уверены, что хотите удалить это мероприятие? Это действие необратимо.",
      okText: "Удалить",
      cancelText: "Отмена",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteEvent({ id: event.id, data: { realyDel: false } });
          message.success("Событие успешно удалено");
          await eventsListRefetch();
        } catch (error) {
          if (error.status === 409) {
            const now = dayjs();
            const eventStart = dayjs(event.startTime);
            const daysUntilEvent = eventStart.diff(now, "day");

            // Если до события меньше 3 дней
            if (daysUntilEvent <= 3) {
              navigate(`/events/manage/event/${event.id}/stats?action=delete`);
              return;
            } else {
              // Если до события больше 3 дней
              if (event.status === "Sold Out") {
                Modal.error({
                  title: "Важно! Мероприятие продано!",
                  content: `Вы не сможете удалить мероприятие до ${dayjs(
                    event.startTime
                  )
                    .subtract(3, "day")
                    .format(
                      "DD.MM.YYYY"
                    )}. все средства будут автоматически возвращены покупателям.`,
                  okText: "Понятно",
                });
                return;
              }
              Modal.confirm({
                title: "Невозможно удалить событие",
                content: (
                  <div>
                    <p>У этого события есть проданные билеты!</p>
                    <p>Рекомендуем перевести событие в черновики.</p>
                    <Divider style={{ margin: "12px 0" }} />
                    <p style={{ color: "#faad14" }}>
                      Если событие не будет опубликовано за 2 дня до начала,
                      средства автоматически вернутся покупателям.
                    </p>
                  </div>
                ),
                okText: "Перевести в черновики",
                cancelText: "Отмена",
                onOk: async () => {
                  try {
                    await handleUpdateStatus({
                      id: event.id,
                      data: "Черновик",
                    });
                    message.success("Событие переведено в черновики");

                    Modal.info({
                      title: "Важно!",
                      content: `Если событие не будет опубликовано до ${dayjs(
                        event.startTime
                      )
                        .subtract(3, "day")
                        .format(
                          "DD.MM.YYYY"
                        )}, все средства будут автоматически возвращены покупателям.`,
                      okText: "Понятно",
                    });
                  } catch (err) {
                    console.error("Ошибка при изменении статуса:", err);
                  }
                },
              });
            }
          } else {
            message.error("Ошибка при удалении события");
            console.error(error);
          }
        }
      },
    });
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
            // {
            //   label: (
            //     <Flex align="center" style={{ fontSize: "16px" }}>
            //       <FaCalendarAlt style={{ marginRight: 6 }} />
            //       Календарь
            //     </Flex>
            //   ),
            //   key: "calendar",
            // },
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
              onChange={(val) => setSearchTerm(val)}
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
        ) : !filteredEventsList || filteredEventsList.length === 0 ? (
          viewMode === "list" ? (
            <MyEmpty
              title="События не найдены"
              image={<MdOutlineEventBusy size={120} />}
            />
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
                  const eventForDay = filteredEventsList?.find((event) =>
                    dayjs(event.starTime).isSame(date, "day")
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
              {filteredEventsList.map((event) => (
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
                              {formatTime(event.startTime, { showDate: true })}
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
                              (event.soldTicketsCount /
                                event.totalTicketsCount) *
                                100
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
                              ["Черновик", "Архив", "Завершено"].includes(
                                event.status
                              )
                            ) {
                              items.push({
                                key: "public",
                                label: "Опубликовать",
                                onClick: () =>
                                  navigate(
                                    `/events/manage/edit/${event.id}/confirm`
                                  ),
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
                                navigate(
                                  `/events/manage/edit/${event.id}/info`
                                ),
                            },
                            {
                              key: "statistic",
                              label: "Статистика",
                              onClick: () =>
                                navigate(`/events/manage/event/${event.id}/stats`),
                            },
                            {
                              key: "delete",
                              label: "Удалить",
                              onClick: () => handleDeleteEvent(event),
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
                const eventForDay = filteredEventsList.find((event) =>
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
