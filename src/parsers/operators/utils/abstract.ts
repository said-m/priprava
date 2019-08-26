import { PripravaDescriptionInterface } from '../../../utils/interfaces';
import { AbstractParser } from '../../abstract';

export abstract class AbstractOperatorParser extends AbstractParser {
  /** Ключ объявления */
  static readonly key: string;

  /** Проверка объекта на описание оператора */
  static is(data: unknown): data is PripravaDescriptionInterface {
    return false;
  }

  /** Очистка объекта от параметров оператора */
  static clear(data: unknown): unknown {
    return data;
  }
}
