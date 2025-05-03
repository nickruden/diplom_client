// TicketsAside.jsx
import React from "react";
import { Affix, Card, Divider, Flex } from "antd";

import { CiHeart } from "react-icons/ci";
import { MdOutlineReportGmailerrorred } from "react-icons/md";

import { useCart } from "../../context/CartContext";
import { useGetTicketsByEvent } from "../../../../common/API/services/tickets/hooks.api";

import { MyEmpty, TicketCard } from "../../../../common/components";
import MyButton from "../../../../common/components/UI/Button/MyButton";

import styles from "./TicketsAside.module.scss";
import MySkeleton from "../../../../common/components/Skeleton/MySkeleton";
import CartModal from "../CardModal/CartModal";


const TicketsAside = ({ eventData }) => {
  const { ticketCounts, increment, decrement, openCart } = useCart();
  const { data: ticketsData, isLoading } = useGetTicketsByEvent(eventData.id);

  if (isLoading) {
    return <div className={styles.ticketsAside}> <MySkeleton width="250px" height="300px" /> </div>
  }
  if (!ticketsData) {
    return <div className={styles.ticketsAside}><MyEmpty title="Нет билетов"/></div>
  }

  const totalPrice = ticketsData.tickets.reduce(
    (acc, ticket) => acc + (ticket.price * (ticketCounts[ticket.id] || 0)),
    0
  );

  return (
    <>
    <div className={styles.ticketsAside}>
      <Affix offsetTop={100}>
        <Card className={styles.stickyCard}>
          <div className={styles.ticketsContainer}>
            {ticketsData.tickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                count={ticketCounts[ticket.id] || 0}
                onIncrement={() => increment(ticket.id)}
                onDecrement={() => decrement(ticket.id)}
              />
            ))}
          </div>
          <Flex vertical gap="12px" className={styles.cardInfo}>
            <div className={styles.totalCount}>
              Общая сумма: {totalPrice}₽
            </div>
            <MyButton
              type="primary"
              color="orange"
              size="large"
              className={styles.buyButton}
              disabled={totalPrice <= 0}
              onClick={openCart}
            >
              Купить билеты
            </MyButton>
            <Flex justify="center" align="center" gap="4px" className={styles.actionButtons}>
              <MyButton type="text" icon={<CiHeart />} className={styles.actionButton}>
                Сохранить
              </MyButton>
              <Divider type="vertical" />
              <MyButton type="text" icon={<MdOutlineReportGmailerrorred />} className={styles.actionButton}>
                Пожаловаться
              </MyButton>
            </Flex>
          </Flex>
        </Card>
      </Affix>
    </div>
    <CartModal tickets={ticketsData.tickets} eventData={eventData} />
    </>
  );
};

export default TicketsAside;
