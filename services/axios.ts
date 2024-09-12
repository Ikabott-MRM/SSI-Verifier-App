import axios from 'axios';
import { isAxiosError } from 'axios';
import Toast from 'react-native-root-toast';

interface ErrorResponse {
  message: string;
}


const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

instance.defaults.headers['api_key'] = process.env.EXPO_PUBLIC_API_KEY || '';

instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (isAxiosError(error)) {
      const err: ErrorResponse = error.response?.data;;
     
        error.message =  (err.message || 'An unexpected error occurred.');

      Toast.show(`API Error: ${error.message}` as string, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
    } 
    else {
      // unexpected errors
      Toast.show(`Unexpected Error: ${error.message}` as string, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });    }

    return Promise.reject(error);
  },
);


export default instance;
