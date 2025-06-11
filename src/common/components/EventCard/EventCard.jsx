import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Flex, Typography } from "antd";
const { Title, Paragraph } = Typography;

import { formatDate, formatTime, formatTimeRange } from "../../utils/Date/formatDate";
import { getEventPrice } from "../../utils/Ticket/formatPrice";

import { FaMapLocationDot } from "react-icons/fa6";
import { MdCurrencyRuble } from "react-icons/md";

import MyAvatar from "../Avatar/MyAvatar";

import styles from "./EventCard.module.scss";
import { useAuth } from "../../hooks/useAuth";
import FavoriteButton from "../FavoriteButton/FavoriteButton";


const EventCard = ({ data, noLinks, ...props }) => {
  const [rows, setRows] = useState(2);
  const { user }= useAuth();

  const priceInfo = getEventPrice(data.tickets);
  console.log(data)

  return (
    <div className={styles.eventCard} {...props}>
      <div className={styles.eventCard__container}>
        <Flex vertical className={styles.eventCard__inner}>
          {noLinks ? (
            <div className={styles.eventCard__image}>
              <img
                src={data.images.find((image) => image.isMain)?.imageUrl}
                alt="promo image event"
              />
            </div>
          ) : user?.id === data.organizerId ? (
            <Link to={`/event/${data.id}`}>
              <div className={styles.eventCard__image}>
                <img
                  src={data.images.find((image) => image.isMain)?.imageUrl}
                  alt="promo image event"
                />
              </div>
            </Link>
          ) : (
            <Flex className={styles.imageWrap}>
              <FavoriteButton
                eventId={data.id}
                style={{ top: 10, right: 10 }}
                className={styles.favoriteButton}
              />
              <Link to={`/event/${data.id}`} style={{ width: "100%" }}>
                <div className={styles.eventCard__image}>
                  <img
                    src={data.images.find((image) => image.isMain)?.imageUrl}
                    alt="promo image event"
                  />
                </div>
              </Link>
            </Flex>
          )}
          <Flex vertical gap="5px" className={styles.eventCard__body}>
            <div className={styles.eventCard__timeStart}>
              {formatDate(data.activeDate, {noNormalize: false})}
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
