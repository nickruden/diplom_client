import { useEffect, useState } from "react";
import { Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { clearCity, setCity } from "../../../../common/store/slices/city.slice";

const { Option } = Select;

const cities = [
  "Все города",
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Челябинск",
  "Самара",
  "Омск",
  "Ростов-на-Дону",
  "Уфа",
  "Красноярск",
  "Пермь",
  "Воронеж",
  "Волгоград",
  "Симферополь",
];

import "./SelectCity.scss";

const SelectCity = ({ onChange }) => {
  const dispatch = useDispatch();
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  // ✅ При первом рендере читаем из localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem("userCity");
    if (savedCity) {
      setSelectedCity(savedCity);
      dispatch(setCity(savedCity));
      if (onChange) onChange(savedCity);
    }
  }, []);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleChange = (value) => {
    setSelectedCity(value);
    setSearchValue("");

    if (value === "Все города") {
      dispatch(clearCity());
      localStorage.removeItem("userCity");
      if (onChange) onChange(null);
      return;
    }

    dispatch(setCity(value));
    localStorage.setItem("userCity", value);
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
        {filteredCities.map((city) => (
          <Option key={city} value={city}>
            {city}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectCity;
