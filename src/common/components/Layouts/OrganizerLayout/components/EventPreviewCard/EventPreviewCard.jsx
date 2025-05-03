import { useNavigate } from "react-router-dom";

import { Button, Typography, Tag, Flex } from "antd";
const { Title, Text } = Typography;

import { FaExternalLinkAlt, FaRegCalendarMinus } from "react-icons/fa";
import { RiInfoCardLine } from "react-icons/ri";

import styles from "./EventPreviewCard.module.scss";
import MyButton from "../../../../UI/Button/MyButton";


const EventPreviewCard = ({ title, date, status = "Архив", previewLink }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.eventPreviewCard}>
      <RiInfoCardLine size={100} className={styles.eventPreviewCard__bgIcon} />
      <div className={styles.eventPreviewCard__header}>
        <Title level={4} className={styles.title}>{title}</Title>
        <Flex align="center" gap={8} className={styles.dateInfo}>
          <FaRegCalendarMinus size={18} className={styles.dateIcon}/>
          <Text className={styles.dateText}>{date}</Text>
        </Flex>
        <Flex gap={18} align="center" style={{ marginTop: 8 }}>
          <Tag color="default" className={styles.tagStatus}>{status}</Tag>
          <MyButton
            type="link"
            href={previewLink}
            target="_blank"
            className={styles.prviewButton}
          > <FaExternalLinkAlt />
          </MyButton>
        </Flex>
      </div>
    </div>
  );
};

export default EventPreviewCard;
