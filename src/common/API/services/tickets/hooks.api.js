import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buyTickets, createTicket, deleteTicket, getTicketsByEvent, updateTicket } from "./endpoints";

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
        exact: false,
      });
    },
  });
};

export const useBuyTickets = () => {
  return useMutation({
    mutationFn: (data) => buyTickets(data),
    onSuccess: () => console.log("Вы купили билет!"),
  });
};
