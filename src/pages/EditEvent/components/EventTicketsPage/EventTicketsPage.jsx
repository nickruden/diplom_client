import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Flex } from "antd";

import { useEditEvent, useGetEventById } from "../../../../common/API/services/events/hooks.api";
import { useUpdateEventForm } from "../../hooks/useEditEventForm";
import { editEventSteps } from "../../heplers/evetSteps";

import MyButton from "../../../../common/components/UI/Button/MyButton";
import { MyLoader, MySteps, OrganizerLayout } from "../../../../common/components";
import { EventForm } from "../../../../modules/EventForm";

import styles from "./EventTicketsPage.module.scss";
import { EventTickets } from "../../../../modules/EventTicketsList";


const EditEventPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: eventData, isLoading: eventDataLoader, refetch: refetchEventData } = useGetEventById(id);

  // хук работы с объектом формы мероприятия
  const { formData, preparedData } = useUpdateEventForm(eventData);

  const handleSaveButton = () => {
    navigate(`/events/manage/edit/${id}/confirm`);
  };

  const handleStepChange = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

return eventDataLoader ? (
  <MyLoader />
) : (
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
    <Flex vertical justify="space-between" className={styles.createEventPage}>
      <div className={styles.formContent}>
        <EventTickets refetchEventData={refetchEventData} eventData={formData} />
      </div>
      <Flex justify="center" gap={10} className={styles.formActions}>
        <MyButton
          type="primary"
          size="large"
          onClick={handleSaveButton}
          className={styles.buttonSave}
        >
          Далее
        </MyButton>
      </Flex>
    </Flex>
  </OrganizerLayout>
);

};

export default EditEventPage;
