import { PripravaModesEnum, PripravaModeSettingsInterface } from '../../../utils/interfaces/priprava';

export function getMode(
  mode: keyof PripravaModeSettingsInterface,
  collection: PripravaModeSettingsInterface,
): Exclude<PripravaModesEnum, PripravaModesEnum.inherit> {
  const def: keyof PripravaModeSettingsInterface = 'default';
  const inherit = PripravaModesEnum.inherit;
  const option = collection[mode];

  if (
    mode === def ||
    option === inherit
  ) {
    return collection[def];
  }

  return option;
}
