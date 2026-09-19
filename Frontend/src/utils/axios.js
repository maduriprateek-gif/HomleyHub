//centeralized API setup

import axios from "axios";
import qs from "qs";

export const axiosInstance = axios.create({
    baseURL: "/api/v1/rent",
    withCredentials: true,
    paramsSerializer: params =>
        qs.stringify(params, { arrayFormat: "repeat" }),
});

