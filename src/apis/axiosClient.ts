import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import queryString from 'query-string';
import {localNames} from '../constants/localNames';

const getAccessToken = async () => {
  const res = await AsyncStorage.getItem(localNames.authData);
  return res && res !== 'null' ? JSON.parse(res) : null;
};

const axiosClient = axios.create({
  baseURL: 'http://192.168.1.244:3001',
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
  const auth = await getAccessToken();

  config.headers = {
    Authorization: auth && auth.accesstoken ? `Bearer ${auth.accesstoken}` : '',
    Accept: 'application/json',

    ...config.headers,
  };

  config.data;
  return config;
});

axiosClient.interceptors.response.use(
  res => {
    if (res.data && res.status >= 200 && res.status < 300) {
      return res.data;
    } else {
      return Promise.reject(res.data);
    }
  },
  error => {
    const {response} = error;
    return Promise.reject(response.data.message);
  },
);

export default axiosClient;
