import { ImageSourcePropType } from 'react-native';

export type TenantSlug = 'geyser' | 'avaldao' | 'default';

type TenantBrand = {
  slug: TenantSlug;
  displayName: string;
  primary: string;
  primaryDark: string;
  accent: string;
  /** Text / icon color on primary buttons (readable contrast). */
  onPrimary: string;
  headerBackground: string;
  adaptiveIconBackground: string;
  logo: ImageSourcePropType;
  androidPackageVerifier: string;
  iosBundleVerifier: string;
};

const brands: Record<TenantSlug, TenantBrand> = {
  geyser: {
    slug: 'geyser',
    displayName: 'Geyser',
    primary: '#00F5DC',
    primaryDark: '#21201C',
    accent: '#00C3AD',
    onPrimary: '#21201C',
    headerBackground: '#FFFFFF',
    adaptiveIconBackground: '#00F5DC',
    logo: require('../assets/images/tenants/geyser-logo.png'),
    androidPackageVerifier: 'com.ikabott.ssi.verifier.geyser',
    iosBundleVerifier: 'com.ikabott.ssi.verifier.geyser',
  },
  avaldao: {
    slug: 'avaldao',
    displayName: 'AvalDAO',
    primary: '#292A6D',
    primaryDark: '#1A1B4A',
    accent: '#7868E5',
    onPrimary: '#FFFFFF',
    headerBackground: '#292A6D',
    adaptiveIconBackground: '#292A6D',
    logo: require('../assets/images/tenants/avaldao-logo.png'),
    androidPackageVerifier: 'com.ikabott.ssi.verifier.avaldao',
    iosBundleVerifier: 'com.ikabott.ssi.verifier.avaldao',
  },
  default: {
    slug: 'default',
    displayName: 'SSI Verificador',
    primary: '#0B3D6E',
    primaryDark: '#062847',
    accent: '#4A90A4',
    onPrimary: '#FFFFFF',
    headerBackground: '#0B3D6E',
    adaptiveIconBackground: '#0B3D6E',
    logo: require('../assets/images/tenants/geyser-logo.png'),
    androidPackageVerifier: 'com.ikabott.ssi.verifier',
    iosBundleVerifier: 'com.ikabott.ssi.verifier',
  },
};

function resolveSlug(): TenantSlug {
  const raw = (process.env.EXPO_PUBLIC_TENANT_SLUG || '').trim().toLowerCase();
  if (raw === 'geyser' || raw === 'avaldao') return raw;
  return 'geyser';
}

export const tenantBrand: TenantBrand = brands[resolveSlug()];
