import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Flex, Typography, Col, Tooltip, Modal, message } from "antd";

const { Title, Text } = Typography;

import {
  useCreateTicket,
  useDeleteTicket,
  useGetTicketsByEvent,
  useRefundTickets,
  useUpdateTicket,
} from "../../../../common/API/services/tickets/hooks.api";

import { MoreOutlined } from "@ant-design/icons";
import { IoTicketOutline } from "react-icons/io5";
import { CiCircleInfo } from "react-icons/ci";
import { LuTickets } from "react-icons/lu";
import { GoPlus } from "react-icons/go";

import MyDropdown from "../../../../common/components/UI/Dropdown/MyDropdown";
import MyButton from "../../../../common/components/UI/Button/MyButton";
import { MyLoader } from "../../../../common/components";
import MyEmpty from "../../../../common/components/Empty/MyEmpty";

import TicketDrawer from "../TicketDrawer/TicketDrawer";

import styles from "./TicketsList.module.scss";
import {
  formatDate,
  formatTime,
  normalizeToUtcWithoutOffset,
} from "../../../../common/utils/Date/formatDate";
import { useEditEvent } from "../../../../common/API/services/events/hooks.api";
import dayjs from "dayjs";

const TicketsPage = ({ refetchEventData, eventData }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [mode, setMode] = useState(null);
  const isCompletedEvent = eventData.status !== "Завершено" ? false : true;

  const now = dayjs();

  const { id } = useParams();

  const {
    data: allTicketsData,
    isLoading: ticketsLoading,
    isError,
    error,
    refetch,
  } = useGetTicketsByEvent(id);
  const { mutate: createTicket } = useCreateTicket();
  const { mutate: updateTicket } = useUpdateTicket();
  const { mutateAsync: deleteTicket, error: deleteError } = useDeleteTicket(id);
  const { mutateAsync: updateEvent } = useEditEvent();
  const { mutateAsync: refundTickets } = useRefundTickets();

  const isMultiDayEvent =
    eventData &&
    formatDate(eventData.startTime) !== formatDate(eventData.endTime);

  const handleSaveTicket = async (ticketData) => {
    try {
      if (editingTicket && mode === "edit") {
        updateTicket({ id: ticketData.id, data: ticketData });
      } else {
        createTicket({ id, data: ticketData });
      }

      setDrawerOpen(false);
      setEditingTicket(null);
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    }
  };

  const handleDeleteTicket = (ticketId) => {
    Modal.confirm({
      title: "Вы точно хотите удалить билет?",
      content: "Это действие необратимо. Удалить билет?",
      okText: "Удалить",
      cancelText: "Отмена",
      okType: "danger",
      async onOk() {
        try {
          await deleteTicket(ticketId);
          await refetch();
          await updateEvent({ id: ticketId, data: { status: "Черновик" } });
          await refetchEventData();
        } catch (error) {
          if (error?.response?.data?.error === "TICKET_HAS_PURCHASES") {
            Modal.error({
              title: "Ошибка удаления",
              content:
                "Невозможно удалить билет. Есть люди купившие его! Если хотите чтобы билет больше не продавался, уменьшите общее количество этого билета до количества купленных!",
              okText: "Понятно",
            });
          }
        }
      },
    });
  };

  const handleRefundTicket = (ticketId) => {
    Modal.confirm({
      title: "Подтвердите возврат",
      content:
        "Вы действительно хотите вернуть средства за этот билет? Это действие необратимо!",
      okText: "Вернуть",
      cancelText: "Отмена",
      okType: "danger",
      onOk: async () => {
        try {
          await refundTickets(ticketId);
          message.success("Все билеты успешно возвращены");
        } catch (error) {
          console.error(error);
          message.error("Ошибка при возврате билетов");
        }
      },
    });
  };

  const groupTicketsByValidity = (tickets) => {
    const groups = {};

    if (!isMultiDayEvent) {
      return tickets;
    }

    tickets.forEach((ticket) => {
      const fromDate = dayjs(ticket.validFrom);
      const toDate = dayjs(ticket.validTo);

      const isSameDay = fromDate.isSame(toDate, "day");

      let key;

      if (isSameDay) {
        // Показываем дату один раз, но с диапазоном времени
        const dateStr = formatDate(fromDate, { showWeekday: false });
        const timeFrom = formatTime(fromDate);
        const timeTo = formatTime(toDate);
        key = `${dateStr} ${timeFrom} — ${timeTo}`;
      } else {
        // Показываем полные даты
        const fromStr = formatTime(fromDate, {
          showDate: true,
          showYear: true,
        });
        const toStr = formatTime(toDate, { showDate: true, showYear: true });
        key = `${fromStr} — ${toStr}`;
      }

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(ticket);
    });

    return groups;
  };

  return (
    <div className={styles.ticketsPage}>
      <Flex
        justify="space-between"
        align="flex-start"
        gap={540}
        className={styles.ticketsPage__header}
      >
        <div className={styles.ticketsPage__title}>Билеты</div>
        <MyButton
          type="text"
          size="large"
          className={styles.addButton}
          onClick={() => {
            setEditingTicket(null);
            setMode("create");
            setDrawerOpen(true);
          }}
        >
          <GoPlus size={30} /> Добавить билет
        </MyButton>
      </Flex>
      <Flex vertical>
        <Flex
          justify="space-between"
          align="center"
          className={styles.ticketsInfo}
        >
          <Title level={5}>Всего билетов</Title>
          <Text className={styles.ticketsCount}>
            {allTicketsData?.totalTickets || 0}
          </Text>
          <Tooltip
            title="Показывает общее количество людей, которые могут присутсвовать на мероприятии"
            color="#4B4D63"
            placement="bottom"
            style={{ cursor: "pointer" }}
          >
            <CiCircleInfo size={20} />
          </Tooltip>
        </Flex>

        {ticketsLoading ? (
          <MyLoader style={{ paddingTop: 50 }} />
        ) : (isError && error?.response?.status === 404) ||
          allTicketsData.tickets.length === 0 ? (
          <MyEmpty image={<LuTickets size={80} />} title="Нет билетов" />
        ) : isMultiDayEvent ? (
          <Flex vertical gap={50}>
            {" "}
            {Object.entries(
              groupTicketsByValidity(allTicketsData?.tickets || [])
            ).map(([validityRange, tickets]) => (
              <Flex
                vertical
                gap={10}
                key={validityRange}
                className={styles.validityGroup}
              >
                <Title level={5} className={styles.validityTitle}>
                  Дата действия билета: {validityRange}
                </Title>
                <Flex vertical gap={0}>
                  {tickets.map((ticket) => (
                    <Flex key={ticket.id} className={styles.ticketCard}>
                      <Flex
                        align="center"
                        gap={20}
                        className={styles.inner}
                        onClick={() => {
                          setEditingTicket(ticket);
                          setMode("edit");
                          setDrawerOpen(true);
                        }}
                      >
                        <IoTicketOutline size={30} color="gray" />
                        <Col span={11}>
                          <Title level={5} className={styles.title}>
                            {ticket.name}
                          </Title>
                          {isCompletedEvent || ((new Date(normalizeToUtcWithoutOffset(dayjs(ticket.validTo))) < now) || (new Date(normalizeToUtcWithoutOffset(dayjs(ticket.salesEnd))) < now)) ? (
                            <Text type="secondary">Больше не продаётся</Text>
                          ) : (
                            <Text type="secondary">
                              <span style={{ color: "green", fontWeight: 600 }}>
                                В продаже
                              </span>{" "}
                              • до{" "}
                              {formatTime(ticket.salesEnd, {
                                showDate: true,
                                showYear: true,
                              })}
                            </Text>
                          )}
                        </Col>
                        <Col span={4}>
                          <Text>
                            <span style={{ fontWeight: 600, marginRight: 10 }}>
                              Продано:
                            </span>{" "}
                            {ticket.soldCount}/{ticket.count}
                          </Text>
                        </Col>
                        <Col span={4} align="middle">
                          <Text strong>
                            {ticket.price === 0 ? "free" : `${ticket.price}₽`}
                          </Text>
                        </Col>
                      </Flex>
                      <Flex align="center">
                        <Col>
                          <MyDropdown
                            items={[
                              {
                                key: "copy",
                                label: "Копировать",
                                onClick: () => {
                                  setEditingTicket(ticket);
                                  setMode("copy");
                                  setDrawerOpen(true);
                                },
                              },
                              {
                                key: "edit",
                                label: "Редактировать",
                                onClick: () => {
                                  setEditingTicket(ticket);
                                  setMode("edit");
                                  setDrawerOpen(true);
                                },
                              },
                              {
                                key: "delete",
                                label: "Удалить",
                                onClick: () => handleDeleteTicket(ticket.id),
                              },
                              {
                                key: "refand",
                                label: (
                                  <Tooltip
                                    title={
                                      ticket.soldCount === 0 || isCompletedEvent || (ticket.validTo && new Date(normalizeToUtcWithoutOffset(dayjs(ticket.validTo))) < now)
                                        ? "Нет покупок для возврата или срок действия билета истёк"
                                        : ""
                                    }
                                  >
                                    <span
                                      style={{
                                        color:
                                          ticket.soldCount === 0 ||
                                          isCompletedEvent || (ticket.validTo && new Date(normalizeToUtcWithoutOffset(dayjs(ticket.validTo))) < now)
                                            ? "#ccc"
                                            : undefined,
                                      }}
                                    >
                                      Вернуть все
                                    </span>
                                  </Tooltip>
                                ),
                                onClick: () => handleRefundTicket(ticket.id),
                                disabled:
                                  ticket.soldCount === 0 || isCompletedEvent || (ticket.validTo && new Date(normalizeToUtcWithoutOffset(dayjs(ticket.validTo))) < now),
                              },
                            ]}
                            trigger={["click"]}
                            className={styles.settingsButton}
                          >
                            <MoreOutlined
                              style={{ fontSize: 20, cursor: "pointer" }}
                            />
                          </MyDropdown>
                        </Col>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            ))}
          </Flex>
        ) : (
          <Flex vertical gap={0}>
            {allTicketsData?.tickets.map((ticket) => (
              <Flex key={ticket.id} className={styles.ticketCard}>
                <Flex
                  align="center"
                  gap={20}
                  className={styles.inner}
                  onClick={() => {
                    setEditingTicket(ticket);
                    setMode("edit");
                    setDrawerOpen(true);
                  }}
                >
                  <IoTicketOutline size={30} color="gray" />
                  <Col span={11}>
                    <Title level={5} className={styles.title}>
                      {ticket.name}
                    </Title>
                    {isCompletedEvent || ((new Date(normalizeToUtcWithoutOffset(dayjs(ticket.validTo))) < now) || (new Date(normalizeToUtcWithoutOffset(dayjs(ticket.salesEnd))) < now)) ? (
                      <Text type="secondary">Больше не продаётся</Text>
                    ) : (
                      <Text type="secondary">
                        <span style={{ color: "green", fontWeight: 600 }}>
                          В продаже
                        </span>{" "}
                        • до{" "}
                        {formatTime(ticket.salesEnd, {
                          showDate: true,
                          showYear: true,
                        })}
                      </Text>
                    )}
                  </Col>
                  <Col span={4}>
                    <Text>
                      <span style={{ fontWeight: 600, marginRight: 10 }}>
                        Продано:
                      </span>{" "}
                      {ticket.soldCount}/{ticket.count}
                    </Text>
                  </Col>
                  <Col span={4} align="middle">
                    <Text strong>
                      {ticket.price === 0 ? "free" : `${ticket.price}₽`}
                    </Text>
                  </Col>
                </Flex>
                <Flex align="center">
                  <Col>
                    <MyDropdown
                      menu={{
                        items: [
                          {
                            key: "copy",
                            label: "Копировать",
                            onClick: () => {
                              setEditingTicket(ticket);
                              setMode("copy");
                              setDrawerOpen(true);
                            },
                          },
                          {
                            key: "edit",
                            label: "Редактировать",
                            onClick: () => {
                              setEditingTicket(ticket);
                              setMode("edit");
                              setDrawerOpen(true);
                            },
                          },
                          {
                            key: "delete",
                            label: "Удалить",
                            onClick: () => handleDeleteTicket(ticket.id),
                          },
                          {
                            key: "refand",
                            label: (
                              <Tooltip
                                title={
                                  ticket.soldCount === 0 || isCompletedEvent || (new Date(normalizeToUtcWithoutOffset(dayjs(ticket.validTo))) < now)
                                    ? "Нет покупок для возврата или билет больше не действителен"
                                    : ""
                                }
                              >
                                <span
                                  style={{
                                    color:
                                      ticket.soldCount === 0 || isCompletedEvent || (new Date(normalizeToUtcWithoutOffset(dayjs(ticket.validTo))) < now)
                                        ? "#ccc"
                                        : undefined,
                                  }}
                                >
                                  Вернуть все
                                </span>
                              </Tooltip>
                            ),
                            onClick: () => handleRefundTicket(ticket.id),
                            disabled:
                              ticket.soldCount === 0 || isCompletedEvent || (new Date(normalizeToUtcWithoutOffset(dayjs(ticket.validTo))) < now),
                          },
                        ],
                      }}
                      trigger={["click"]}
                      className={styles.settingsButton}
                    >
                      <MoreOutlined
                        style={{ fontSize: 20, cursor: "pointer" }}
                      />
                    </MyDropdown>
                  </Col>
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>

      <TicketDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSaveTicket}
        ticket={editingTicket}
        eventData={eventData}
        mode={mode}
      />
    </div>
  );
};

export default TicketsPage;
