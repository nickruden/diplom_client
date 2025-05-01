import React from "react";
import { Select } from "antd";
import './MySelect.scss';

const { Option } = Select;

const MySelect = ({ value, onChange, placeholder, size, options = [], ...props }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="custom-select"
      size={size}
      {...props}
    >
      {options.map(({ value, label }) => (
        <Option key={value} value={value}>
          {label}
        </Option>
      ))}
    </Select>
  );
};

export default MySelect;
