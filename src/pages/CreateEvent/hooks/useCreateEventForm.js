import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";

const combineDateTime = (date, time) => {
  if (!date || !time) return null;
  const datePart = typeof date === "string" ? date : dayjs(date).format("YYYY-MM-DD");
  const timePart = typeof time === "string" ? time : dayjs(time).format("HH:mm");
  return `${datePart}T${timePart}:00Z`;
};

export const useCreateEventForm = () => {
  const [formData, setFormData] = useState({
    images: [],
    category: "",
    title: "",
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    multiDay: false,
    locationType: "online",
    address: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [wasValidated, setWasValidated] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: false }));
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
    if (!formData.startDate || !formData.startTime || !formData.endTime || (formData.multiDay && !formData.endDate)) errors.dateTime = true;
    if (formData.locationType === "offline" && !formData.address) errors.address = true;
    if (!formData.description) errors.description = true;

    setFormErrors(errors);
    setWasValidated(true);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (formData.locationType === "offline" && !formData.address) {
      setFormErrors(prev => ({ ...prev, address: true }));
    } else {
      setFormErrors(prev => ({ ...prev, address: false }));
    }
  }, [formData.locationType, formData.address]);

  const preparedData = useMemo(() => ({
    images: formData.images,
    categoryId: formData.category,
    title: formData.title,
    description: formData.description,
    startTime: combineDateTime(formData.startDate, formData.startTime),
    endTime: combineDateTime(formData.endDate || formData.startDate, formData.endTime),
    location: formData.locationType === "online" ? "Онлайн" : formData.address,
  }), [formData]);

  return {
    formData,
    setFormData,
    formErrors,
    handleInputChange,
    validateForm,
    wasValidated,
    preparedData,
  };
};
