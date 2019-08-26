import { cloneDeep } from 'lodash';
import { PripravaInputSettingsInterface, PripravaModesEnum, PripravaModeSettingsInterface } from '../../../../src/utils/interfaces';
import { TEST_SETTINGS } from '../../../utils/constants';

export interface GetSettingModesOutputInterface {
  [PripravaModesEnum.break]: PripravaInputSettingsInterface;
  [PripravaModesEnum.ignore]: PripravaInputSettingsInterface;
}

export function getSettingModes(
  key: keyof PripravaModeSettingsInterface,
): GetSettingModesOutputInterface {
  const modes: Array<
    Exclude<PripravaModesEnum, PripravaModesEnum.inherit>
  > = [
    PripravaModesEnum.break,
    PripravaModesEnum.ignore,
  ];

  // @ts-ignore
  const result: GetSettingModesOutputInterface = {};

  modes.forEach(thisMode => {
    const thisSetting = cloneDeep(TEST_SETTINGS.initial);
    thisSetting.mode[key] = thisMode;

    result[thisMode] = thisSetting;
  });

  return result;
}
