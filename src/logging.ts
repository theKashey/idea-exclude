import {diary, enable} from 'diary';

const SCOPE = 'idea-exclude';

export const {log, error} = diary(SCOPE);

/**
 * Puts idea-exclude into debug mode, and thus logging to stdout. This mentod isnt reversable.
 */
export const debug = () => enable(SCOPE);
