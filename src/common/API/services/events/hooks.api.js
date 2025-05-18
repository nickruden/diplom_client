import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllEvents, getEventsByCreator, getEventById, getEventsByCategory, createEvent, updateEvent, deleteImage, getFavoriteEventsInfo, unsetFavoriteEvent, favoritedEvent, getMyFavoriteEvents, getEventPuchases, deleteEvent } from "./endpoints";
import { updateEventCount } from "../../../store/slices/user.slice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addFavoriteEvent, removeFavoriteEvent, setFavoriteEvent } from "../../../store/slices/favorite.slice";

export const useGetEvents = (filters = {}) => {
  return useQuery({
    queryKey: ["get_all_events", filters],
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

export const useGetEventByCategory = (slug, filters = {}) => {
  return useQuery({
    queryKey: ["get_event_by_category", slug, filters],
    queryFn: () => getEventsByCategory(slug, filters),
  });
};

export const useCreateEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data) => createEvent(data),
    onSuccess: (data) => {
      dispatch(updateEventCount(data.eventsCount));
      navigate(`/events/manage/edit/${data.eventId}/tickets`);
    }
  });
};

export const useEditEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_event_by_creator"],
        exact: false,
      });
    },
  });
};

export const useDeleteEvent = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}) => deleteEvent(id, data),
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
      return deleteImage(publicId);
    },
    onSuccess: () => console.log("картинка удалилась"),
    onError: (err) => {
      console.error("Ошибка удаления картинки:", err);
    },
  });
};

export const useGetFavoriteEvents = (isAuth) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['get_favorite_events'],
    queryFn: async () => {
      const data = await getMyFavoriteEvents();
      dispatch(setFavoriteEvent(data));
      return data;
    },
    enabled: isAuth,
  });
};

export const useSetFavoriteEvent = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (eventId) => favoritedEvent(eventId),
    onSuccess: (eventId) => {
      dispatch(addFavoriteEvent(eventId));
    },
  });
};

export const useUnsetFavoriteEvent = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (eventId) => unsetFavoriteEvent(eventId),
    onSuccess: (eventId) => {
      dispatch(removeFavoriteEvent(eventId));
    },
  });
};

export const useGetFavoriteEventsInfo = () => {
  return useQuery({
    queryKey: ["get_favorite_events_info"],
    queryFn: async () => {
      const data = await getFavoriteEventsInfo();
      return data;
    },
  });
};


export const useGetEventPuchases = (id) => {
  return useQuery({
    queryKey: ["get_event_puchases_id", id],
    queryFn: () => getEventPuchases(id),
  });
};
