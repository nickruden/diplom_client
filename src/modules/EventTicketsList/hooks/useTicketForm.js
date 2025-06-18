import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";

const combineDateTime = (date, time) => {
  if (!date || !time) return null;
  return dayjs(date)
    .hour(dayjs(time).hour())
    .minute(dayjs(time).minute())
    .second(0)
    .toISOString();
};

export const useTicketForm = (initialTicket = null) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    count: "",
    dateStart: null,
    dateEnd: null,
    timeStart: null,
    timeEnd: null,
    description: "",
  });

  useEffect(() => {
    if (initialTicket) {
      const start = dayjs(initialTicket.salesStart);
      const end = dayjs(initialTicket.salesEnd);

      setFormData({
        name: initialTicket.name || "",
        price: initialTicket.price || "",
        count: initialTicket.count || "",
        description: initialTicket.description || "",
        dateStart: start.startOf("day"),
        dateEnd: end.startOf("day"),
        timeStart: start,
        timeEnd: end,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        count: "",
        description: "",
        dateStart: null,
        dateEnd: null,
        timeStart: null,
        timeEnd: null,
      });
    }
  }, [initialTicket]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const preparedData = useMemo(() => {
    const salesStart = combineDateTime(formData.dateStart, formData.timeStart);
    const salesEnd = combineDateTime(formData.dateEnd, formData.timeEnd);

    return {
      id: initialTicket?.id || String(Date.now()),
      name: formData.name,
      price: Number(formData.price),
      count: Number(formData.count),
      description: formData.description,
      salesStart,
      salesEnd,
    };
  }, [formData, initialTicket]);

  return {
    formData,
    handleInputChange,
    preparedData,
  };
};
