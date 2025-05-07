import { useMutation } from "@tanstack/react-query";
import { cancelPeyment, confirmPeyment, createPeyment, refundTickets } from "./endpoints";

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: (data) => createPeyment(data),
  });
};

export const useConfirmPayment = () => {
  return useMutation({
    mutationFn: (data) => confirmPeyment(data),
  });
};

export const useCancelPayment = () => {
  return useMutation({
    mutationFn: (data) => cancelPeyment(data),
  });
};

export const useRefundTicket = () => {
  return useMutation({
    mutationFn: (id) => refundTickets(id),
  });
};
