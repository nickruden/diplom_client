import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Flex,
  Typography,
  Col,
  Tooltip,
  Modal,
} from "antd";

const { Title, Text } = Typography;

import { useCreateTicket, useDeleteTicket, useGetTicketsByEvent, useUpdateTicket } from "../../../../common/API/services/tickets/hooks.api";

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
import { formatTime } from "../../../../common/utils/Date/formatDate";
import { useEditEvent } from "../../../../common/API/services/events/hooks.api";


const TicketsPage = ({refetchEventData, eventData}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const { id } = useParams();

  const { data: allTicketsData, isLoading: ticketsLoading, isError, error, refetch } = useGetTicketsByEvent(id);
  const { mutate: createTicket } = useCreateTicket();
  const { mutate: updateTicket } = useUpdateTicket();
  const { mutateAsync: deleteTicket, error: deleteError } = useDeleteTicket(id);
  const { mutateAsync: updateEvent } = useEditEvent();

  const handleSaveTicket = async (ticketData) => {
    console.log(ticketData)
    try {
      if (editingTicket) {
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

  const handleDeleteTicket = async (ticketId) => {
    try {
      await deleteTicket(ticketId);
      await refetch();
      await updateEvent({ id: ticketId, data: { status: "Черновик" } });
      await refetchEventData();
    } catch (error) {
      if (error?.response?.data?.error === "TICKET_HAS_PURCHASES") {
        Modal.error({
          title: 'Ошибка удаления',
          content: 'Невозможно удалить билет. Есть люди купившие его! Если хотите чтобы билет больше не продавался, уменьшите общее количество этого билета до количества купленных!',
          okText: 'Понятно',
        });
      }
    }
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
          <Text className={styles.ticketsCount}>{allTicketsData?.totalTickets || 0}</Text>
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
          <MyLoader style={{paddingTop: 50}} />
        ) : (isError && error?.response?.status === 404) || (!allTicketsData || allTicketsData.length === 0) ? (
          <MyEmpty image={<LuTickets size={80} />} title="Нет билетов" />
        ) : (
          <Flex vertical gap={0}>
            {allTicketsData?.tickets.map((ticket) => (
              <Flex
                key={ticket.id}
                className={styles.ticketCard}
              >
                <Flex align="center" gap={20} className={styles.inner} onClick={() => { setEditingTicket(ticket); setDrawerOpen(true) }}>
                  <IoTicketOutline size={30} color="gray" />
                  <Col span={11}>
                    <Title level={5} className={styles.title}>
                      {ticket.name}
                    </Title>
                    {/* <Text type="secondary">
                      <span style={{ color: "green", fontWeight: 600 }}>
                        {" "}
                        В продаже
                      </span>{" "}
                      • до {formatTime(ticket.salesEnd)}
                    </Text> */}
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
                            key: "edit",
                            label: "Редактировать",
                            onClick: () => {setEditingTicket(ticket); setDrawerOpen(true)},
                          },
                          { key: "delete", label: "Удалить", onClick: () => handleDeleteTicket(ticket.id)
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
        event={eventData}
      />
    </div>
  );
};

export default TicketsPage;
