import { JWK } from 'jose';
import axios from './axios';
import i18n from '@/utils/language/i18nextConfig';

export default {
  getIssuerPubKey: async (): Promise<JWK> => {
    try {
      const response = await axios.get('/issuerAgent/issuerPubK');
      if (response) {
        return response.data?.data;
      } else {
        throw new Error(i18n.t('No data returned from API'));
      }
    } catch (e: unknown) {
      const fromServer =
        e &&
        typeof e === 'object' &&
        'response' in e &&
        (e as { response?: { data?: unknown } }).response?.data;
      const serverMsg =
        typeof fromServer === 'string' && fromServer.trim()
          ? fromServer
          : null;
      throw new Error(
        serverMsg || i18n.t('Failed to fetch issuer public key'),
      );
    }
  },
};
