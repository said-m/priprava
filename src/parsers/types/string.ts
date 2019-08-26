import { InputInterface } from 'iods';
import { template } from 'lodash';
import { TextInterface } from '../../utils/interfaces/common';
import { PripravaStringParseOutputInterface } from '../../utils/interfaces/priprava/operators';
import { AbstractTypeParser } from './utils/abstract';

/** Обработчик объектов */
export class StringParser extends AbstractTypeParser {

  // PUBLIC

  parse(
    {
      data,
    }: InputInterface<TextInterface>,
  ): PripravaStringParseOutputInterface {
    try {
      // Парсим строку
      const parsed = template(
        data.toString(),
        {
          interpolate: this.settings.initial.interpolation,
        },
      )(this.settings.scope);

      // Возвращаем результат
      return {
        data: parsed,
      };
    } catch {
      return;
    }
  }
}
