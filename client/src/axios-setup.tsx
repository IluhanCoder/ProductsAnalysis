import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export function setHeader() {
  const token = localStorage.getItem("token");
  $api.defaults.headers.common['Authorization'] = token;
}

export function dropHeader() {
  $api.defaults.headers.common['Authorization'] = null;
}

export default $api;
