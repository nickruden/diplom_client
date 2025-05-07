import React from "react";
import { Typography, Space, Flex, Tabs, Select } from "antd";
import styles from "./TicketsList.module.scss";
import TicketCard from "../TicketCard/TicketCard";
import { MyEmpty, MyLoader } from "../../../../common/components";
import { LuTickets } from "react-icons/lu";
import { LuLaptopMinimal } from "react-icons/lu";
import { SiOpenstreetmap } from "react-icons/si";

import { useGetMyTickets } from "../../../../common/API/services/tickets/hooks.api";
import { FaCalendarAlt, FaList } from "react-icons/fa";
import SearchInput from "../../../../common/components/UI/Search/Search";
import MySegmented from "../../../../common/components/UI/Segmented/MuSegmented";

const { Title } = Typography;

const TicketsList = () => {
  const {
    data: ticketsData,
    isLoading: ticketsDataLoading,
    refetch: refetchPurchase,
    error: ticketsDataErrorLoading,
  } = useGetMyTickets();
  console.log(ticketsData);

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
            <Flex
              align="center"
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
                <MySegmented
                  options={[
                    { label: "Все", value: "all" },
                    { label: "Ближайшие", value: "soon" },
                  ]}
                  value="all"
                  onChange={(value) => handleInputChange("locationType", value)}
                  size="large"
                  style={{ marginBottom: 0 }}
                />
              </Flex>
            </Flex>
            <Flex vertical gap={50} style={{ width: "100%" }}>
              {ticketsData.map((ticket) => (
                <TicketCard purchase={ticket} refetchPurchase={refetchPurchase} />
              ))}
            </Flex>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsList;
