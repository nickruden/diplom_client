import React, { useRef, useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const cities = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Самара',
  'Омск',
  'Ростов-на-Дону',
  'Уфа',
  'Красноярск',
  'Пермь',
  'Воронеж',
  'Волгоград'
];

import './SelectCity.scss';

const SelectCity = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleChange = (value) => {
    setSelectedCity(value);
    setSearchValue('');
    if (onChange) onChange(value);
  };

  return (
    <div className="filters">
    <Select
      showSearch
      value={selectedCity}
      placeholder="Выберите город"
      defaultActiveFirstOption={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent="нет данных"
      className="locationFilter"
    >
      {filteredCities.map(city => (
        <Option key={city} value={city}>
          {city}
        </Option>
      ))}
    </Select>
    </div>
  );
};

export default SelectCity;