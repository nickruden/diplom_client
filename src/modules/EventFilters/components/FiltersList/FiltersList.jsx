import React, { useState, useEffect } from "react";
import { Typography, Tabs, ConfigProvider, Flex } from "antd";
import { useSearchParams } from "react-router-dom";

const { Title } = Typography;
import dayjs from "dayjs";

import SelectCity from "../SelectCity/SelectCity";

const filters = [
  { key: "all", label: "Все" },
  { key: "online", label: "Online" },
  { key: "free", label: "Бесплатные" },
  { key: "today", label: "Сегодня" },
  { key: "weekend", label: "Выходные" },
];

import "./FiltersList.scss";
import MyDateTimePicker from "../../../../common/components/UI/DatePicker/MyDatePicker";

const FiltersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dates, setDates] = useState([]);

  const activeFilter = searchParams.get("type") || "all";

  // Функция получения выходных
  const getWeekendRange = () => {
    const today = dayjs();
    const dayOfWeek = today.day();

    const saturday = dayOfWeek <= 6 ? today.add(6 - dayOfWeek, "day") : today;
    const sunday = saturday.add(1, "day");

    return [saturday, sunday];
  };

  const handleTabChange = (key) => {
    const newParams = new URLSearchParams(searchParams);

    const today = dayjs();

    if (key === "today") {
      newParams.set("type", key);
      newParams.set("startDate", today.format("YYYY-MM-DD"));
      newParams.set("endDate", today.format("YYYY-MM-DD"));
      setDates([today, today]);
    } else if (key === "weekend") {
      const [start, end] = getWeekendRange();
      newParams.set("type", key);
      newParams.set("startDate", start.format("YYYY-MM-DD"));
      newParams.set("endDate", end.format("YYYY-MM-DD"));
      setDates([start, end]);
    } else {
      newParams.set("type", key);
      newParams.delete("date");
      newParams.delete("startDate");
      newParams.delete("endDate");
      setDates([]);
    }

    setSearchParams(newParams);
  };

  const handleDateChange = (dates) => {
    const newParams = new URLSearchParams(searchParams);
    const currentType = searchParams.get("type");

    const isCleared = !dates || dates.length === 0 || !dates[0] || !dates[1];

    if (!isCleared) {
      newParams.set("startDate", dates[0].format("YYYY-MM-DD"));
      newParams.set("endDate", dates[1].format("YYYY-MM-DD"));

      if (
        currentType === "today" ||
        currentType === "weekend" ||
        currentType === "all"
      ) {
        newParams.set("type", "date");
      }

      setDates(dates);
    } else {
      newParams.delete("date");
      newParams.delete("startDate");
      newParams.delete("endDate");

      if (["today", "weekend", "date"].includes(currentType)) {
        newParams.set("type", "all");
      }

      setDates([]);
    }

    setSearchParams(newParams);
  };

  const handleCityChange = (city) => {
    const newParams = new URLSearchParams(searchParams);
    if (city) {
      newParams.set("city", city);
    } else {
      newParams.delete("city");
    }
    setSearchParams(newParams);
  };

  return (
    <div className="eventFilters" id="filters">
      <div className="my-container">
        <Title level={1} className="eventFilters__filterLocation">
          Найти события в <SelectCity onChange={handleCityChange} />
        </Title>
        <Flex gap="20px" className="eventFilters__filterContainer">
          <div className="eventFilters__filterTabs">
            <Tabs
              activeKey={activeFilter}
              onChange={handleTabChange}
              tabBarGutter={30}
              tabBarStyle={{ marginBottom: 0 }}
              items={filters.map((filter) => ({
                key: filter.key,
                label: filter.label,
              }))}
            />
          </div>
          <div className="eventFilters__dateFilter">
            <MyDateTimePicker
              placeholder={["Начальная дата", "Конечная дата"]}
              allowClear={true}
              value={dates}
              onChange={handleDateChange}
              type="range"
              size="large"
            />
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default FiltersList;
