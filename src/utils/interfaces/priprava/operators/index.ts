import { InputInterface, OutputInterface, SimpleObjectInterface } from '../../common';
import { PripravaInputSettingsInterface, PripravaTemplateInterface } from '../parser';
import { PripravaForDescriptionInterface } from './for';
import { PripravaIfDescriptionInterface } from './if';

export * from './for';
export * from './if';

/** Операторы и их возможные комбинации */
export type PripravaOperatorsInterface =
  PripravaForDescriptionInterface &
  PripravaIfDescriptionInterface;
// // Следующий варик тупит в VS Code, подсказочки не выходят:
// export type PripravaOperatorsInterface = (
//   PripravaForDescriptionInterface |
//   PripravaIfDescriptionInterface |
//   (PripravaForDescriptionInterface & PripravaIfDescriptionInterface)
// );

/** Инициализация обработчиков операторов */
export type PripravaOperatorInitInterface = InputInterface<
  PripravaOperatorSettingsInterface
>;

/** Опции методов парсера */
export interface PripravaOperatorSettingsInterface {
  /** Переменные окружения */
  scope: SimpleObjectInterface;
  /** Настройки парсера */
  initial: PripravaInputSettingsInterface;
}

/** Входные данные парсинга оператора */
export type PripravaOperatorParseInputInterface<
  Input = unknown
> = InputInterface<
  PripravaTemplateInterface<Input>
> | undefined;

/** Результат парсинга оператора */
export type PripravaOperatorParseOutputInterface<
  Input = unknown
> = OutputInterface<
  PripravaTemplateInterface<Input>
> | undefined;

/** Результат парсинга строки */
export type PripravaStringParseOutputInterface = OutputInterface<
  string
> | undefined;
