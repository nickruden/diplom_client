import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllEvents, getEventsByCreator, getEventById, getEventsByCategory, createEvent, updateEvent, delereEvent, deleteImage } from "./endpoints";
import { updateEventCount } from "../../../store/slices/user.slice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export const useGetEvents = (filters = {}) => {
  return useQuery({
    queryKey: ["get_all_evetns", filters],
    queryFn: () => getAllEvents(filters),
  });
};

export const useGetEventById = (id) => {
  return useQuery({
    queryKey: ["get_event_by_id", id],
    queryFn: () => getEventById(id),
  });
};

export const useGetEventsByCreator = (id, filter) => {
  return useQuery({
    queryKey: ["get_event_by_creator", id, filter],
    queryFn: () => getEventsByCreator(id, filter)
  });
};

export const useGetEventByCategory = (slug) => {
  return useQuery({
    queryKey: ["get_event_by_category", slug],
    queryFn: () => getEventsByCategory(slug),
  });
};

export const useCreateEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data) => createEvent(data),
    onSuccess: (data) => {
      console.log(data);
      dispatch(updateEventCount(data.eventsCount));
      navigate(`/events/manage/edit/${data.eventId}/tickets`);
    }
  });
};

export const useEditEvent = () => {
  return useMutation({
    mutationFn: ({ id, data }) => updateEvent(id, data),
    onSuccess: () => console.log("всё обновилось")
  });
};

export const useDeleteEvent = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => delereEvent(id),
    onSuccess: (data) => {
      dispatch(updateEventCount(data.eventCount));
      queryClient.invalidateQueries({
        queryKey: ["get_event_by_creator"], // обязательно точно соответствует key в useGetEventsByCreator
        exact: false, // можно true, если ключ точно совпадает, иначе false
      });
    },
    onError: (err) => {
      console.error('Ошибка удаления профиля:', err);
    },
  });
};

export const useDeleteImage = () => {
  return useMutation({
    mutationFn: ({ publicId }) => {
      console.log("mutation publicId:", publicId);
      return deleteImage(publicId);
    },
    onSuccess: () => console.log("картинка удалилась"),
    onError: (err) => {
      console.error("Ошибка удаления картинки:", err);
    },
  });
};
