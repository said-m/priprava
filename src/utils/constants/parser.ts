import { PripravaInputSettingsInterface, PripravaModesEnum } from '../interfaces/priprava';

export const PRIPRAVA_KEY = '$temp';

export const PRIPRAVA_SETTING_DEFAULTS: PripravaInputSettingsInterface = {
  mode: {
    default: PripravaModesEnum.ignore,
    if: PripravaModesEnum.inherit,
    for: PripravaModesEnum.break,
    template: PripravaModesEnum.inherit,
  },
  interpolation: /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
  showStatus: false,
};
