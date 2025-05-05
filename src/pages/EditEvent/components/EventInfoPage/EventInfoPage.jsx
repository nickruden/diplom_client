import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Flex, message } from "antd";

import { useEditEvent, useGetEventById } from "../../../../common/API/services/events/hooks.api";
import { useUpdateEventForm } from "../../hooks/useEditEventForm";
import { editEventSteps } from "../../heplers/evetSteps";

import MyButton from "../../../../common/components/UI/Button/MyButton";
import { MyLoader, MySteps, OrganizerLayout } from "../../../../common/components";
import { EventForm } from "../../../../modules/EventForm";

import styles from "./EventInfoPage.module.scss";


const EditEventPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const { mutate: editEvent } = useEditEvent();
  const { data: eventData, isLoading: eventDataLoader } = useGetEventById(id);
  console.log(1)

  // хук работы с объектом формы мероприятия
  const { formData, handleInputChange, preparedData, formErrors, wasValidated, validateForm, generalError, isDirty } = useUpdateEventForm(eventData);

  const handleSaveButton = () => {
      const isValid = validateForm();

      if (!isValid) return message.error(generalError);

    editEvent({id, data: preparedData});
    navigate(`/events/manage/edit/${id}/tickets`);
  };

  const handleStepChange = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  return (
    <OrganizerLayout
     formData={formData}
      steps={
        <MySteps
          direction="vertical"
          steps={editEventSteps(id)}
          currentStep={currentStep}
          onStepClick={handleStepChange}
        />
      }
    >
      <Flex vertical justify="space-between" className={styles.createEventPage}>
        <div className={styles.formContent}>
          {eventDataLoader ? (
            <MyLoader />
          ) : (
            <EventForm
              formData={formData}
              handleInputChange={handleInputChange}
              formErrors={formErrors}
              wasValidated={wasValidated}
            />
          )}
        </div>
        <Flex justify="center" gap={10} className={styles.formActions}>
          <MyButton
            type="primary"
            size="large"
            onClick={handleSaveButton}
            className={styles.buttonSave}
          >
            Сохранить и продолжить
          </MyButton>
        </Flex>
      </Flex>
    </OrganizerLayout>
  );
};

export default EditEventPage;
