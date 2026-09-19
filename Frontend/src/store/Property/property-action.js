import { propertyAction } from "./property-slice";
import { axiosInstance } from "../../utils/axios";

// Get all properties
export const getAllProperties = () => async (dispatch, getState) => {
    try {
        console.log("API call started");

        dispatch(propertyAction.getRequest());

        const { searchParams } = getState().properties;

        console.log("SEARCH PARAMS FROM REDUX:", JSON.stringify(searchParams, null, 2));

        // Convert DD-MM-YYYY to YYYY-MM-DD
        const formatDateForAPI = (date) => {
            if (!date) return "";

            const [day, month, year] = date.split("-");

            return `${year}-${month}-${day}`;
        };

        const formattedParams = {
            ...searchParams,
            dateIn: formatDateForAPI(searchParams.dateIn),
            dateOut: formatDateForAPI(searchParams.dateOut)
        };

        console.log("PARAMS SENT TO BACKEND:", JSON.stringify(formattedParams, null, 2));

        const response = await axiosInstance.get(`/listing`, {
            params: formattedParams
        });

        if (!response) {
            throw new Error("Could not fetch any properties");
        }

        const { data } = response;

        console.log("Properties data:", data);

        dispatch(propertyAction.getProperties(data));

    } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("STATUS:", error.response?.status);
        console.log("BACKEND RESPONSE:", error.response?.data);

        dispatch(propertyAction.getErrors(error.message));
    }
};