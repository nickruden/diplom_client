import React from 'react';

import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

import styles from './TicketCard.module.scss';
import { Flex } from 'antd';
import MyButton from '../UI/Button/MyButton';

// Компонент для отображения одного билета
const TicketCard = ({ ticket, count, onIncrement, onDecrement }) => (
    <Flex vertical gap="12px" className={styles.ticketCard}>
      <div className={styles.ticketCard__header}>
        <span strong className={styles.ticketTitle}>{ticket.name}</span>
        <span className={styles.ticketPrice}>
          {ticket.price > 0 ? `₽${ticket.price}` : "Бесплатно"}
        </span>
      </div>
        <Flex justify="center" align="center" gap="15px" className={styles.ticketCard__counter}>
          <MyButton
            type="text"
            icon={<MinusOutlined />}
            className={styles.counterButton}
            disabled={count <= 0}
            onClick={onDecrement}
          />
          <span className={styles.countNumber}>{count}</span>
          <MyButton
            type="text"
            icon={<PlusOutlined />}
            className={styles.counterButton}
            onClick={onIncrement}
          />
        </Flex>
    </Flex>
  );

export default TicketCard