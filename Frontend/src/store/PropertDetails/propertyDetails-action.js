import { propertyDetailsAction } from "./propertyDetails-slice";
import {axiosInstance} from "../../utils/axios";

//fetch details of one specific property using its id

//recive the property id
//start loading
//call backend api
//wait for response
//get the property data
//store the details in redux
//if error store error in redux

export const getPropertyDetails = (id) => async (dispatch) =>{
    try{
        console.log("ID SENT TO BACKEND:", id);
        dispatch(propertyDetailsAction.getListRequest());
        const response = await axiosInstance.get(`/listing/${id}`)
        console.log("PROPERTY RESPONSE:",JSON.stringify(response.data, null, 2));

        const{data} = response.data;
        dispatch(propertyDetailsAction.getPropertyDetails(data))
    }catch(error){
        console.log("PROPERTY ERROR:", error);

        dispatch(propertyDetailsAction.getErrors(error.response?.data?.error || error.message))
    }
}