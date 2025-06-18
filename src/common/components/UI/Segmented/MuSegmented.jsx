import React from "react";
import { Segmented } from "antd";

import "./MySegmented.scss";

const MySegmented = ({ options, value, onChange, ...props }) => {
  return (
    <Segmented
      className="my-segmented"
      options={options}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default MySegmented;
