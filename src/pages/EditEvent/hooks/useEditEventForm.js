import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { formatDate, normalizeToUtcWithoutOffset } from "../../../common/utils/Date/formatDate";

const combineDateTime = (date, time) => {
  if (!date || !time) return null;
  const datePart = typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD");
  const timePart = typeof time === "string" ? time : dayjs(time).format("HH:mm");
  return `${datePart}T${timePart}:00Z`;
};

export const useUpdateEventForm = (initialData = null) => {
  const [formData, setFormData] = useState({
    images: [],
    category: "",
    title: "",
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    multiDay: false,
    locationType: "offline",
    onlineLink: "",
    onlinePassword: "",
    onlineInstructions: "",
    address: "",
    description: "",
    isPrime: false,
    refundDateCount: 0,
    isAutoRefund: false,
    status: 'Архив',
    hasIndividualSchedule: false,
    dailySchedule: "[]",
  });

  useEffect(() => {
    if (initialData) {
      const onlineInfo = initialData?.onlineInfo ? JSON.parse(initialData.onlineInfo) : {};
      const parsedSchedule = initialData?.eventDailys ? JSON.parse(initialData.eventDailys) : [];

      const hasIndividualSchedule = parsedSchedule.length > 0 ? true : false;

      const normalizedSchedule = parsedSchedule.map((entry) => ({
        date: normalizeToUtcWithoutOffset(dayjs(entry.startTime)),
        startTime: normalizeToUtcWithoutOffset(dayjs(entry.startTime)),
        endTime: normalizeToUtcWithoutOffset(dayjs(entry.endTime)),
      }));

      setFormData({
        images: initialData.images || [],
        category: initialData.categoryId || "",
        title: initialData.name || "",
        startDate: normalizeToUtcWithoutOffset(dayjs(initialData.startTime)),
        endDate: normalizeToUtcWithoutOffset(dayjs(initialData.endTime)),
        startTime: normalizeToUtcWithoutOffset(dayjs(initialData.startTime)),
        endTime: normalizeToUtcWithoutOffset(dayjs(initialData.endTime)),
        multiDay: formatDate(initialData.startTime) != formatDate(initialData.endTime) || hasIndividualSchedule ? true : false,
        hasIndividualSchedule,
        locationType: initialData.location === "Онлайн" ? "online" : "offline",
        onlineLink: onlineInfo.link || "",
        onlinePassword: onlineInfo.password || "",
        onlineInstructions: onlineInfo.instructions || "",
        address: initialData.location !== "Онлайн" ? initialData.location : "",
        description: initialData.description || "",
        isPrime: initialData.isPrime || false,
        refundDateCount: initialData?.refundDateCount ? initialData.refundDateCount : 0,
        isAutoRefund: initialData?.isAutoRefund ?? false,
        status: initialData?.status || "Черновик",
        dailySchedule: JSON.stringify(normalizedSchedule),
      });
    }
  }, [initialData]);

  const [formErrors, setFormErrors] = useState({});
  const [wasValidated, setWasValidated] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: false }));
    setIsDirty(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.images || formData.images.length === 0) {
      errors.images = true;
    }

    if (!formData.title) errors.title = true;
    if (!formData.category) errors.category = true;
    if (!formData.startDate) errors.startDate = true;
    if (formData.multiDay && !formData.endDate) errors.endDate = true;

    if (!formData.hasIndividualSchedule) {
      if (!formData.startTime) errors.startTime = true;
      if (!formData.endTime) errors.endTime = true;

      if (
        !formData.startDate ||
        !formData.startTime ||
        !formData.endTime ||
        (formData.multiDay && !formData.endDate)
      ) {
        errors.dateTime = true;
      }
    } else {
      const parsedSchedule = JSON.parse(formData.dailySchedule || "[]");
      const startDate = dayjs(formData.startDate).startOf("day");
      const endDate =
        formData.multiDay && formData.endDate
          ? dayjs(formData.endDate).startOf("day")
          : startDate;

      if (!formData.startDate || (formData.multiDay && !formData.endDate)) {
        errors.dateTime = true;
      } else if (parsedSchedule.length === 0) {
        errors.dateTime = true;
      } else {
        // Проверяем, что в расписании есть запись с датой начала
        const includesStartDate = parsedSchedule.some((entry) =>
          dayjs(entry.date).startOf("day").isSame(startDate)
        );

        if (!includesStartDate) {
          errors.dailySchedule =
            "В расписании должна быть дата начала мероприятия";
        }

        // Проверяем, что все даты в допустимом диапазоне
        const outOfRangeEntry = parsedSchedule.find((entry) => {
          const entryDate = dayjs(entry.date).startOf("day");
          return entryDate.isBefore(startDate) || entryDate.isAfter(endDate);
        });

        if (outOfRangeEntry) {
          errors.dailySchedule = `Все даты должны быть в пределах от ${startDate.format(
            "DD.MM.YYYY"
          )} до ${endDate.format("DD.MM.YYYY")}`;
        }
      }
    }

    if (formData.locationType === "offline" && !formData.address) errors.address = true;
    if (formData.locationType === "online" && !formData.onlineLink) errors.onlineLink = true;
    if (!formData.description) errors.description = true;

    const isValid = Object.keys(errors).length === 0;
    setFormErrors(errors);
    setWasValidated(true);
    setGeneralError(isValid ? "" : "Не все данные введены!");

    return isValid;
  };

  useEffect(() => {
    if (formData.locationType === "offline" && !formData.address) {
      setFormErrors(prev => ({ ...prev, address: true }));
    } else {
      setFormErrors(prev => ({ ...prev, address: false }));
    }
  }, [formData.locationType, formData.address]);

  const preparedData = useMemo(() => {
    const isIndividualSchedule = formData.hasIndividualSchedule;

    const parsedSchedule = JSON.parse(formData.dailySchedule || "[]");

    let startTime = null;
    let endTime = null;

    if (isIndividualSchedule && parsedSchedule.length > 0) {
      const firstEntry = parsedSchedule[0];
      const lastEntry = parsedSchedule[parsedSchedule.length - 1];

      startTime = combineDateTime(
        formData.startDate,
        dayjs(firstEntry.startTime)
      );
      endTime = combineDateTime(formData.endDate, dayjs(lastEntry.endTime));
    } else if (!isIndividualSchedule) {
      startTime = combineDateTime(formData.startDate, formData.startTime);
      
      const endDate = formData.multiDay ? formData.endDate : formData.startDate;
      endTime = combineDateTime(endDate, formData.endTime);
    }

    const normalizedSchedule = parsedSchedule.map((entry) => ({
      startTime: combineDateTime(dayjs(entry.date), dayjs(entry.startTime)),
      endTime: combineDateTime(dayjs(entry.date), dayjs(entry.endTime)),
    }));

    return {
      images: formData.images,
      categoryId: formData.category,
      title: formData.title,
      description: formData.description,
      startTime,
      endTime,
      location: formData.locationType === "online" ? "Онлайн" : formData.address,
      isPrime: formData.isPrime,
      refundDateCount: formData.refundDateCount,
      isAutoRefund: formData.isAutoRefund ? 1 : 0,
      status: formData.status,
      onlineInfo:
        formData.locationType === "online"
          ? JSON.stringify({
              link: formData.onlineLink,
              password: formData.onlinePassword,
              instructions: formData.onlineInstructions,
            })
          : null,
      eventDailys: isIndividualSchedule
        ? JSON.stringify(normalizedSchedule)
        : "[]",
    };
  }, [formData]);

  return {
    formData,
    setFormData,
    formErrors,
    handleInputChange,
    validateForm,
    wasValidated,
    preparedData,
    generalError,
    isDirty,
  };
};
