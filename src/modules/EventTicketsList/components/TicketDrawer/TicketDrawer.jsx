import React, { useEffect, useState } from "react";
import { Drawer, Form, Input, Flex, Typography } from "antd";
import MyInput from "../../../../common/components/UI/Input/MyInput";
import MyDateTimePicker from "../../../../common/components/UI/DatePicker/MyDatePicker";
import MyButton from "../../../../common/components/UI/Button/MyButton";
import dayjs from "dayjs";
import "./TicketDrawer.scss";

const { Title } = Typography;

const TicketDrawer = ({ open, onClose, onSubmit, ticket }) => {
  const [form] = Form.useForm();
  const [hasPurchases, setHasPurchases] = useState(false);

  // Устанавливаем значения при открытии
  useEffect(() => {
    if (ticket) {
      const start = dayjs(ticket.salesStart);
      const end = dayjs(ticket.salesEnd);
      form.setFieldsValue({
        name: ticket.name,
        price: ticket.price,
        count: ticket.count,
        description: ticket.description,
        // dateStart: start.startOf("day"),
        // dateEnd: end.startOf("day"),
        timeStart: start,
        timeEnd: end,
      });

      if (ticket.soldCount > 0) {
        setHasPurchases(true);
      } else {
        setHasPurchases(false);
      }
    } else {
      form.resetFields();
      setHasPurchases(false);
    }
  }, [ticket, open]);

  const handleFinish = (values) => {
    const { dateStart, dateEnd, timeStart, timeEnd } = values;
  
    const formatDateTime = (date, time) => {
      const datePart = typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD");
      const timePart = typeof time === "string" ? time : dayjs(time).format("HH:mm");
      return `${datePart}T${timePart}:00Z`; 
    };
  
    const preparedData = {
      ...(ticket && { id: ticket.id }),
      name: values.name,
      description: values.description,
      price: Number(values.price),
      count: Number(values.count),
      // salesStart: formatDateTime(dateStart, timeStart),
      // salesEnd: formatDateTime(dateEnd, timeEnd),
    };
  
    onSubmit(preparedData);
    form.resetFields();
  };
  

  return (
    <Drawer
      title={ticket ? "Редактировать билет" : "Добавить билет"}
      width={450}
      onClose={() => {
        form.resetFields(); // Очистка при закрытии
        onClose();
      }}
      open={open}
      destroyOnClose
      className="ticket-drawer"
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        className="ticket-drawer__form"
      >
        <Form.Item
          label="Название"
          name="name"
          rules={[{ required: true, message: "Введите название билета" }]}
        >
          <MyInput placeholder="Название билета" size="large" width="100%" disabled={hasPurchases} />
        </Form.Item>

        <Form.Item
          label="Цена"
          name="price"
          rules={[{ required: true, message: "Введите цену билета" }]}
        >
          <MyInput type="number"
            min={0}
            step={1} placeholder="Цена" size="large" width="100%" />
        </Form.Item>

        <Form.Item
          label="Количество"
          name="count"
          rules={[{ required: true, message: "Введите количество билетов" }]}
        >
          <MyInput
            type="number"
            min={ticket?.soldCount || 1}
            step={1}
            placeholder="Количество"
            size="large"
            width="100%"
          />
        </Form.Item>

        {/* <Flex vertical gap={10} className="sales-date">
          <Title level={5}>Начало продаж</Title>
          <Flex justify="space-between" gap={10}>
            <Form.Item
              label="Дата начала"
              name="dateStart"
              rules={[{ required: true, message: "Укажите дату начала" }]}
              style={{ width: "50%", marginBottom: 0 }}
            >
              <MyDateTimePicker type="date" size="large" disabled={hasPurchases} />
            </Form.Item>
            <Form.Item
              label="Дата завершения"
              name="dateEnd"
              rules={[{ required: true, message: "Укажите дату окончания" }]}
              style={{ width: "50%", marginBottom: 0 }}
            >
              <MyDateTimePicker type="date" size="large" />
            </Form.Item>
          </Flex>

          <Flex justify="space-between" gap={10}>
            <Form.Item
              label="Время начала"
              name="timeStart"
              rules={[{ required: true, message: "Укажите время начала" }]}
              style={{ width: "50%" }}
            >
              <MyDateTimePicker type="time" size="large" disabled={hasPurchases} />
            </Form.Item>
            <Form.Item
              label="Время завершения"
              name="timeEnd"
              rules={[{ required: true, message: "Укажите время завершения" }]}
              style={{ width: "50%" }}
            >
              <MyDateTimePicker type="time" size="large" />
            </Form.Item>
          </Flex>
        </Flex> */}

        <Form.Item label="Описание" name="description">
          <Input.TextArea rows={3} placeholder="Описание (необязательно)" disabled={hasPurchases} />
        </Form.Item>

        <Form.Item className="ticket-drawer__buttons">
          <MyButton type="primary" color="orange" size="large" htmlType="submit" block>
            {ticket ? "Сохранить изменения" : "Добавить"}
          </MyButton>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default TicketDrawer;
