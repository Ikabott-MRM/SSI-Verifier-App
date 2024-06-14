import * as SecureStore from 'expo-secure-store';
export const KEY_DID_SECURE_STORE = 'iovf_issuer_pub_key';
import nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';

export const verifyJWTSignature = (jwt: string, issuerPubKey: string) => {
  try {
    const [headerEncoded, payloadEncoded, signatureEncoded] = jwt.split('.');

    console.log(headerEncoded);
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

    console.log(signatureEncoded);
    const signature = Buffer.from(signatureEncoded, 'base64');
    console.log('signature');
    console.log(signature);

    // Ensure the JWT uses EdDSA algorithm
    if (header.alg !== 'EdDSA') {
      throw new Error('Invalid algorithm');
    }

    console.log(issuerPubKey);
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
      return payload;
    } else {
      console.error('JWT signature verification failed');
      return null;
    }
  } catch (error) {
    console.error('Error verifying JWT signature:', error);
  }
};

export const getPubKeyFromStore = () => {
  return SecureStore.getItem(KEY_DID_SECURE_STORE);
};

export const savePubKeyToStore = (key: string, value: any) => {
  SecureStore.setItem(key, JSON.stringify(value));
};
