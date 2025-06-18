import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Button, Typography, Tag, Flex, Spin, Modal } from "antd";
const { Title, Text } = Typography;

import { FaExternalLinkAlt, FaRegCalendarMinus } from "react-icons/fa";
import { RiInfoCardLine } from "react-icons/ri";

import styles from "./EventPreviewCard.module.scss";
import MyButton from "../../../../UI/Button/MyButton";
import MyDropdown from "../../../../UI/Dropdown/MyDropdown";
import { IoIosArrowDown } from "react-icons/io";
import { useEditEvent, useGetEventById } from "../../../../../API/services/events/hooks.api";

const statusColors = {
  Опубликовано: "green",
  "Sold Out": "orange",
  Архив: "blue",
  Завершено: "gray",
};

const EventPreviewCard = ({
  title,
  date,
  status = "Черновик",
  previewLink,
  refetchEventData,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loadingEventId, setLoadingEventId] = useState(null);

  const { data: eventData } = useGetEventById(id);
  const { mutate: updateStatus } = useEditEvent();

  const handleUpdateStatus = async ({ id, data }) => {
    setLoadingEventId(id);

    const isUnpublishing = status === "Опубликовано" && data === "Черновик";
    const hasPurchases = eventData?.totalSoldTickets ? true : false;
    console.log(eventData, hasPurchases)

    const performUpdate = async () => {
      updateStatus(
        { id, data: { status: data } },
        {
          onSettled: () => {
            setLoadingEventId(null);
            refetchEventData?.();
          },
        }
      );
    };

    if (isUnpublishing && hasPurchases) {
      Modal.info({
        title: "У мероприятия есть купленные билеты",
        content: (
          <div>
            <p>Если не опубликовать мероприятие,</p>
            <p>средства вернутся пользователям автоматически за 1 день до его завершения.</p>
          </div>
        ),
        okText: "Понятно",
        onOk: performUpdate,
      });
    } else {
      await performUpdate();
    }
  };

  return (
    <div className={styles.eventPreviewCard}>
      <RiInfoCardLine size={100} className={styles.eventPreviewCard__bgIcon} />
      <div className={styles.eventPreviewCard__header}>
        <Title level={4} className={styles.title}>{title}</Title>
        <Flex align="center" gap={8} className={styles.dateInfo}>
          <FaRegCalendarMinus size={18} className={styles.dateIcon} />
          <Text className={styles.dateText}>{date}</Text>
        </Flex>

        <Flex gap={18} align="center" style={{ marginTop: 8 }}>
          <MyDropdown
            menu={{
              items: (() => {
                const items = [];

                if (status === "Опубликовано") {
                  items.push({
                    key: "unpublic",
                    label: "Снять с публикации",
                    onClick: () => handleUpdateStatus({
                      id,
                      data: "Черновик",
                    }),
                  });
                }

                if (["Черновик", "Архив", "Завершено"].includes(status)) {
                  items.push({
                    key: "public",
                    label: "Опубликовать",
                    onClick: () => navigate(`/events/manage/edit/${id}/confirm`),
                  });
                }

                return items;
              })(),
            }}
            trigger={["click"]}
          >
            <Tag
              color={statusColors[status] || "default"}
              className={styles.statusTag}
            >
              {loadingEventId === id ? (
                <Spin size="small" />
              ) : (
                <>
                  {status} <IoIosArrowDown style={{ marginLeft: "auto" }} />
                </>
              )}
            </Tag>
          </MyDropdown>

          <MyButton
            type="link"
            href={previewLink}
            target="_blank"
            className={styles.prviewButton}
          >
            <FaExternalLinkAlt />
          </MyButton>
        </Flex>
      </div>
    </div>
  );
};

export default EventPreviewCard;
