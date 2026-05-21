import axios from 'axios';
import { isAxiosError } from 'axios';
import Toast from 'react-native-root-toast';
import i18n from '@/utils/language/i18nextConfig';

interface ErrorResponse {
  message: string;
}


const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

const apiKey = process.env.EXPO_PUBLIC_API_KEY || '';
// Backend expects x-api-key (see identity HeaderApiKeyStrategy)
instance.defaults.headers.common['x-api-key'] = apiKey;
instance.defaults.headers.common['api_key'] = apiKey;

instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (isAxiosError(error)) {
      const err = error.response?.data as ErrorResponse | undefined;
      const resolved =
        err?.message || i18n.t('An unexpected error occurred.');
      error.message = resolved;

      Toast.show(`${i18n.t('API error label')}: ${resolved}`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
    } else {
      const msg =
        error instanceof Error && error.message
          ? error.message
          : i18n.t('An unexpected error occurred.');
      Toast.show(`${i18n.t('Unexpected error label')}: ${msg}`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
    }

    return Promise.reject(error);
  },
);


export default instance;
