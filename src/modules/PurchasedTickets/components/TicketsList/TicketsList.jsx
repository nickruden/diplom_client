import React, { useState } from "react";
import { Typography, Space, Flex, Tabs, Select } from "antd";
import styles from "./TicketsList.module.scss";
import TicketCard from "../TicketCard/TicketCard";
import { MyEmpty, MyLoader } from "../../../../common/components";
import { LuTickets } from "react-icons/lu";
import { LuLaptopMinimal } from "react-icons/lu";
import { SiOpenstreetmap } from "react-icons/si";

import { useGetMyTickets } from "../../../../common/API/services/tickets/hooks.api";

const { Title } = Typography;

const TicketsList = () => {
  const [viewMode, setViewMode] = useState("list");

  const {
    data: ticketsData,
    isLoading: ticketsDataLoading,
    refetch: refetchPurchase,
    error: ticketsDataErrorLoading,
  } = useGetMyTickets();

  const filteredTickets = ticketsData
  ?.filter((ticket) => {
    if (viewMode === "list" && ticket.eventInfo.location === "Онлайн") return false;
    if (viewMode === "calendar" && ticket.eventInfo.location !== "Онлайн") return false;

    return true;
  });


  return (
    <div className={styles.ticketsPage}>
      <div className="my-container">
        <Title level={2} className={styles.pageTitle}>
          Мои билеты
        </Title>
        {ticketsDataLoading ? (
          <MyLoader />
        ) : !ticketsData || ticketsData.length === 0 || ticketsDataLoading ? (
          <MyEmpty
            title="Вы пока не покупали билеты"
            image={<LuTickets size={120} />}
          />
        ) : (
          <div className={styles.myTickets}>
            <Tabs
              defaultActiveKey="list"
              onChange={(key) => setViewMode(key)}
              style={{ marginBottom: 30 }}
              items={[
                {
                  label: (
                    <Flex align="center" style={{ fontSize: "16px" }}>
                      <SiOpenstreetmap style={{ marginRight: 6 }} />
                      Офлайн
                    </Flex>
                  ),
                  key: "list",
                },
                {
                  label: (
                    <Flex align="center" style={{ fontSize: "16px" }}>
                      <LuLaptopMinimal style={{ marginRight: 6 }} />
                      Онлайн
                    </Flex>
                  ),
                  key: "calendar",
                },
              ]}
            />
            <Flex vertical gap={50} style={{ width: "100%" }}>
  {filteredTickets.map((ticket) => (
    <TicketCard
      key={ticket.id}
      purchase={ticket}
      isEventCompleted={ticket.eventInfo.status === "Завершено"}
      refetchPurchase={refetchPurchase}
    />
  ))}
</Flex>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsList;
