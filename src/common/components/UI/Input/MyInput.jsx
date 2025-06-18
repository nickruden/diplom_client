import React from "react";
import { Input, InputNumber } from "antd";
import './MyInput.scss';

const MyInput = ({
  placeholder = "Введите текст",
  borderRadius,
  width = "500px",
  size,
  prefix,
  type = "text",
  ...props
}) => {
  const commonStyle = { width, borderRadius };

  return (
    <div className="my-input">
      {type === "number" ? (
        <InputNumber
          placeholder={placeholder}
          size={size}
          style={commonStyle}
          className="input"
          {...props}
        />
      ) : (
        <Input
          placeholder={placeholder}
          size={size}
          style={commonStyle}
          prefix={prefix}
          className="input"
          type={type}
          {...props}
        />
      )}
    </div>
  );
};

export default MyInput;
