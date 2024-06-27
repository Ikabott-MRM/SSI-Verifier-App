import * as SecureStore from 'expo-secure-store';
export const KEY_DID_SECURE_STORE = 'iovf_issuer_pub_key';
import nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';
import { Payload } from '@/components/CredentialData';
const isJwtExpired = (exp: number) => {
  return new Date() >= new Date(exp * 1000);
};

export const verifyJWTSignature = (
  jwt: string,
  issuerPubKey: string,
): { payload: Payload | null; isExpired: boolean } | null => {
  try {
    const [headerEncoded, payloadEncoded, signatureEncoded] = jwt.split('.');

    const header = JSON.parse(
      Buffer.from(headerEncoded, 'base64').toString('utf-8'),
    );
    console.log('header');
    console.log(header);

    const payload = JSON.parse(
      Buffer.from(payloadEncoded, 'base64').toString('utf-8'),
    );
    console.log('payload');
    console.log(payload);

    const isExpired = isJwtExpired(payload.exp);

    if (!isExpired) {
      const signature = Buffer.from(signatureEncoded, 'base64');
      console.log('signature');
      console.log(signature);

      // Ensure the JWT uses EdDSA algorithm
      if (header.alg !== 'EdDSA') {
        throw new Error('Invalid algorithm');
      }

      const decodedPublicKey = Buffer.from(issuerPubKey, 'base64');
      console.log('decoded pub key');
      console.log(decodedPublicKey);

      // Verify the signature
      const isVerified = nacl.sign.detached.verify(
        naclUtil.decodeUTF8(`${headerEncoded}.${payloadEncoded}`),
        signature,
        decodedPublicKey,
      );

      if (isVerified) {
        console.log('JWT signature verified successfully');
        console.log('Payload:', payload);
        return { payload, isExpired };
      } else {
        return null;
      }
    } else {
      console.log('JWT has expired');
      return { payload, isExpired };
    }
  } catch (error) {
    console.error('Error verifying JWT signature:', error);
    return null;
  }
};

export const getPubKeyFromStore = () => {
  return SecureStore.getItem(KEY_DID_SECURE_STORE);
};

export const savePubKeyToStore = (key: string, value: any) => {
  SecureStore.setItem(key, JSON.stringify(value));
};
