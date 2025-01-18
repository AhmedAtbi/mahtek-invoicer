import { urlBase } from "./parameters";
import axios from "axios";

export const getInstance = () => {
    return axios.create({
        baseURL: urlBase, // Update with your API URL
        headers: {
            'Content-Type': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': 'http://localhost:3000', // Update with your frontend URL
        },
    });
};

export const get = (route, parms = '') => {
    return getInstance()?.get(route + parms);
}

export const _delete = (route) => {

    return getInstance()?.delete(route);
}

export const post = (route, jsonData) => {
    return getInstance()?.post(route, jsonData);
}

export const put = (route, jsonData) => {
    return getInstance()?.put(route, jsonData);
}



