import { normalize } from 'normalize-stitches';
import { globalCss } from '~/renderer/css';

export const normalizeStyles = globalCss({
  ...normalize,
});
