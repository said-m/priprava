import { ApplyDeepInterface, ObjectInterface, TextInterface } from '@said-m/common/dist/interfaces';
import { OutputInterface } from 'iods';
import { PripravaOperatorsInterface } from './operators';

/** Инициализация парсера */
export interface PripravaInitInterface {
  /** Переменные окружения */
  data: ObjectInterface;
  /** Опции парсера */
  settings: Partial<PripravaInputSettingsInterface>;
}

/** Опции парсера */
export interface PripravaInputSettingsInterface {
  /** Режим работы парсера */
  mode: PripravaModeSettingsInterface;
  /** Флаг, управляющий выводом информации о прогрессе */
  showStatus: boolean;
  interpolation: RegExp;
}

/** Режимы работы парсера */
export interface PripravaModeSettingsInterface {
  default: Exclude<PripravaModesEnum, PripravaModesEnum.inherit>;
  if: PripravaModesEnum;
  for: PripravaModesEnum;
  template: PripravaModesEnum;
}

/**
 * Режим обработки исключений:
 * * `ignore` - вывод как есть,
 * * `break` - ничего не выводить
 * * `inherit` - наследование общей настройки
 */
export enum PripravaModesEnum {
  ignore = 'ignore',
  break = 'break',
  inherit = 'inherit',
}

/** Описание шаблона */
export type PripravaTemplateInterface<
  Input = unknown | Array<unknown>
> = TextInterface | ApplyDeepInterface<
  Input,
  PripravaDescriptionInterface
>;

/** Результат парсинга */
export type PripravaParserOutputInterface = OutputInterface<
  unknown,
  PripravaParserSettingsInterface
> | undefined;

/** Опции результата парсинга */
export interface PripravaParserSettingsInterface {
  /**
   * Флаг, сообщающий о необходимости раскрыть возвращаемый массив
   * (актуально, если он помещается в другой массив)
   */
  isFlatten?: true;
}

/** Описание оператора */
export type PripravaDescriptionInterface<
  Input = unknown,
  Operator = undefined
> = {
  /** Флаг, указывающий на то, что объект - установки для парсера */
  '$temp': boolean;
  /** Описание шаблона */
  template: PripravaTemplateInterface<Input>;
} & Partial<PripravaOperatorsInterface> & (
  Operator extends undefined
  ? object
  : Required<Operator>
);
