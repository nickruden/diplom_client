import apiInstance from "../../instance";

export const getUserInfo = async (id) => {
  const response = await apiInstance.get(`/user/profile/${id}`);
  return response.data;
};

export const updateUserInfo = async (id, data) => {
  const response = await apiInstance.patch(`/user/update/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiInstance.delete(`/user/delete/${id}`);
  return response.data;
};

export const getCreatorInfoById = async (id) => {
  const response = await apiInstance.get(`/user/creator/${id}`);
  return response.data;
};

export const getCreatorsInfo = async () => {
  const response = await apiInstance.get(`/user/creators`);
  return response.data;
};

export const getFollowingCreatorsInfo = async () => {
  const response = await apiInstance.get(`/user/creators/my-following/info`);
  return response.data;
};

export const getMyFollowing = async () => {
  const response = await apiInstance.get(`/user/creators/my-follows`);
  return response.data;
};

export const followCreator = async (id) => {
  const response = await apiInstance.post(`/user/creators/follow/${id}`);
  return response.data;
};

export const unfollowCreator = async (id) => {
  const response = await apiInstance.delete(`/user/creators/unfollow/${id}`);
  return response.data;
};
