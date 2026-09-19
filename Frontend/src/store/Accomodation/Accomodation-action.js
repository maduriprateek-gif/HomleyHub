import { accomodationActions } from "./Accomodation-slice";
import { axiosInstance } from "../../utils/axios";

// CREATE ACCOMMODATION
export const createAccomodation = (accomodationData) => async (dispatch) => {
  try {
    dispatch(accomodationActions.getAccomodationRequest());

    console.log("Sending accommodation data:", accomodationData);

    const { data } = await axiosInstance.post(
      "/user/newAccommodation",
      accomodationData
    );

    console.log("Accommodation created:", data);

    return data;
  } catch (error) {
    console.error(
      "Create accommodation error:",
      error.response?.data || error
    );

    dispatch(
      accomodationActions.getErrors(
        error.response?.data?.message || error.message
      )
    );

    throw error;
  }
};


// GET ALL MY ACCOMMODATIONS
export const getAllAccomodation = () => async (dispatch) => {
  try {
    dispatch(accomodationActions.getAccomodationRequest());

    const { data } = await axiosInstance.get(
      "/user/myAccommodation"
    );

    console.log("My accommodations:", data);

    const accomodation = data?.data || [];

    dispatch(
      accomodationActions.getAccomodation(accomodation)
    );

    return accomodation;
  } catch (error) {
    console.error(
      "Get accommodations error:",
      error.response?.data || error
    );

    dispatch(
      accomodationActions.getErrors(
        error.response?.data?.message || error.message
      )
    );

    throw error;
  }
};