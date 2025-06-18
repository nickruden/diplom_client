import React, { useRef, useState } from "react";
import { Typography, QRCode, Image, Flex, Modal } from "antd";
import styles from "./TicketCard.module.scss";
import {
  formatDate,
  formatTime,
  formatTimeRange,
} from "../../../../common/utils/Date/formatDate";
import miniLogo from "../../../../assets/MiniLogo.svg";
import { Link } from "react-router-dom";
import Paragraph from "antd/es/typography/Paragraph";
const { Title, Text } = Typography;
import { GrMapLocation } from "react-icons/gr";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import MyButton from "../../../../common/components/UI/Button/MyButton";
import { useRefundTicket } from "../../../../common/API/services/payment/hooks.api";
import { FaExternalLinkAlt } from "react-icons/fa";


const TicketCard = ({ purchase, refetchPurchase, isEventCompleted }) => {
  const [rows, setRows] = useState(2);
  const { eventInfo, purchaseId, ticketInfo } = purchase;
  const qrValue = `https://yourapp.com/check-ticket/${purchaseId}`;
  const { mutateAsync: refoundTicket, error: refoundError, isLoading } = useRefundTicket();

  const isOnline = eventInfo.location === "Онлайн";

  let onlineInfo = null;
  try {
    onlineInfo = eventInfo.onlineInfo ? JSON.parse(eventInfo.onlineInfo) : null;
  } catch (err) {
    console.warn("Ошибка при парсинге onlineInfo", err);
  }

  const handleRefund = () => {
    Modal.confirm({
      title: "Вы уверены, что хотите вернуть билет?",
      content: "После возврата вы не сможете использовать этот билет.",
      okText: "Вернуть",
      cancelText: "Отмена",
      onOk: async () => {
        try {
          await refoundTicket(purchaseId);
          await refetchPurchase();
        } catch (err) {
          console.error(err);
        }
      },
    });
  };

  return (
    <Flex
      vertical
      gap={10}
      className={`${styles.ticketsWrapper} ${isEventCompleted ? styles.ticketCompleted : ""}`}
    >
      <Flex justify="space-between" align="center">
        {purchase.refundDeadline && !isEventCompleted ? (
          <Text type="secondary" style={{ fontSize: 18, fontStyle: "italic" }}>
            Возврат возможен до: {formatDate(purchase.refundDeadline)}
          </Text>
        ) : (
          <Text type="danger" style={{ fontSize: 18, fontStyle: "italic" }}>
            Возврат невозможен
          </Text>
        )}
        <Flex gap={20} justify="flex-end" className={styles.ticketActions}>
          <MyButton
            type="text"
            danger
            style={{ fontSize: "16px" }}
            onClick={handleRefund}
            loading={isLoading}
            disabled={!purchase.refundDeadline || isEventCompleted}
          >
            <MdDeleteOutline /> Вернуть билет
          </MyButton>
          <MyButton type="default" style={{ fontSize: "16px" }}>
            <MdDeleteOutline /> Скачать
          </MyButton>
        </Flex>
      </Flex>

      <div className={`${styles.ticket} ${isOnline ? styles.online : ""}`}>
        <Link to={`/event/${eventInfo.id}`} style={{ display: "block", width: "100%" }}>
          <Flex gap={30} justify="space-between" flex={1} className={styles.inner}>
            <div className={styles.imageWrapper}>
              <img src={eventInfo.image} alt="event" className={styles.eventImage} />
            </div>
            <Flex vertical flex={1} className={styles.ticketInfo}>
              <Flex vertical gap={10} className={styles.header}>
                <Text className={styles.eventDate}>
                  {formatTimeRange(purchase.validFrom, purchase.validTo, {
                    showYear: false,
                    showWeekday: true,
                    noNormalize: true,
                  })}
                </Text>
                <Paragraph ellipsis={{ rows }} className={styles.eventNameWrap}>
                  <Title level={2} className={styles.eventName}>
                    {eventInfo.name}
                  </Title>
                </Paragraph>
              </Flex>

              <Flex gap={100} className={styles.details}>
                <Flex align="center" gap={10} className={styles.value}>
                  <GrMapLocation size={20} /> {eventInfo.location}
                </Flex>
                <Flex align="center" gap={10} className={styles.value}>
                  <FaRegMoneyBillAlt size={20} /> {purchase.price} ₽
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Link>

        {!isOnline && (
          <Flex vertical align="center" justify="center" gap={10} className={styles.qrSection}>
            <QRCode value={qrValue} size={150} icon={miniLogo} />
            <Text className={styles.ticketId}>#{purchaseId}</Text>
          </Flex>
        )}

        {isOnline && onlineInfo && (
          <div className={styles.onlineAccessBlock}>
            <Flex vertical gap={20}>
              <Flex gap={100}>
                {onlineInfo.link && (
                  <Link to={onlineInfo.link} target="_blank" className={styles.link}>
                    <FaExternalLinkAlt size={20} />
                    Ссылка на мероприятие
                  </Link>
                )}
                {onlineInfo.password && (
                  <Text className={styles.text}>
                    Пароль: <strong>{onlineInfo.password}</strong>
                  </Text>
                )}
              </Flex>
              {onlineInfo.instructions && (
                <Flex className={styles.description}>
                  <div dangerouslySetInnerHTML={{ __html: onlineInfo.instructions }} />
                </Flex>
              )}
            </Flex>
          </div>
        )}
      </div>
    </Flex>
  );
};


export default TicketCard;
