import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';

const useIssuerPubKeyQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ISSUER_PUB_KEY],
    queryFn: api.getIssuerPubKey,
    enabled: false,
  });
};

export default useIssuerPubKeyQuery;
