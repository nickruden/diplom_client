import React from "react";
import { Checkbox } from "antd";
import "./MyCheckbox.scss";

const MyCheckbox = ({ checked, onChange, children, ...props }) => {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      className="custom-checkbox"
      {...props}
    >
      {children}
    </Checkbox>
  );
};

export default MyCheckbox;
