import React, { useEffect, useState } from "react";
import { Drawer, Form, Input, Flex, Typography, Tooltip } from "antd";
import MyInput from "../../../../common/components/UI/Input/MyInput";
import MyDateTimePicker from "../../../../common/components/UI/DatePicker/MyDatePicker";
import MyButton from "../../../../common/components/UI/Button/MyButton";
import MySwitch from "../../../../common/components/UI/Switch/MySwitch";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

import {
  formatDate,
  formatNormalizeDate,
  formatTime,
  normalizeToUtcWithoutOffset,
} from "../../../../common/utils/Date/formatDate";
import "./TicketDrawer.scss";
import { CiCircleInfo } from "react-icons/ci";

const { Title } = Typography;

const TicketDrawer = ({ open, onClose, onSubmit, ticket, eventData, mode }) => {
  const [form] = Form.useForm();
  const [hasPurchases, setHasPurchases] = useState(false);
  const [multiDay, setMultiDay] = useState(false);
  const [validDates, setValidDates] = useState([]);
  const [fixedTimeStart, setFixedTimeStart] = useState("");
  const [fixedTimeEnd, setFixedTimeEnd] = useState("");

const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isOneDayEvent = isSameDay(eventData.startDate, eventData.endDate) ? true : false;
  console.log(isOneDayEvent)

  useEffect(() => {
    if (eventData) {
      const daily = JSON.parse(eventData.dailySchedule || "[]");

      if (daily.length > 0) {
        const dates = daily.map((d) => ({
          date: dayjs(d.date),
          startTime: dayjs(d.startTime).format("HH:mm"),
          endTime: dayjs(d.endTime).format("HH:mm"),
        }));

        setValidDates(dates);
      } else {
        const start = dayjs(eventData.startTime);
        const end = dayjs(eventData.endTime);
        const range = [];
        let current = start.startOf("day");
        while (current.isSameOrBefore(end, "day")) {
          range.push({
            date: current,
            startTime: dayjs(eventData.startTime).format("HH:mm"),
            endTime: dayjs(eventData.endTime).format("HH:mm"),
          });
          current = current.add(1, "day");
        }

        setValidDates(range);
      }
    }

    if (mode === "edit" && ticket) {
      // Заполняем форму для редактирования
      const start = normalizeToUtcWithoutOffset(dayjs(ticket.salesStart));
      const end = normalizeToUtcWithoutOffset(dayjs(ticket.salesEnd));
      const validFrom = normalizeToUtcWithoutOffset(dayjs(ticket.validFrom));
      const validTo = normalizeToUtcWithoutOffset(dayjs(ticket.validTo));

      form.setFieldsValue({
        name: ticket.name,
        price: ticket.price,
        count: ticket.count,
        description: ticket.description,
        salesStart: start.startOf("day"),
        salesEnd: end.startOf("day"),
        timeStart: start,
        timeEnd: end,
        validFrom,
        validTo,
        validRange: [validFrom, validTo],
      });

      setMultiDay(!validFrom.isSame(validTo, "day"));
      setFixedTimeStart(normalizeToUtcWithoutOffset(dayjs(ticket.validFrom)));
      setFixedTimeEnd(normalizeToUtcWithoutOffset(dayjs(ticket.validTo)));
      setHasPurchases(ticket.soldCount > 0);
    } else if ((mode === "copy" || mode === "create") && ticket) {
      // При копировании — заполняем данными из ticket, но без id и soldCount
      // При создании — пустая форма (если ticket нет)
      const start = normalizeToUtcWithoutOffset(dayjs(ticket.salesStart));
      const end = normalizeToUtcWithoutOffset(dayjs(ticket.salesEnd));
      const validFrom = dayjs(ticket.validFrom);
      const validTo = dayjs(ticket.validTo);

      form.setFieldsValue({
        name: ticket.name,
        price: ticket.price,
        count: ticket.count,
        description: ticket.description,
        salesStart: start.startOf("day"),
        salesEnd: end.startOf("day"),
        timeStart: start,
        timeEnd: end,
        validFrom,
        validTo,
        validRange: [validFrom, validTo],
      });

      setMultiDay(!validFrom.isSame(validTo, "day"));
      setFixedTimeStart(normalizeToUtcWithoutOffset(dayjs(ticket.validFrom)));
      setFixedTimeEnd(normalizeToUtcWithoutOffset(dayjs(ticket.validTo)));
      setHasPurchases(false); // При копировании или создании новых билетов считаем что покупок нет
    } else {
      // Режим создания без ticket
      form.resetFields();
      setHasPurchases(false);
      setFixedTimeStart("00:00");
      setFixedTimeEnd("00:00");
      setMultiDay(false);
    }
  }, [ticket, open, mode]);

  const handleValidFromChange = (date) => {
    if (!date) return;

    const selected = validDates.find(
      (d) => d.date.format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
    );

    if (selected) {
      setFixedTimeStart(selected.startTime);
      setFixedTimeEnd(selected.endTime);

      form.setFieldsValue({
        validFrom: date,
        ...(multiDay ? {} : { validTo: date }),
      });
    }
  };

  const handleValidRangeChange = ([start, end]) => {
    if (!start || !end) return;

    const startDateObj = validDates.find(
      (d) => d.date.format("YYYY-MM-DD") === start.format("YYYY-MM-DD")
    );
    const endDateObj = validDates.find(
      (d) => d.date.format("YYYY-MM-DD") === end.format("YYYY-MM-DD")
    );

    if (startDateObj && endDateObj) {
      setFixedTimeStart(startDateObj.startTime);
      setFixedTimeEnd(endDateObj.endTime);
    }

    form.setFieldsValue({
      validFrom: start,
      validTo: end,
    });
  };

  const handleFinish = (values) => {
    const formatDateTime = (date, time) => {
      const datePart =
        typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD");
      const timePart =
        typeof time === "string" ? time : dayjs(time).format("HH:mm");
      return `${datePart}T${timePart}:00Z`;
    };

    let validFromDate = values.validFrom;
    let validToDate = multiDay ? values.validTo : values.validFrom;

    if (multiDay && values.validRange?.[0] && values.validRange?.[1]) {
      validFromDate = values.validRange[0];
      validToDate = values.validRange[1];
    }

    const startDateObj = validDates.find(
      (d) =>
        d.date.format("YYYY-MM-DD") ===
        dayjs(validFromDate).format("YYYY-MM-DD")
    );
    const endDateObj = validDates.find(
      (d) =>
        d.date.format("YYYY-MM-DD") === dayjs(validToDate).format("YYYY-MM-DD")
    );

    const finalValidFrom = formatDateTime(
      validFromDate,
      startDateObj?.startTime || fixedTimeStart
    );
    const finalValidTo = formatDateTime(
      validToDate,
      endDateObj?.endTime || fixedTimeEnd
    );

    const preparedData = {
      ...(mode === "edit" && ticket && { id: ticket.id }),
      name: values.name,
      description: values.description,
      price: Number(values.price),
      count: Number(values.count),
      salesStart: formatDateTime(values.salesStart, values.timeStart),
      salesEnd: formatDateTime(values.salesEnd, values.timeEnd),
      validFrom: isOneDayEvent
        ? formatNormalizeDate(eventData.startTime)
        : finalValidFrom,
      validTo: isOneDayEvent
        ? formatNormalizeDate(eventData.endTime)
        : finalValidTo,
    };

    onSubmit(preparedData);
    form.resetFields();
  };

  return (
    <Drawer
      title={mode === "edit" ? "Редактировать билет" : "Добавить билет"}
      width={450}
      onClose={() => {
        form.resetFields();
        onClose();
      }}
      open={open}
      destroyOnClose
      className="ticket-drawer"
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Название"
          name="name"
          rules={[{ required: true, message: "Введите название билета" }]}
        >
          <MyInput
            placeholder="Название билета"
            size="large"
            width="100%"
            disabled={hasPurchases}
          />
        </Form.Item>

        <Form.Item
          label="Цена"
          name="price"
          rules={[{ required: true, message: "Введите цену билета" }]}
        >
          <MyInput
            type="number"
            min={0}
            step={1}
            placeholder="Цена"
            size="large"
            width="100%"
          />
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

        {!isOneDayEvent && (
          <Flex vertical style={{ marginBottom: 30 }}>
            <Flex align="center" gap={5}>
              <Title level={5}>Действие билета</Title>
              <Tooltip
                title="Для каждого дня мероприятия обязательно создать свой билет, если посещение ограничивается временем"
                color="#4B4D63"
                placement="bottom"
                style={{ cursor: "pointer" }}
              >
                <CiCircleInfo size={18} />
              </Tooltip>
            </Flex>
            <MySwitch
              title="Билет действителен не один день?"
              checked={multiDay}
              onChange={(checked) => {
                setMultiDay(checked);

                form.setFieldsValue({
                  validFrom: null,
                  validTo: null,
                  validRange: null,
                });

                setFixedTimeStart("00:00");
                setFixedTimeEnd("00:00");
              }}
            />

            <Flex gap={10} wrap>
              {!multiDay ? (
                <Flex align="flex-end" gap={20}>
                  <Form.Item
                    label="Дата валидности"
                    name="validFrom"
                    rules={[
                      { required: true, message: "Укажите дату валидности" },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <MyDateTimePicker
                      type="date"
                      size="large"
                      onChange={handleValidFromChange}
                      disabledDate={(current) => {
                        const formatted = current.format("YYYY-MM-DD");
                        return !validDates.find(
                          (d) => d.date.format("YYYY-MM-DD") === formatted
                        );
                      }}
                      disabled={hasPurchases}
                    />
                  </Form.Item>

                  <Flex gap={10}>
                    <MyDateTimePicker
                      type="time"
                      size="large"
                      style={{ width: 100 }}
                      value={dayjs(fixedTimeStart, "HH:mm")}
                      disabled
                    />
                    <MyDateTimePicker
                      type="time"
                      size="large"
                      style={{ width: 100 }}
                      value={dayjs(fixedTimeEnd, "HH:mm")}
                      disabled
                    />
                  </Flex>
                </Flex>
              ) : (
                <Flex vertical gap={10}>
                  <Form.Item
                    label="Даты валидности"
                    name="validRange"
                    rules={[
                      { required: true, message: "Укажите даты валидности" },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <MyDateTimePicker
                      type="range"
                      size="large"
                      onChange={(range) => {
                        handleValidRangeChange(range);
                        form.setFieldsValue({
                          validFrom: range?.[0],
                          validTo: range?.[1],
                        });
                      }}
                      disabledDate={(current) => {
                        const formatted = current.format("YYYY-MM-DD");
                        return !validDates.find(
                          (d) => d.date.format("YYYY-MM-DD") === formatted
                        );
                      }}
                      value={[
                        form.getFieldValue("validFrom"),
                        form.getFieldValue("validTo"),
                      ]}
                      disabled={hasPurchases}
                    />
                  </Form.Item>

                  <Flex gap={10}>
                    <MyDateTimePicker
                      type="time"
                      size="large"
                      value={dayjs(fixedTimeStart, "HH:mm")}
                      disabled
                    />
                    <MyDateTimePicker
                      type="time"
                      size="large"
                      value={dayjs(fixedTimeEnd, "HH:mm")}
                      disabled
                    />
                  </Flex>
                </Flex>
              )}
            </Flex>
          </Flex>
        )}

        <Title level={5}>Даты продаж</Title>
        <Flex justify="space-between" gap={10}>
          <Form.Item
            label="Дата начала"
            name="salesStart"
            rules={[{ required: true, message: "Укажите дату начала" }]}
            style={{ width: "50%", marginBottom: 0 }}
          >
            <MyDateTimePicker
              type="date"
              size="large"
              disabled={hasPurchases}
            />
          </Form.Item>

          <Form.Item
            label="Дата завершения"
            name="salesEnd"
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
            <MyDateTimePicker
              type="time"
              size="large"
              disabled={hasPurchases}
            />
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

        <Form.Item label="Описание" name="description">
          <Input.TextArea
            rows={3}
            placeholder="Описание (необязательно)"
            disabled={hasPurchases}
          />
        </Form.Item>

        <Form.Item>
          <MyButton
            type="primary"
            color="orange"
            size="large"
            htmlType="submit"
            block
          >
            {ticket ? "Сохранить изменения" : "Добавить"}
          </MyButton>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default TicketDrawer;
