  import React, { useEffect, useState } from "react";
  import {
    Card,
    Radio,
    InputNumber,
    Divider,
    message,
    Flex,
    Typography,
    Affix,
  } from "antd";

  const { Text, Title } = Typography;

  import { calculateDuration } from "../../../../common/utils/Date/calculateDuration";
  import { categoryConfig } from "../../../../pages/EventPage/API/caregoryStyles";

  import { CheckOutlined } from "@ant-design/icons";
  import { BsPeople } from "react-icons/bs";
  import { MdAccessTime } from "react-icons/md";

  import EventCard from "../../../../common/components/EventCard/EventCard";
  import MySwitch from "../../../../common/components/UI/Switch/MySwitch";
  import MyButton from "../../../../common/components/UI/Button/MyButton"

  import styles from "./EventConfirm.module.scss";
  import { useParams } from "react-router-dom";
  import { useGetEventById } from "../../../../common/API/services/events/hooks.api";
  import dayjs from "dayjs";
  import { formatDate } from "../../../../common/utils/Date/formatDate";


  const EventPublishPage = ({ handleInputChange, eventData }) => {
    const { id } = useParams();

    const [refundAllowed, setRefundAllowed] = useState(eventData?.isRefundAllowed ?? false);
    const [refundDays, setRefundDays] = useState(1);
    
    const [autoConfirmRefund, setAutoConfirmRefund] = useState(eventData?.isAutoRefund ?? false);
    const [selectedTariff, setSelectedTariff] = useState(eventData.isPrime);

    useEffect(() => {
      if (!eventData) return;
    
      if (refundAllowed) {
        const days = refundDays ?? 1;
        const newRefundDate = dayjs(eventData.endTime).subtract(days, "day");
        handleInputChange("refundDate", newRefundDate);
        handleInputChange("isAutoRefund", autoConfirmRefund);
      } else {
        const previousDate = dayjs(eventData.createdAt).subtract(1, "day");
        handleInputChange("refundDate", previousDate);
        handleInputChange("isAutoRefund", false);
      }
    }, [refundAllowed, refundDays, autoConfirmRefund, eventData]); 
    

    return (
      <div className={styles.eventPublishPage}>
        <Flex vertical gap={25} className={styles.eventPublishPage__header}>
          <div className={styles.title}>
            Ваше объявление готово к публикации
          </div>
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
                    categoryConfig[eventData.category.slug]?.textColor ||
                    "#000",
                  background:
                    categoryConfig[eventData.category.slug]?.gradient || "#EEE",
                  backgroundImage:
                    categoryConfig[eventData.category.slug]?.gradient,
                  borderColor:
                    categoryConfig[eventData.category.slug]?.gradient,
                }}
                className={styles.category}
              >
                {eventData.category.name}
              </Flex>
            </Flex>
            <Flex vertical align="center" gap={10}>
              <div style={{ fontWeight: 600, fontSize: 18 }}>
                Билетов всего:
              </div>
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
                {calculateDuration(eventData.startTime, eventData.endTime)}{" "}
                часа(ов)
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Divider />

        <Flex vertical className={styles.eventPublishPage__settingsEvent}>
          <Flex vertical>
            <div className={styles.title}>Настройки публикации</div>
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
                      За сколько дней до начала мероприятия <br /> можно вернуть
                      билет? (1 - 30)
                    </Text>
                    <Text className={styles.grayText}>
                      Максимальное значение для вашего мероприятия{" "}
                      <span style={{ color: "#000" }}>
                        {Math.min(
                          30,
                          dayjs(eventData.endTime).diff(dayjs(), "day") - 1
                        )}{" "}
                        дней
                      </span>
                    </Text>
                    <InputNumber
                      placeholder="Дней до окончания события"
                      min={1}
                      max={Math.max(
                        1,
                        dayjs(eventData.endTime).diff(dayjs(), "day") - 1
                      )}
                      value={refundDays}
                      onChange={(value) => {
                        const maxDays =
                          dayjs(eventData.endTime).diff(dayjs(), "day") - 1;
                        setRefundDays(Math.min(value, maxDays));
                      }}
                    />

                    <Text style={{ color: "red" }}>
                      Люди смогут вернуть билеты до{" "}
                      {dayjs(eventData.endTime)
                        .subtract(refundDays, "day")
                        .format("DD.MM.YYYY")}
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <MySwitch
                      title="Автоматически подтверждать возвраты"
                      checked={autoConfirmRefund}
                      onChange={setAutoConfirmRefund}
                    />
                    <Text className={styles.grayText}>
                      Если включено, пользователи смогут оформить возврат <br />{" "}
                      без вашего участия, в случае если бюджет вашего <br />{" "}
                      мероприятия позволяет{" "}
                      <Text style={{ color: "red" }}>
                        (иначе обработка происходит вручную)
                      </Text>
                    </Text>
                  </Flex>
                </Flex>
              )}
            </Flex>

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
                    Приоритет в поиске и расположение в главной карусели на 1
                    день
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
