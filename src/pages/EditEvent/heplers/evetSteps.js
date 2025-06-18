export const editEventSteps = (eventId) => [
    { title: "Основная информация", path: `/events/manage/edit/${eventId}/info` },
    { title: "Билеты", path: `/events/manage/edit/${eventId}/tickets` },
    { title: "Публикация", path: `/events/manage/edit/${eventId}/confirm` },
  ];
  