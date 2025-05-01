import React from "react";
import { Input } from "antd";
import { IoIosSearch } from "react-icons/io";

import './Search.scss';

const SearchInput = ({ placeholder = "Введите текст", onSearch, borderRadius, width = "500px", size, imgSize = "20px", ...props}) => {

  const handlePressEnter = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="my-search">
    <Input
      placeholder={placeholder}
      onPressEnter={handlePressEnter}
      size={size}
      style={{ width, borderRadius }}
      prefix={<IoIosSearch size={imgSize} className="searchInput__icon" />}
      className="searchInput"
      {...props}
    />
    </div>
  );
};

export default SearchInput;