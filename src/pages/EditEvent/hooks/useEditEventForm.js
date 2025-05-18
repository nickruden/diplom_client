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
    refundDate: null,
    isAutoRefund: false,
    status: 'Архив',
  });

  useEffect(() => {
    if (initialData) {
      const onlineInfo = initialData?.onlineInfo ? JSON.parse(initialData.onlineInfo) : {};

      setFormData({
        images: initialData.images || [],
        category: initialData.categoryId || "",
        title: initialData.name || "",
        startDate: normalizeToUtcWithoutOffset(dayjs(initialData.startTime)),
        endDate: normalizeToUtcWithoutOffset(dayjs(initialData.endTime)),
        startTime: normalizeToUtcWithoutOffset(dayjs(initialData.startTime)),
        endTime: normalizeToUtcWithoutOffset(dayjs(initialData.endTime)),
        multiDay:
          formatDate(initialData.startTime) != formatDate(initialData.endTime)
            ? "checked"
            : false,
        locationType: initialData.location === "Онлайн" ? "online" : "offline",
        onlineLink: onlineInfo.link || "",
        onlinePassword: onlineInfo.password || "",
        onlineInstructions: onlineInfo.instructions || "",
        address: initialData.location !== "Онлайн" ? initialData.location : "",
        description: initialData.description || "",
        isPrime: initialData.isPrime || false,
        refundDate: initialData?.refundDate
          ? dayjs(initialData.refundDate)
          : null,
        isAutoRefund: initialData?.isAutoRefund ?? false,
        status: initialData?.status || "Архив",
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
    if (!formData.startTime) errors.startTime = true;
    if (!formData.endTime) errors.endTime = true;
    if (
      !formData.startDate ||
      !formData.startTime ||
      !formData.endTime ||
      (formData.multiDay && !formData.endDate)
    )
      errors.dateTime = true;
    if (formData.locationType === "offline" && !formData.address)
      errors.address = true;
    if (!formData.description) errors.description = true;
    if (formData.locationType === "online" && !formData.onlineLink)
  errors.onlineLink = true;

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

  const preparedData = useMemo(
    () => ({
      images: formData.images,
      categoryId: formData.category,
      title: formData.title,
      description: formData.description,
      startTime: combineDateTime(formData.startDate, formData.startTime),
      endTime: combineDateTime(
        formData.endDate || formData.startDate,
        formData.endTime
      ),
      location:
        formData.locationType === "online" ? "Онлайн" : formData.address,
      isPrime: formData.isPrime,
      refundDate: dayjs(formData.refundDate || new Date()).toISOString(),
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
    }),
    [formData]
  );

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
