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
import { useBuyTickets } from "../../../../common/API/services/tickets/hooks.api";
import { useForm } from "antd/es/form/Form";
import MyInput from '../../../../common/components/UI/Input/MyInput'
import { IoTicketOutline } from "react-icons/io5";


const { Title, Text, Paragraph } = Typography;

const CartModal = ({ tickets, eventData }) => {
  const { ticketCounts, isCartOpen, closeCart } = useCart();
  const [rows, setRows] = useState(2);
  const { user } = useAuth();
  const [form] = useForm();

  const [selectedMethod, setSelectedMethod] = useState("card");

  const {mutate: buyMutation} = useBuyTickets();

  const selectedTickets = tickets.filter((ticket) => ticketCounts[ticket.id] > 0);
  const total = selectedTickets.reduce(
    (sum, t) => sum + t.price * ticketCounts[t.id],
    0
  );
  const finalTotal = total;

  useEffect(() => {
    if (user) {
        form.setFieldsValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      }
  }, [])


  const handlePay = async () => {
    if (!user) return message.error("Вы не авторизованы");
  
    try {
      const ticketsToBuy = selectedTickets.map((ticket) => ({
        idTicket: ticket.id,
        count: ticketCounts[ticket.id],
      }));

      const data = {
        idBuyer: user.id,
        tickets: ticketsToBuy,
      }
      
    await buyMutation(data);
  
      message.success("Оплата прошла успешно!");
      closeCart();
    } catch (error) {
      console.error(error);
      message.error("Ошибка при покупке билетов");
    }
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
                <Form.Item name="firstName" className={styles.input}>
                  <MyInput
                    placeholder="Имя"
                    size="large"
                    width="300px"
                    value={user?.firstName}
                  />
                </Form.Item>
                <Form.Item name="lastName" className={styles.input}>
                  <MyInput
                    placeholder="Фамилия"
                    size="large"
                    width="300px"
                    value={user?.lastName}
                  />
                </Form.Item>
              </Flex>
              <Form.Item name="email" className={styles.input}>
                <MyInput placeholder="Email" size="large" value={user?.email} />
              </Form.Item>
            </Flex>
          </Flex>

          <Flex vertical className={styles.patmentType}>
            <Title level={3} className={styles.paymentTitle}>
              Введите данные карты
            </Title>
            <Divider style={{ margin: "15px 0px" }} />

            {selectedMethod === "card" && (
              <Flex gap={70} vertical className={styles.cardForm}>
                <Form.Item
                  name="cardNumber"
                  rules={[{ required: true, message: "Введите номер карты" }]}
                  className={styles.input}
                >
                  <MyInput
                    placeholder="Номер карты"
                    maxLength={19}
                    width="100%"
                    size='large'
                  />
                </Form.Item>
                <Flex justify="space-between" className={styles.expiryCvc}>
                  <Form.Item
                    name="expiry"
                    rules={[
                      { required: true, message: "Введите срок действия" },
                    ]}
                    className={styles.input}
                  >
                    <MyInput
                      placeholder="ММ / ГГ"
                      maxLength={5}
                      width="150px"
                                          size='large'
                    />
                  </Form.Item>
                  <Form.Item
                    name="cvc"
                    rules={[{ required: true, message: "Введите CVC" }]}
                    className={styles.input}
                  >
                    <MyInput
                      placeholder="CVC"
                      maxLength={3}
                      width="100px"
                                          size='large'
                    />
                  </Form.Item>
                </Flex>
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
                <Text type="secondary" className={styles.eventDate}>
                  {new Date(eventData.startTime).toLocaleString("ru-RU", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </Text>
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
                  <Flex align="center" gap={5} className={styles.ticketName}>
                    <IoTicketOutline /> {ticket.name}
                  </Flex>
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
                <MyButton
                  type="default"
                  onClick={closeCart}
                  block
                >
                  Отмена
                </MyButton>
                <MyButton
                  type="primary"
                  bgColor="green"
                  onClick={() => form.submit()}
                  block
                >
                  Оплатить
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
