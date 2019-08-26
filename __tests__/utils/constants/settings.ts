import { PRIPRAVA_SETTING_DEFAULTS } from '../../../src/utils/constants/parser';
import { PripravaOperatorSettingsInterface } from '../../../src/utils/interfaces/operators';
import { TEST_DATA } from './';

export const TEST_SETTINGS: PripravaOperatorSettingsInterface = {
  initial: PRIPRAVA_SETTING_DEFAULTS,
  scope: TEST_DATA,
};
