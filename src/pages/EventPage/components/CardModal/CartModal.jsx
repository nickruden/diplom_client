import React, { useEffect, useState } from "react";
import {
  Modal,
  Divider,
  Typography,
  Checkbox,
  message,
  Form,
  Flex,
} from "antd";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../../../common/hooks/useAuth";
import MyButton from "../../../../common/components/UI/Button/MyButton";
import styles from "./CartModal.module.scss";
import { useForm } from "antd/es/form/Form";
import MyInput from "../../../../common/components/UI/Input/MyInput";
import { IoTicketOutline } from "react-icons/io5";
import {
  formatTime,
  formatTimeRange,
} from "../../../../common/utils/Date/formatDate";
import {
  useCancelPayment,
  useConfirmPayment,
  useCreatePayment,
} from "../../../../common/API/services/payment/hooks.api";
import { MyEmpty } from "../../../../common/components";
import { MdOutlinePayment } from "react-icons/md";

const { Title, Text, Paragraph } = Typography;

const CartModal = ({ tickets, eventData, isMultiDayEvent }) => {
  const { user } = useAuth();

  const [rows, setRows] = useState(1);
  const [form] = useForm();

  const { ticketCounts, isCartOpen, closeCart } = useCart();
  const [confirmationToken, setConfirmationToken] = useState(null);

  const { mutateAsync: createPeyment } = useCreatePayment();
  const { mutateAsync: confirmPayment } = useConfirmPayment();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, []);

  const selectedTickets = tickets.filter(
    (ticket) => ticketCounts[ticket.id] > 0
  );

  const total = selectedTickets.reduce(
    (sum, t) => sum + t.price * ticketCounts[t.id],
    0
  );
  const finalTotal = total;

  useEffect(() => {
    const scriptId = "yookassa-checkout";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://yookassa.ru/checkout-widget/v1/checkout-widget.js";
      script.id = scriptId;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!confirmationToken || !window.YooMoneyCheckoutWidget) return;

    const checkout = new window.YooMoneyCheckoutWidget({
      confirmation_token: confirmationToken,
      error_callback: function (error) {
        console.error("YooKassa widget error", error);
      },
    });

    checkout.render("payment-form").then(() => {
      console.log("Платёжная форма загружена");

      checkout.on("success", async () => {
        console.log("Платёж успешно завершён");

        message.success("Оплата прошла успешно");

        const ticketsToBuy = selectedTickets.map((ticket) => ({
          idTicket: ticket.id,
          count: ticketCounts[ticket.id],
          price: ticket.price,
          validFrom: ticket.validFrom,
          validTo: ticket.validTo,
          refundDateCount: ticket.refundDateCount,
        }));

        await confirmPayment({ idBuyer: user.id, tickets: ticketsToBuy });

        setTimeout(() => {
          window.location.href = `${window.location.origin}/my-tickets`;
        }, 1000);
      });
    });
  }, [confirmationToken]);

  const handlePay = async () => {
    try {
      const ticketsToBuy = selectedTickets.map((ticket) => ({
        idTicket: ticket.id,
        count: ticketCounts[ticket.id],
        price: ticket.price,
        validFrom: ticket.validFrom,
        validTo: ticket.validTo,
        refundDateCount: ticket.refundDateCount,
      }));

      if (finalTotal === 0) {
        await confirmPayment({ idBuyer: user.id, tickets: ticketsToBuy });
        message.success("Билеты успешно оформлены!");

        setTimeout(() => {
          window.location.href = `${window.location.origin}/my-tickets`;
        }, 1000);

        return;
      }

      const data = { amount: finalTotal };
      const payment = await createPeyment(data);
      setConfirmationToken(payment.confirmation.confirmation_token);
    } catch (error) {
      console.error(error);
      message.error("Ошибка при оформлении");
    }
  };

  const handleCancel = async () => {
    setConfirmationToken(null);
    closeCart();
  };

  return (
    <Modal
      open={isCartOpen}
      onCancel={closeCart}
      width={1200}
      className={styles.modal}
      footer={false}
    >
      <Form
        form={form}
        className={styles.container}
        layout="vertical"
        onFinish={handlePay}
      >
        <Flex vertical gap={50} className={styles.payInfo}>
          <Flex vertical className={styles.payInfo__header}>
            <Title level={2} className={styles.title}>
              Платёжные данные
            </Title>
            <Flex vertical gap={20} className={styles.formGroup}>
              <Flex gap={20}>
                <Form.Item
                  name="firstName"
                  label="Имя"
                  className={styles.input}
                >
                  <MyInput
                    placeholder="Имя"
                    size="large"
                    width="300px"
                    value={user?.firstName}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label="Фамилия"
                  className={styles.input}
                >
                  <MyInput
                    placeholder="Фамилия"
                    size="large"
                    width="300px"
                    value={user?.lastName}
                    disabled
                  />
                </Form.Item>
              </Flex>
              <Form.Item
                name="email"
                label="На эту почту прийдёт билет"
                rules={[{ required: true }]}
                className={styles.input}
              >
                <MyInput placeholder="Email" size="large" value={user?.email} />
              </Form.Item>
            </Flex>
          </Flex>

          <Flex vertical className={styles.patmentType}>
            <Title level={3} className={styles.paymentTitle}>
              Оплата
            </Title>
            <Divider style={{ margin: "15px 0px" }} />
            {!confirmationToken ? (
              <MyEmpty
                title="После подтверждения оплаты тут появится виджет"
                image={<MdOutlinePayment size={120} />}
              />
            ) : (
              <Flex vertical className={styles.paymentWidget}>
                <div id="payment-form"></div>
              </Flex>
            )}
          </Flex>
        </Flex>
        <div className={styles.checkInfo}>
          <div className={styles.checkInner}>
            <div className={styles.header}>
              <div className={styles.imageWrap}>
                <img
                  src={
                    eventData.images.find((image) => image.isMain)?.imageUrl ||
                    ""
                  }
                  alt="event main image"
                  className={styles.image}
                />
              </div>
              <div className={styles.eventInfo}>
                <Paragraph
                  ellipsis={{ rows }}
                  className={styles.eventTitleWrap}
                >
                  <Title level={4} className={styles.eventTitle}>
                    {eventData.name}
                  </Title>
                </Paragraph>
                {!isMultiDayEvent ?
                <Text type="secondary" className={styles.eventDate}>
                  {formatTimeRange(eventData.startTime, eventData.endTime, {
                    showYear: false,
                    showWeekday: true,
                    noNormalize: true,
                  })}
                </Text> : ''}
              </div>
            </div>

            <Divider style={{ margin: "5px 0px" }} />

            <Flex vertical gap={10} className={styles.ticketsList}>
              {selectedTickets.map((ticket) => (
                <Flex
                  justify="space-between"
                  align="center"
                  key={ticket.id}
                  className={styles.ticketInner}
                >
                  <div>
                    <Flex align="center" gap={5} className={styles.ticketName}>
                      <IoTicketOutline /> {ticket.name}
                    </Flex>
                    {isMultiDayEvent ? 
                    <div style={{ fontSize: "12px", color: "#888", marginTop: 2 }}>
                      {formatTimeRange(ticket.validFrom, ticket.validTo, {
                        showYear: false,
                        showWeekday: true,
                        noNormalize: true,
                      })}
                    </div> : ''}
                  </div>
                  <div className={styles.ticketPrice}>
                    {ticketCounts[ticket.id]} x {ticket.price}₽
                  </div>
                </Flex>
              ))}
            </Flex>

            <div className={styles.priceBlock}>
              <Divider style={{ margin: "10px 0px" }} />

              <div className={styles.totalPrice}>
                Сумма к оплате: {finalTotal.toFixed(0)} ₽
              </div>
              <Flex gap={10} className={styles.buttonWrapper}>
                <MyButton type="default" onClick={handleCancel} block>
                  Отмена
                </MyButton>
                <MyButton
                  type="primary"
                  bgColor="green"
                  onClick={handlePay}
                  disabled={!!confirmationToken}
                >
                  {finalTotal === 0 ? "Получить билеты" : "Перейти к оплате"}
                </MyButton>
              </Flex>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CartModal;
