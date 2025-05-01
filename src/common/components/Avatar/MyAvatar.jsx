import React from "react";
import { Avatar } from "antd";

import { CameraOutlined } from "@ant-design/icons";

const MyAvatar = ({ imageSrc, ...props }) => {
  return (
    <Avatar
      src={imageSrc}
      icon={!imageSrc && <CameraOutlined />}
      {...props}
    />
  );
};

export default MyAvatar;
