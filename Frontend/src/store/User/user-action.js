import { userActions } from "./user-slice";
import {axiosInstance } from  "../../utils/axios";
import axios from "axios";

//signup
export const getSignup = (user) => async(dispatch) =>{
    try{
        dispatch(userActions.getSignupRequest());
        const {data} = await axiosInstance.post("/user/signup", user);
        dispatch(userActions.getSignupDetails(data.user))
    }catch(error){
        dispatch(userActions.getError(error.response.data.message))
    }
}

//login
export const getLogin=(user) => async(dispatch) =>{
    try{
        dispatch(userActions.getLoginRequest());
        const {data} = await axiosInstance.post("/user/login", user);
        dispatch(userActions.getLoginDetails(data.user))
    }catch(error){
        dispatch(userActions.getError(error.response?.data?.message || error.message))
    }
}

export const currentUser = () => async(dispatch) =>{
    try{
        dispatch(userActions.getCurrentRequest());
        const {data} = await axiosInstance.get("/user/me");
        dispatch(userActions.getCurrentUser(data.user))
    }catch(error){
        dispatch(userActions.getLogout(null));
    }
}

export const updateUser = (updateUser) => async(dispatch)=>{
    try{
        dispatch(userActions.getUpdateUserRequest());
        const response = await axiosInstance.patch("/user/updateMe", updateUser);
        console.log(response)
        const {data} = await axiosInstance.get("/user/me")
        dispatch(userActions.getCurrentUser(data.user));
    }catch(error){
        dispatch(userActions.getError(error.response.data.message))
    }
}

export const forgotPassword = (email)=> async(dispatch)=>{
    try{
        await axiosInstance.post("/user/forgotPassword", {email})
    }catch(error){
        dispatch(userActions.getError(error.response.data.message))
    }
}

export const resetPassword = (resetpassword, token)=> async(dispatch)=>{
    try{
            await axiosInstance.patch(`/user/resetPassword/${token}`, resetpassword)
    }catch(error){
        dispatch(userActions.getError(error.response.data.message))
    }
}

export const updatePassword = (passwords) => async (dispatch) =>{
    try{
        dispatch(userActions.getPasswordRequest());
        await axiosInstance.patch("/user/updateMyPassword", passwords)
        dispatch(userActions.getPasswordSuccess(true))
    }catch(error){
        dispatch(userActions.getError(error.response.data.message))
    }
}

export const logout =() => async(dispatch) =>{
    try{
        await axiosInstance.get("/user/logout")
        dispatch(userActions.getLogout(null));
    }catch(error){
        dispatch(userActions.getError(error.response.data.message))
    }
};