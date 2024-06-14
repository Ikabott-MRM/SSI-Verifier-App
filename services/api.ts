import { JWK } from 'jose';
import axios from './axios';

export default {
  getIssuerPubKey: async (): Promise<JWK> => {
    try {
      const response = await axios.get('/issuerAgent/issuerPubK');
      return response?.data?.data;
    } catch (e: any) {
      throw e?.response?.data;
    }
  },
};
