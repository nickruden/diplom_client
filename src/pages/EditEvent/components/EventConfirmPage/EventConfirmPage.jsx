import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Flex } from "antd";

import { useEditEvent, useGetEventById } from "../../../../common/API/services/events/hooks.api";
import { useUpdateEventForm } from "../../hooks/useEditEventForm";
import { editEventSteps } from "../../heplers/evetSteps";

import MyButton from "../../../../common/components/UI/Button/MyButton";
import { MyLoader, MySteps, OrganizerLayout } from "../../../../common/components";

import { EventConfirm } from "../../../../modules/EventConfirm";

import styles from "./EventConfirmPage.module.scss";


const EventConfirmPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const { mutate: editEvent } = useEditEvent();
  const { data: eventData, isLoading: eventDataLoader } = useGetEventById(id);

  // хук работы с объектом формы мероприятия
  const { formData, handleInputChange, preparedData } = useUpdateEventForm(eventData);

  const handleSaveButton = () => {
    const updatedData = {
      ...preparedData,
      status: 'Опубликовано',
    };
    
    editEvent({
      id,
      data: updatedData,
    });
  
    navigate('/events/manage/my-events');
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
      <div className={styles.createEventPage}>
        <div className={styles.formContent}>
          {eventDataLoader ? (
            <MyLoader />
          ) : (
            <EventConfirm handleInputChange={handleInputChange} />
          )}
        </div>
        <Flex gap={10} className={styles.formActions}>
          <MyButton
            type="primary"
            size="large"
            color="orange"
            onClick={handleSaveButton}
            className={styles.buttonSave}
          >
            Опубликовать
          </MyButton>
        </Flex>
      </div>
    </OrganizerLayout>
  );
};

export default EventConfirmPage;
