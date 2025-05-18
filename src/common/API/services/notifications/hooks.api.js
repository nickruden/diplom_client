import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserNotifications, markAsRead } from "./endpoints";

export const useGetUserNotifications = (id) => {
  return useQuery({
    queryKey: ["get_all_notify_tickets", id],
    queryFn: async () => { 
      const data = await getUserNotifications(id);
      return data;
    },
  });
};

export const useMarkAsRead = () => {
return useMutation({
    mutationFn: (id) => markAsRead(id),
  });
};
