import React from 'react';
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Flex, Tooltip } from 'antd';
import styles from './TicketCard.module.scss';
import MyButton from '../UI/Button/MyButton';
import Title from 'antd/es/typography/Title';

const TicketCard = ({ ticket, count, onIncrement, onDecrement, ...props }) => {
  const remainingTickets = ticket.count - ticket.soldCount;
  const isDisabled = ticket.isSoldOut || remainingTickets <= 0;
  console.log(ticket, isDisabled)
  const maxReached = count >= remainingTickets;

  return (
    <Flex 
      vertical 
      gap="12px" 
      className={`${styles.ticketCard} ${isDisabled ? styles.disabledTicket : ''}`}
    >
      <div className={styles.ticketCard__header}>
        <Flex vertical>
          <Title level={5} className={styles.ticketTitle}>
            {ticket.name} 
            {isDisabled && <span className={styles.soldOutBadge}>Распродано</span>}
          </Title>
          
          {!isDisabled && (
            <Flex align="center" gap="15px" className={styles.counter}>
              <MyButton
                type="default"
                icon={<MinusOutlined />}
                className={styles.counterButton}
                disabled={count <= 0}
                onClick={onDecrement}
              />
              <span className={styles.countNumber}>{count}</span>
              <Tooltip 
                title={maxReached ? `Доступно только ${remainingTickets} билетов` : null}
              >
                <MyButton
                  type="default"
                  icon={<PlusOutlined />}
                  className={styles.counterButton}
                  onClick={() => !maxReached && onIncrement()}
                  disabled={maxReached}
                />
              </Tooltip>
            </Flex>
          )}
        </Flex>
        <span className={styles.ticketPrice}>
          {ticket.price > 0 ? `₽${ticket.price}` : "Бесплатно"}
        </span>
      </div>

      {ticket.description && (
        <div className={styles.ticketCard__description}>
          {ticket.description}
        </div>
      )}
    </Flex>
  );
};

export default TicketCard;