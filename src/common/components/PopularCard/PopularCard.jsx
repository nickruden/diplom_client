import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Flex, Typography } from "antd";
const { Title, Paragraph } = Typography;

import { AiOutlineUsergroupAdd } from "react-icons/ai";

import FollowButton from "../FollowButton/FollowButton";

import styles from "./PopularCard.module.scss";
import MyAvatar from "../Avatar/MyAvatar";


const PopularCard = ({ data }) => {
  const [rows, setRows] = useState(2);

  return (
    <div className={styles.popularCard}>
      <div className={styles.popularCard__container}>
        <Flex vertical align="center" className={styles.popularCard__innner}>
          <Link to={`/creator/${data.id}`}>
            <div className={styles.popularCard__image}>
              <MyAvatar imageSrc={data.avatar} size={100} />
            </div>
          </Link>
          <Flex vertical align="center" gap="5px" className={styles.popularCard__body}>
            <Link to={`/creator/${data.id}`} className={styles.popularCard__titleLink}>
              <Paragraph ellipsis={{ rows }} className={styles.popularCard__titleWrap}>
                <Title level={5} className={styles.popularCard__title}>
                  {data.organizerName}
                </Title>
              </Paragraph>
            </Link>
            <div className={styles.popularCard__countFolowers}>
                <AiOutlineUsergroupAdd /> {data.followersCount}
            </div>
            <FollowButton organizerId={data.id}/>
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

export default PopularCard;
