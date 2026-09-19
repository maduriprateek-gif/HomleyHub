import { axiosInstance } from "../utils/axios";

export const getTripPlan = async (trip) => {
  const { data } = await axiosInstance.post("/trip", trip);
  return data.data;
};
