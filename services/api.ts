import { JWK } from 'jose';
import axios from './axios';

export default {
  getIssuerPubKey: async (): Promise<JWK> => {
    try {
      const response = await axios.get('/issuerAgent/issuerPubK');
      console.log(response)
      if (response) {
        return response.data?.data;
      } else {
        throw new Error(`No data returned from API`);
      }
    } catch (e: any) {
      throw new Error(e?.response?.data || `Failed to fetch issuer public key`);
    }
  },
};
