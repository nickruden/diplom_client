import React, { useState } from "react";
import { Link } from "react-router-dom";

import { FaMapLocationDot } from "react-icons/fa6";
import { MdCurrencyRuble } from "react-icons/md";

import { Card, Avatar, Row, Col, Flex, Typography } from "antd";
const { Title, Paragraph } = Typography;

import styles from "./EventCard.module.scss";
import { useGetCreatorInfoById } from "../../API/services/user/hooks.api";
import { formatDate } from "../../utils/Date/formatDate";
import { getEventPrice } from "../../utils/Ticket/formatPrice";
import MyAvatar from "../Avatar/MyAvatar";
import { useGetTicketsByEvent } from "../../API/services/tickets/hooks.api";

const EventCard = ({ data, noLinks, ...props }) => {
  const [rows, setRows] = useState(2);
  console.log(data)

  const priceInfo = getEventPrice(data.tickets);

  return (
    <div className={styles.eventCard} {...props}>
      <div className={styles.eventCard__container}>
        <Flex vertical className={styles.eventCard__innner}>
          {noLinks ? (
            <div className={styles.eventCard__image}>
              <img
                src={data.images.find((image) => image.isMain)?.imageUrl}
                alt="promo image event"
              />
            </div>
          ) : (
            <Link to={`/event/${data.id}`}>
              <div className={styles.eventCard__image}>
                <img
                  src={data.images.find((image) => image.isMain)?.imageUrl}
                  alt="promo image event"
                />
              </div>
            </Link>
          )}
          <Flex vertical gap="5px" className={styles.eventCard__body}>
            <div className={styles.eventCard__timeStart}>
              {formatDate(data.startTime, true)}
            </div>
            {noLinks ? (
              <Paragraph
                ellipsis={{ rows }}
                className={styles.eventCard__titleWrap}
              >
                <Title level={4} className={styles.eventCard__title}>
                  {data.name}
                </Title>
              </Paragraph>
            ) : (
              <Link to={`/event/${data.id}`}>
                <Paragraph
                  ellipsis={{ rows }}
                  className={styles.eventCard__titleWrap}
                >
                  <Title level={4} className={styles.eventCard__title}>
                    {data.name}
                  </Title>
                </Paragraph>
              </Link>
            )}
            <div className={styles.eventCard__location}>
              <FaMapLocationDot /> {data.location}
            </div>

            <div
              className={
                priceInfo.value === 0
                  ? [styles.eventCard__price, styles._free].join(" ")
                  : styles.eventCard__price
              }
            >
              {priceInfo.display} {priceInfo.value > 0 && <MdCurrencyRuble />}
            </div>

            <Link to={`/creator/${data.organizerId}`}>
              <div className={styles.eventCard__author}>
                <Row align="middle" gutter={10}>
                  <Col>
                    <MyAvatar imageSrc={data.organizer.avatar} />
                  </Col>
                  <Col>
                    <div style={{ color: "gray" }}>
                      {data.organizer.organizerName}
                    </div>
                  </Col>
                </Row>
              </div>
            </Link>
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

export default EventCard;
