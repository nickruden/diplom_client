import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTicket, deleteTicket, getTicketsByEvent, updateTicket } from "./endpoints";
import { jsx } from "react/jsx-runtime";

export const useGetTicketsByEvent = (id) => {
  console.log(id)
  return useQuery({
    queryKey: ["get_all_event_tickets", id],
    queryFn: async () => { 
      const data = await getTicketsByEvent(id);
      return data;
    },
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => createTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_all_event_tickets"],
        exact: false, // можно true, если ключ точно совпадает, иначе false
      });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_all_event_tickets"],
        exact: false, // можно true, если ключ точно совпадает, иначе false
      });
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_all_event_tickets"],
        exact: false, // можно true, если ключ точно совпадает, иначе false
      });
    },
  });
};
