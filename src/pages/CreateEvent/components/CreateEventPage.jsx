import React, { useState } from "react";
import { Flex } from "antd";

import { useCreateEvent } from "../../../common/API/services/events/hooks.api";
import { useCreateEventForm } from "../hooks/useCreateEventForm";

import MyButton from "../../../common/components/UI/Button/MyButton";

import { MySteps, OrganizerLayout } from "../../../common/components";

import { EventForm } from "../../../modules/EventForm";


import styles from "./CreateEventPage.module.scss";


const CreateEventPage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const { mutate: createEvent } = useCreateEvent();

  const handleNext = () => {
    if (currentStep === 0) {
      const isValid = validateForm();

      if (!isValid) return;

      createEvent(preparedData);
    }
  };

  // хук работы с объектом формы мероприятия
  const {
    formData,
    handleInputChange,
    preparedData,
    formErrors,
    wasValidated,
    validateForm
  } = useCreateEventForm();

  const steps = [
    {
      title: "Основная информация",
      path: '/events/manage/create'
    },
    {
      title: "Билеты",
      path: '/events/manage/create'
    },
    {
      title: "Подтверждение",
      path: '/events/manage/create'
    },
  ];

  return (
    <OrganizerLayout
      type="createEventPage"
      steps={
        <MySteps direction="vertical" steps={steps} currentStep={currentStep} />
      }
    >
      <div className={styles.createEventPage}>
        <div className={styles.formContent}>
          <EventForm
            formData={formData}
            handleInputChange={handleInputChange}
            formErrors={formErrors}
            wasValidated={wasValidated}
          />
        </div>
        <Flex gap={10} className={styles.formActions}>
          <MyButton
            type="primary"
            size="large"
            onClick={handleNext}
            className={styles.buttonPrev}
          >
            Далее
          </MyButton>
        </Flex>
      </div>
    </OrganizerLayout>
  );
};

export default CreateEventPage;
