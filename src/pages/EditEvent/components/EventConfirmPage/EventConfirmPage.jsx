import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Flex } from "antd";

import { useEditEvent, useGetEventById } from "../../../../common/API/services/events/hooks.api";
import { useUpdateEventForm } from "../../hooks/useEditEventForm";
import { editEventSteps } from "../../heplers/evetSteps";

import MyButton from "../../../../common/components/UI/Button/MyButton";
import { MyLoader, MySteps, OrganizerLayout } from "../../../../common/components";

import { EventConfirm } from "../../../../modules/EventConfirm";

import styles from "./EventConfirmPage.module.scss";
import Title from "antd/es/typography/Title";


const EventConfirmPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { mutateAsync: editEvent } = useEditEvent();
  const { data: eventData, isLoading: eventDataLoader, refetch: refetchEventData } = useGetEventById(id);

  // хук работы с объектом формы мероприятия
  const { formData, handleInputChange, preparedData } = useUpdateEventForm(eventData);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500)
  }, [])

  const handleSaveButton = async () => {
    if (eventData.tickets.length === 0) {
      navigate(`/events/manage/edit/${id}/tickets`);
      return;
    }
  
    setIsLoading(true);
  
    const updatedData = {
      ...preparedData,
      status: 'Опубликовано',
    };
  
    try {
      await editEvent({ id, data: updatedData });
      navigate('/events/manage/my-events');
    } finally {
      setIsLoading(false);
    }
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
      refetchEventData={refetchEventData}
    >
      <div className={styles.createEventPage}>
        <div className={styles.formContent}>
          {eventDataLoader || isLoading ? (
            <MyLoader style={{height: "60vh"}} />
          ) : eventData.tickets.length === 0 ? (
            <>
              <Flex className={styles.errorMessage}>
                <Title level={4} className={styles.errorText}>
                  Вы не заполнили билеты! Для публикации необходимо создать
                  минимум 1 билет на мероприятие!
                </Title>
              </Flex>
            <EventConfirm handleInputChange={handleInputChange} eventData={eventData} />
            </>
          ) : (
            <EventConfirm handleInputChange={handleInputChange} eventData={eventData} />
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
