import { InputInterface } from 'iods';
import { PripravaOperatorParseInputInterface, PripravaOperatorParseOutputInterface, PripravaOperatorSettingsInterface } from '../utils/interfaces/priprava/operators';

/** Общие параметры обработчиков */
export abstract class AbstractParser {
  // Параметры
  readonly settings: PripravaOperatorSettingsInterface;

  // Инициализация обработки объектов
  constructor(
    input: InputInterface<PripravaOperatorSettingsInterface>,
  ) {
    this.settings = input.data;
  }

  // PUBLIC

  /** Процесс обработки декларирования */
  abstract parse(
    input: PripravaOperatorParseInputInterface,
  ): PripravaOperatorParseOutputInterface;
}
