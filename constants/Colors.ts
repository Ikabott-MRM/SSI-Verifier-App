/**
 * App tint colors derived from the active tenant brand.
 * Avoid hard-coded AvalDAO purple as a global default.
 */
import { tenantBrand } from './brand';

const tintColorLight = tenantBrand.primaryDark;
const tintColorDark = tenantBrand.primary;

export default {
  light: {
    text: '#1A1A1A',
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: tenantBrand.primaryDark,
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
