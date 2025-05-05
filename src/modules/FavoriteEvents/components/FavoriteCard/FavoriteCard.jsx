import React from "react";
import { Typography, Image, Flex } from "antd";
import styles from "./FavoriteCard.module.scss";
import { Link } from "react-router-dom";
import { FaMapLocationDot } from "react-icons/fa6";
import { FavoriteButton } from "../../../../common/components";
import { formatDate, formatTime } from "../../../../common/utils/Date/formatDate";
import { getEventPrice } from "../../../../common/utils/Ticket/formatPrice";

const { Title, Text } = Typography;

const FavoriteCard = ({ event }) => {
  const priceInfo = getEventPrice(event.tickets);

  return (
    <div className={styles.card} bordered={false}>
      <Flex align="center" justify="space-between">
        <Link to={`/event/${event.id}`} vertical className={styles.eventInfo}>
          <Title level={5} className={styles.title}>{event.name}</Title>
          <Text className={styles.date}>{formatTime(event.startTime, {showDate: true, showWeekday: true} )}</Text>
          <Text className={styles.location}><FaMapLocationDot />{event.location}</Text>
          <Text className={styles.price}>{priceInfo.display}</Text>
        </Link>
        <Flex vertical gap={20} className={styles.eventActions}>
          <Image
            width={250}
            height={120}
            src={event.images[0].imageUrl}
            preview={false}
            className={styles.image}
          />
          <Flex gap={10} className={styles.actions}>
            <FavoriteButton eventId={event.id} />
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default FavoriteCard;