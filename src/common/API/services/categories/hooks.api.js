import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from "./endpoints";

export const useGetCategory = () => {
  return useQuery({
    queryKey: ["get_all_categories"],
    queryFn: () => getAllCategories(),
  });
};
