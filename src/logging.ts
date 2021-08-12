import {diary, enable} from 'diary';

export const {log, error} = diary('idea-exclude');

/**
 * Puts idea-exclude into debug mode, and thus logging to stdout. This mentod isnt reversable.
 */
export const debug = () => enable('idea-exclude:*');
