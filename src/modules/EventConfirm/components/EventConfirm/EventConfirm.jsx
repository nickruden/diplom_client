import React, { useEffect, useState } from "react";
import { Card, Radio, InputNumber, Divider, Flex, Typography } from "antd";

const { Text, Title } = Typography;

import { calculateDuration } from "../../../../common/utils/Date/calculateDuration";
import { categoryConfig } from "../../../../pages/EventPage/API/caregoryStyles";

import { CheckOutlined } from "@ant-design/icons";
import { BsPeople } from "react-icons/bs";
import { MdAccessTime } from "react-icons/md";

import EventCard from "../../../../common/components/EventCard/EventCard";

import styles from "./EventConfirm.module.scss";
import dayjs from "dayjs";
import { normalizeToUtcWithoutOffset } from "../../../../common/utils/Date/formatDate";

const EventPublishPage = ({ handleInputChange, eventData }) => {
  const [refundAllowed, setRefundAllowed] = useState(eventData?.refundDateCount ? true : false);
  
  const [refundDays, setRefundDays] = useState(eventData?.refundDateCount || 1);

  const [autoConfirmRefund, setAutoConfirmRefund] = useState(
    eventData?.isAutoRefund ?? false
  );
  const [selectedTariff, setSelectedTariff] = useState(eventData.isPrime);

  const daysUntilEnd = normalizeToUtcWithoutOffset(dayjs(eventData.endTime)).isBefore(dayjs(), 'day');
  const isFreeEvent = !eventData?.tickets?.some((t) => t.price > 0);

  useEffect(() => {
    if (isFreeEvent) {  
      setRefundAllowed(true);
      setAutoConfirmRefund(true);
      setRefundDays(0);
      handleInputChange("isAutoRefund", true);
      handleInputChange("refundDateCount", 1);
      return;
    }

    if (daysUntilEnd) {
      setRefundAllowed(false);
      setAutoConfirmRefund(false);
      handleInputChange("isAutoRefund", false);
      handleInputChange("refundDateCount", 0);
      return;
    }

    // если возврат разрешён и не бесплатное
    if (refundAllowed) {
      console.log("Normal refund handling");

      const days = refundDays ?? 1;
      handleInputChange("refundDateCount", days);
      handleInputChange("isAutoRefund", autoConfirmRefund);
    } else {
      handleInputChange("refundDateCount", 0);
      handleInputChange("isAutoRefund", false);
    }
  }, [
    refundAllowed,
    refundDays,
    autoConfirmRefund,
    eventData,
    isFreeEvent,
    daysUntilEnd
  ]);

  return (
    <div className={styles.eventPublishPage}>
      <Flex vertical gap={25} className={styles.eventPublishPage__header}>
        <div className={styles.title}>Ваше объявление готово к публикации</div>
        <Text className={styles.subtitle}>
          Проверьте настройки и опубликуйте мероприятие.
        </Text>
      </Flex>

      <Flex
        justify="space-between"
        gap={50}
        className={styles.eventPublishPage__eventInfo}
      >
        <EventCard data={eventData} noLinks="true" style={{ width: "50%" }} />
        <Flex
          vertical
          justify="center"
          align="center"
          gap={50}
          style={{ width: "50%" }}
        >
          <Flex vertical align="center" gap={10}>
            <div style={{ fontWeight: 600, fontSize: 18 }}>Категория:</div>
            <Flex
              align="center"
              gap={10}
              style={{
                color:
                  categoryConfig[eventData.category.slug]?.textColor || "#000",
                background:
                  categoryConfig[eventData.category.slug]?.gradient || "#EEE",
                backgroundImage:
                  categoryConfig[eventData.category.slug]?.gradient,
                borderColor: categoryConfig[eventData.category.slug]?.gradient,
              }}
              className={styles.category}
            >
              {eventData.category.name}
            </Flex>
          </Flex>
          <Flex vertical align="center" gap={10}>
            <div style={{ fontWeight: 600, fontSize: 18 }}>Билетов всего:</div>
            <Flex align="center" gap={10} style={{ fontSize: 18 }}>
              <BsPeople size={20} /> {eventData.totalTicketsCount}
            </Flex>
          </Flex>
          <Flex vertical align="center" gap={10}>
            <div style={{ fontWeight: 600, fontSize: 18 }}>
              Продолжительность:
            </div>
            <Flex align="center" gap={10} style={{ fontSize: 18 }}>
              <MdAccessTime size={20} />{" "}
              {calculateDuration(eventData.startTime, eventData.endTime)}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Divider />

      <Flex vertical className={styles.eventPublishPage__settingsEvent}>
        <Flex vertical>
          <div className={styles.title}>Настройки публикации</div>
          {!isFreeEvent && (
            <Flex vertical gap={20} className={styles.infoBlock}>
              <Flex vertical gap={15} className={styles.infoBlock__header}>
                <div className={styles.infoBlocktitle}>Возврат билета</div>
                <Radio.Group
                  value={refundAllowed}
                  onChange={(e) => setRefundAllowed(e.target.value)}
                  options={[
                    { label: "Возврат невозможен", value: false },
                    { label: "Разрешить возврат", value: true },
                  ]}
                  optionType="button"
                />
              </Flex>

              {refundAllowed && (
                <Flex vertical gap={20}>
                  <Flex vertical gap={15} className={styles.refundDays}>
                    <Text className={styles.grayText}>
                      За сколько дней до начала <br /> можно вернуть
                      билет? (1 - 30)
                    </Text>
                    <InputNumber
                      placeholder="Дней до окончания события"
                      min={1}
                      max={30}
                      value={refundDays}
                      onChange={(value) => { setRefundDays(value); }}
                    />
                  </Flex>
                </Flex>
              )}
            </Flex>
          )}

          {isFreeEvent && (
            <Flex vertical gap={10} className={styles.infoBlock}>
              <Flex vertical gap={15} className={styles.infoBlock__header}>
                <div className={styles.infoBlocktitle}>Возврат билета</div>
              </Flex>
              <Text className={styles.grayText} style={{ lineHeight: 1.5 }}>
                Для бесплатных мероприятий возврат билетов <br></br> разрешён
                автоматически до окончания действия билета.
              </Text>
            </Flex>
          )}

          <Flex vertical gap={20} className={styles.infoBlock}>
            <Flex vertical gap={15} className={styles.infoBlock__header}>
              <div className={styles.infoBlocktitle}>Выберите тариф</div>
            </Flex>
            <Flex className={styles.tariffs}>
              <Card
                className={`${styles.tariffCard} ${
                  selectedTariff === 0 ? styles.selected : ""
                }`}
                onClick={() => {
                  setSelectedTariff(0);
                  handleInputChange("isPrime", false);
                }}
              >
                <div className={styles.tariffCard__title}>Бесплатно</div>
                <Text className={styles.tariffCard__text}>
                  Публикация мероприятия без дополнительных функций
                </Text>
                {selectedTariff === 0 && (
                  <CheckOutlined className={styles.checkIcon} />
                )}
              </Card>
              <Card
                className={`${styles.tariffCard} ${
                  selectedTariff === 1 ? styles.selected : ""
                }`}
                onClick={() => {
                  setSelectedTariff(1);
                  handleInputChange("isPrime", true);
                }}
              >
                <div className={styles.tariffCard__title}>499₽</div>
                <Text className={styles.tariffCard__text}>
                  Приоритет в поиске и расположение в главной карусели на 1 день
                </Text>
                {selectedTariff === 1 && (
                  <CheckOutlined className={styles.checkIcon} />
                )}
              </Card>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default EventPublishPage;
