import React, { useState, useEffect } from "react";
import { Typography, Tabs, ConfigProvider, Flex } from "antd";
import { useSearchParams } from 'react-router-dom';

const { Title } = Typography;
import dayjs from "dayjs";

import SelectCity from "../SelectCity/SelectCity";

const filters = [
  { key: 'all', label: 'Все' },
  { key: 'online', label: 'Online' },
  { key: 'free', label: 'Бесплатные' },
  { key: 'today', label: 'Сегодня' },
  { key: 'weekend', label: 'Выходные' },
];

import './FiltersList.scss'
import MyDateTimePicker from "../../../../common/components/UI/DatePicker/MyDatePicker";

const FiltersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dates, setDates] = useState([]);

  const activeFilter = searchParams.get('type') || 'all';
  const activeDateFilter = searchParams.get('date') || 'all';

  const handleTabChange = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('type', key);
    setSearchParams(newParams);
  };

  const handleDateChange = (dates) => {
    const newParams = new URLSearchParams(searchParams);
    if (dates && dates.length === 2) {
      newParams.set('date', 'custom');
      newParams.set('startDate', dates[0].format('YYYY-MM-DD'));
      newParams.set('endDate', dates[1].format('YYYY-MM-DD'));
    } else {
      newParams.delete('date');
      newParams.delete('startDate');
      newParams.delete('endDate');
    }
    setSearchParams(newParams);
    setDates(dates);
  };

  const handleCityChange = (city) => {
    const newParams = new URLSearchParams(searchParams);
    alert(city)
    if (city) {
      newParams.set('city', city);
    } else {
      newParams.delete('city');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="eventFilters">
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
              items={filters.map(filter => ({
                key: filter.key,
                label: filter.label
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
              size='large'
            />
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default FiltersList;