import React from 'react';

import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

import styles from './TicketCard.module.scss';
import { Flex } from 'antd';
import MyButton from '../UI/Button/MyButton';
import Title from 'antd/es/typography/Title';

// Компонент для отображения одного билета
const TicketCard = ({ ticket, count, onIncrement, onDecrement, ...props }) => (
  <Flex vertical gap="12px" className={styles.ticketCard}>
    <div className={styles.ticketCard__header}>
      <Flex vertical>
        <Title level={5} className={styles.ticketTitle}>
          {ticket.name}
        </Title>
        <Flex align="center" gap="15px" className={styles.counter}>
          <MyButton
            type="default"
            icon={<MinusOutlined />}
            className={styles.counterButton}
            disabled={count <= 0}
            onClick={onDecrement}
          />
          <span className={styles.countNumber}>{count}</span>
          <MyButton
            type="default"
            icon={<PlusOutlined />}
            className={styles.counterButton}
            onClick={onIncrement}
          />
        </Flex>
      </Flex>
      <span className={styles.ticketPrice}>
        {ticket.price > 0 ? `₽${ticket.price}` : "Бесплатно"}
      </span>
    </div>
    {ticket.description ? (
      <div className={styles.ticketCard__description}>{ticket.description}</div>
    ) : (
      ""
    )}
  </Flex>
);

export default TicketCard