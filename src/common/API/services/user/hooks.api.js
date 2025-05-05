import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteUser, followCreator, getCreatorInfoById, getCreatorsInfo, getFollowingCreatorsInfo, getMyFollowing, getUserInfo, unfollowCreator, updateUserInfo } from "./endpoints";
import { useDispatch } from "react-redux";
import { loginedUser } from "../../../store/slices/user.slice";
import { addFollowingOrganizer, removeFollowingOrganizer, setFollowingOrganizers } from "../../../store/slices/following.slice";

export const useGetUserInfo = (id, isAuth) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["get_user_by_id"],
    queryFn: async () => { 
      const data = await getUserInfo(id);
      dispatch(loginedUser(data));
      return data;
    },
    enabled: isAuth
  });
};

export const useUpdateUserInfo = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, data }) => updateUserInfo(id, data),
    onSuccess: (data) => {
      console.log(2, data)
      dispatch(loginedUser(data));
    },
    onError: (err) => {
      console.error('Ошибка обновления профиля:', err);
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      console.log(1)
    },
    onError: (err) => {
      console.error('Ошибка удаления профиля:', err);
    },
  });
};

export const useGetCreatorInfoById = (id) => {
  return useQuery({
    queryKey: ["get_creator_by_id", id],
    queryFn: () => getCreatorInfoById(id),
  });
};

export const useGetCreatorsInfo = () => {
  return useQuery({
    queryKey: ["get_creators_info"],
    queryFn: () => getCreatorsInfo(),
  });
};

export const useGetFollowingCreatorsInfo = () => {
  return useQuery({
    queryKey: ["get_following_creators_info"],
    queryFn: async () => {
      const data = await getFollowingCreatorsInfo();
      return data;
    },
  });
};

export const useGetFollowingOrganizers = (isAuth) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['get_following_organizers'],
    queryFn: async () => {
      const data = await getMyFollowing();
      dispatch(setFollowingOrganizers(data));
      return data;
    },
    enabled: isAuth,
  });
};

export const useFollowOrganizer = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (organizerId) => followCreator(organizerId),
    onSuccess: (organizerId) => {
      dispatch(addFollowingOrganizer(organizerId));
    },
  });
};

export const useUnfollowOrganizer = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (organizerId) => unfollowCreator(organizerId),
    onSuccess: (organizerId) => {
      dispatch(removeFollowingOrganizer(organizerId));
    },
  });
};
