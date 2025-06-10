import React from "react";
import { Affix, Card, Divider, Flex } from "antd";

import { MdOutlineReportGmailerrorred } from "react-icons/md";

import { useCart } from "../../context/CartContext";

import { FavoriteButton, MyEmpty } from "../../../../common/components";
import MyButton from "../../../../common/components/UI/Button/MyButton";

import styles from "./TicketsAside.module.scss";
import CartModal from "../CardModal/CartModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../common/hooks/useAuth";


const TicketsAside = ({ userId, eventData, ticktesRef, ticketsData, isMultiDayEvent }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { ticketCounts, openCart } = useCart();

  const totalPrice = ticketsData?.tickets.reduce(
    (acc, ticket) => acc + (ticket.price * (ticketCounts[ticket.id] || 0)),
    0
  );

  return (
    <>
      <div className={styles.ticketsAside}>
        <Affix offsetTop={100}>
          <Card className={styles.stickyCard}>
            {/* <div className={styles.ticketsContainer}>
            {ticketsData.tickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                count={ticketCounts[ticket.id] || 0}
                onIncrement={() => increment(ticket.id)}
                onDecrement={() => decrement(ticket.id)}
              />
            ))}
          </div> */}
            {!ticketsData || ticketsData.length === 0 ? (
              <MyEmpty title="Нет билетов" />
            ) : (
              ""
            )}
            <Flex vertical gap="12px" className={styles.cardInfo}>
              <div className={styles.totalCount}>
                Общая сумма: {totalPrice}₽
              </div>
              {userId !== eventData.organizerId ? (
                <MyButton
                  type="primary"
                  color="orange"
                  size="large"
                  className={styles.buyButton}
                  disabled={eventData.status === "Завершено"}
                  onClick={() => {
                    if (!user) {
                      navigate(`/auth`);
                    } else {
                      const hasTickets = Object.values(ticketCounts).some(
                        (count) => count > 0
                      );

                      if (!hasTickets) {
                        ticktesRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                        return;
                      }

                      openCart();
                    }
                  }}
                >
                  Купить билеты
                </MyButton>
              ) : (
                <MyButton
                  type="default"
                  size="large"
                  className={styles.buyButton}
                  onClick={() =>
                    navigate(`/events/manage/edit/${eventData.id}/tickets`)
                  }
                >
                  Редактировать билеты
                </MyButton>
              )}
              <Flex
                justify="center"
                align="center"
                gap="4px"
                className={styles.actionButtons}
              >
                <FavoriteButton
                  size={10}
                  eventId={eventData.id}
                  title="Сохранить"
                  className={styles.actionButton}
                  style={{ fontSize: 14 }}
                />
                <Divider type="vertical" />
                <MyButton
                  type="text"
                  icon={<MdOutlineReportGmailerrorred />}
                  className={styles.actionButton}
                >
                  Пожаловаться
                </MyButton>
              </Flex>
            </Flex>
          </Card>
        </Affix>
      </div>
      <CartModal tickets={ticketsData?.tickets} eventData={eventData} isMultiDayEvent={isMultiDayEvent} />
    </>
  );
};

export default TicketsAside;
