import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTicket, deleteTicket, getMyTickets, getTicketsByEvent, refundTickets, updateTicket } from "./endpoints";

export const useGetTicketsByEvent = (id) => {
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
        exact: false,
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
        exact: false,
      });
    },
  });
};

export const useDeleteTicket = () => {
  return useMutation({
    mutationFn: (id) => deleteTicket(id),
    onSuccess: () => console.log("билет удалился")
  });
};

export const useGetMyTickets = () => {
  return useQuery({
    queryKey: ["get_my_tickets"],
    queryFn: async () => { 
      const data = await getMyTickets();
      return data;
    },
  });
};

export const useRefundTickets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => refundTickets(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_all_event_tickets"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["get_event_by_id"],
        exact: false,
      });
    },
  });
};
